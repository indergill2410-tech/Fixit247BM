#!/usr/bin/env bash
# =============================================================================
# verify-rls.sh — RLS verification script for FIX-20
# =============================================================================
# Run after applying each phase of migration 20260527100000_rls_enable_all_tables.
#
# Usage:
#   export SUPABASE_URL="https://<project-ref>.supabase.co"
#   export SUPABASE_ANON_KEY="sb_publishable_..."
#   export SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."
#   export USER_A_JWT="eyJ..."          # JWT from a real logged-in session for User A
#   export USER_A_ID="<uuid>"           # auth.uid() for User A (from Supabase Auth dashboard)
#   export USER_B_ID="<uuid>"           # A different user's id (must exist in users table)
#   export APP_URL="https://fixit247.com.au"
#   bash scripts/verify-rls.sh
#
# AFTER PHASES 1–4 ONLY (Phase 5 / users not yet applied):
#   Tests A and B should PASS.
#   Tests C, D, E will not be meaningful until Phase 5 is applied.
#   Run with: SKIP_PHASE5_TESTS=1 bash scripts/verify-rls.sh
#
# AFTER ALL PHASES (including Phase 5):
#   All tests should PASS.
#   Run with: bash scripts/verify-rls.sh
#
# See also: MANUAL VERIFICATION section at the bottom of this script.
# =============================================================================

set -euo pipefail

# ─── Colour helpers ───────────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
declare -a FAILURES=()

pass()  { echo -e "${GREEN}  PASS${NC}  $1"; ((PASS_COUNT++)); }
fail()  { echo -e "${RED}  FAIL${NC}  $1"; ((FAIL_COUNT++)); FAILURES+=("$1"); }
skip()  { echo -e "${YELLOW}  SKIP${NC}  $1"; ((SKIP_COUNT++)); }
info()  { echo -e "${CYAN}  ----${NC}  $1"; }

# ─── Environment validation ───────────────────────────────────────────────────
MISSING_VARS=()
for var in SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY; do
  case "$var" in
    SUPABASE_URL) [[ -z "${SUPABASE_URL:-}" ]] && MISSING_VARS+=("$var") ;;
    SUPABASE_ANON_KEY) [[ -z "${SUPABASE_ANON_KEY:-}" ]] && MISSING_VARS+=("$var") ;;
    SUPABASE_SERVICE_ROLE_KEY) [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]] && MISSING_VARS+=("$var") ;;
  esac
done

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
  echo -e "${RED}ERROR${NC}: Missing required environment variables:"
  for v in "${MISSING_VARS[@]}"; do echo "  $v"; done
  echo ""
  echo "Set them before running this script. See usage in the header."
  exit 1
fi

SKIP_PHASE5="${SKIP_PHASE5_TESTS:-0}"

echo ""
echo "============================================================"
echo " RLS Verification — FIX-20"
echo " Target: ${SUPABASE_URL}"
if [[ "$SKIP_PHASE5" == "1" ]]; then
  echo " Mode: Phases 1–4 only (SKIP_PHASE5_TESTS=1)"
fi
echo "============================================================"
echo ""

# ─── Helper: count rows in a JSON array response ─────────────────────────────
# Returns 0 on parse error (e.g. error response object instead of array)
count_rows() {
  RESPONSE="$1" python3 -c "
import json, os
try:
    data = json.loads(os.environ.get('RESPONSE', ''))
    if isinstance(data, list):
        print(len(data))
    else:
        print(-1)
except Exception:
    print(-1)
" 2>/dev/null || echo "-1"
}

# ─── Helper: HTTP GET via curl ────────────────────────────────────────────────
rest_get() {
  local url="$1"
  local auth_header="$2"
  curl -s \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${auth_header}" \
    -H "Accept: application/json" \
    -H "Prefer: count=none" \
    --max-time 10 \
    "$url"
}


# =============================================================================
# TEST A: Anon key — GET /rest/v1/users returns 0 rows
# =============================================================================
# Expected: After Phase 5 is applied, the anon role has no SELECT policy on
# users → default deny → empty array. (Before Phase 5, this will also return
# 0 rows because users is not yet RLS-enabled and this test passes vacuously —
# actually before any RLS, anon can read all rows. So this test is only
# meaningful after Phase 5. We run it regardless to catch regressions.)
# =============================================================================
echo "TEST A — Anon key cannot read the users table"
if [[ "$SKIP_PHASE5" == "1" ]]; then
  skip "A: Skipped (Phase 5 not yet applied — users table RLS not enabled)"
else
  RESP_A=$(rest_get "${SUPABASE_URL}/rest/v1/users?select=id,email&limit=10" \
    "${SUPABASE_ANON_KEY}")
  COUNT_A=$(count_rows "$RESP_A")
  if [[ "$COUNT_A" == "0" ]]; then
    pass "A: Anon → GET /rest/v1/users returns 0 rows"
  else
    fail "A: Anon → GET /rest/v1/users returned ${COUNT_A} rows — RLS NOT blocking"
    info "   Response sample: $(echo "$RESP_A" | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d[:2], indent=2))" 2>/dev/null)"
  fi
fi
echo ""

# =============================================================================
# TEST B: Anon key — GET /rest/v1/jobs returns 0 rows
# =============================================================================
# Covers Phases 1–4 tables. This test is valid once Phase 3 is applied.
# After Phase 3: default-deny on jobs → anon sees nothing.
# =============================================================================
echo "TEST B — Anon key cannot read the jobs table (Phase 3 coverage)"
RESP_B=$(rest_get "${SUPABASE_URL}/rest/v1/jobs?select=id&limit=10" \
  "${SUPABASE_ANON_KEY}")
COUNT_B=$(count_rows "$RESP_B")
if [[ "$COUNT_B" == "0" ]]; then
  pass "B: Anon → GET /rest/v1/jobs returns 0 rows"
else
  fail "B: Anon → GET /rest/v1/jobs returned ${COUNT_B} rows — Phase 3 RLS NOT active"
fi

# Also spot-check a Phase 1 config table and a Phase 4 profile table
RESP_B2=$(rest_get "${SUPABASE_URL}/rest/v1/platform_config?select=id&limit=5" \
  "${SUPABASE_ANON_KEY}")
COUNT_B2=$(count_rows "$RESP_B2")
if [[ "$COUNT_B2" == "0" ]]; then
  pass "B2: Anon → GET /rest/v1/platform_config returns 0 rows"
else
  fail "B2: Anon → GET /rest/v1/platform_config returned ${COUNT_B2} rows — Phase 1 RLS NOT active"
fi

RESP_B3=$(rest_get "${SUPABASE_URL}/rest/v1/customer_profiles?select=id&limit=5" \
  "${SUPABASE_ANON_KEY}")
COUNT_B3=$(count_rows "$RESP_B3")
if [[ "$COUNT_B3" == "0" ]]; then
  pass "B3: Anon → GET /rest/v1/customer_profiles returns 0 rows"
else
  fail "B3: Anon → GET /rest/v1/customer_profiles returned ${COUNT_B3} rows — Phase 4 RLS NOT active"
fi
echo ""

# =============================================================================
# TEST C: User A's JWT — can read their own row from users
# =============================================================================
# Requires Phase 5. The users_select_own policy allows auth.uid() = id.
# =============================================================================
echo "TEST C — Authenticated user can read their own row (Phase 5)"
if [[ "$SKIP_PHASE5" == "1" ]]; then
  skip "C: Skipped (Phase 5 not yet applied)"
elif [[ -z "${USER_A_JWT:-}" ]] || [[ -z "${USER_A_ID:-}" ]]; then
  skip "C: USER_A_JWT or USER_A_ID not set"
else
  RESP_C=$(rest_get \
    "${SUPABASE_URL}/rest/v1/users?id=eq.${USER_A_ID}&select=id,email,role" \
    "${USER_A_JWT}")
  COUNT_C=$(count_rows "$RESP_C")
  if [[ "$COUNT_C" == "1" ]]; then
    RETURNED_ID=$(echo "$RESP_C" | python3 -c \
      "import json,sys; d=json.load(sys.stdin); print(d[0].get('id',''))" 2>/dev/null)
    if [[ "$RETURNED_ID" == "$USER_A_ID" ]]; then
      pass "C: User A JWT → own row returned (id matches USER_A_ID)"
    else
      fail "C: User A JWT → 1 row returned but id='${RETURNED_ID}' != USER_A_ID='${USER_A_ID}'"
    fi
  elif [[ "$COUNT_C" == "0" ]]; then
    fail "C: User A JWT → 0 rows returned — policy may be missing or USER_A_ID is wrong"
    info "   Check: USER_A_ID=${USER_A_ID} exists in users table?"
    info "   Check: USER_A_JWT is a valid non-expired Supabase session JWT?"
  else
    fail "C: User A JWT → ${COUNT_C} rows returned — policy is too permissive"
  fi
fi
echo ""

# =============================================================================
# TEST D: User A's JWT — cannot read User B's row
# =============================================================================
# Requires Phase 5. auth.uid() = User A, querying User B's id → 0 rows.
# =============================================================================
echo "TEST D — User A cannot read User B's row"
if [[ "$SKIP_PHASE5" == "1" ]]; then
  skip "D: Skipped (Phase 5 not yet applied)"
elif [[ -z "${USER_A_JWT:-}" ]] || [[ -z "${USER_B_ID:-}" ]]; then
  skip "D: USER_A_JWT or USER_B_ID not set"
elif [[ "${USER_A_ID:-}" == "${USER_B_ID}" ]]; then
  skip "D: USER_A_ID == USER_B_ID — choose a different user for USER_B_ID"
else
  RESP_D=$(rest_get \
    "${SUPABASE_URL}/rest/v1/users?id=eq.${USER_B_ID}&select=id,email" \
    "${USER_A_JWT}")
  COUNT_D=$(count_rows "$RESP_D")
  if [[ "$COUNT_D" == "0" ]]; then
    pass "D: User A JWT → User B's row returns 0 rows (cross-user read blocked)"
  else
    fail "D: User A JWT → User B's row returned ${COUNT_D} rows — policy is NOT restricting to own row"
  fi
fi
echo ""

# =============================================================================
# TEST E: Service-role key — reads all rows (RLS bypass confirmed)
# =============================================================================
# Service-role key bypasses RLS. Must return >= 1 row from users to confirm
# the bypass is working (and that we didn't accidentally use FORCE RLS).
# =============================================================================
echo "TEST E — Service-role key bypasses RLS and reads all rows"
if [[ "$SKIP_PHASE5" == "1" ]]; then
  skip "E: Skipped (Phase 5 not yet applied — RLS bypass test not meaningful)"
else
  RESP_E=$(curl -sf \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Accept: application/json" \
    -H "Prefer: count=none" \
    --max-time 10 \
    "${SUPABASE_URL}/rest/v1/users?select=id&limit=5" 2>/dev/null || echo "[]")
  COUNT_E=$(count_rows "$RESP_E")
  if [[ "$COUNT_E" -ge 1 ]]; then
    pass "E: Service-role → users returns ${COUNT_E} rows (RLS bypass working)"
  elif [[ "$COUNT_E" == "0" ]]; then
    fail "E: Service-role → users returned 0 rows"
    info "   Possible cause: FORCE ROW LEVEL SECURITY was accidentally used."
    info "   Check: SELECT relforcerowsecurity FROM pg_class WHERE relname='users';"
    info "   If true, run: ALTER TABLE users NO FORCE ROW LEVEL SECURITY;"
    info "   Also possible: users table is empty (check Supabase Auth dashboard)."
  fi
fi
echo ""


# =============================================================================
# SUMMARY
# =============================================================================
echo "============================================================"
echo " Results"
echo "============================================================"
echo -e " ${GREEN}Passed${NC}: ${PASS_COUNT}"
echo -e " ${RED}Failed${NC}: ${FAIL_COUNT}"
echo -e " ${YELLOW}Skipped${NC}: ${SKIP_COUNT}"

if [[ ${FAIL_COUNT} -gt 0 ]]; then
  echo ""
  echo -e " ${RED}FAILED TESTS:${NC}"
  for e in "${FAILURES[@]}"; do
    echo "   • $e"
  done
  echo ""
  echo " DO NOT proceed to the next phase or production until all"
  echo " non-skipped tests pass."
  echo "============================================================"
  exit 1
fi

echo ""
if [[ "$SKIP_PHASE5" == "1" ]]; then
  echo -e " ${YELLOW}NOTE${NC}: Phase 5 tests were skipped. Re-run without"
  echo " SKIP_PHASE5_TESTS=1 after applying Phase 5."
else
  echo -e " ${GREEN}ALL TESTS PASSED${NC}"
fi
echo "============================================================"
exit 0


# =============================================================================
# MANUAL VERIFICATION — Test F (app middleware end-to-end)
# =============================================================================
#
# This verifies the live in-app path: middleware.ts queries the users table
# via PostgREST using the session JWT from the browser cookie. It must be done
# manually because it requires an interactive browser session.
#
# Run AFTER all phases have been applied and automated tests A–E pass.
#
# Steps:
#
# 1. Open an incognito / private browser window.
#
# 2. Navigate to https://fixit247.com.au/login (or your staging URL).
#
# 3. Log in with a real CUSTOMER account.
#
# 4. Confirm you land on /dashboard (or are redirected there after login).
#    - Expected: page loads fully with the customer's name visible.
#    - Failure: redirect loop back to /login, or a blank/error page.
#
# 5. Open DevTools → Network tab. Refresh the page.
#    Confirm there are NO 401 or 403 responses from /rest/v1/users.
#    (The middleware makes this call internally — it will not appear as a
#    browser-initiated XHR, but a 401 from PostgREST would surface as a
#    redirect to /login, which you would see as a redirect chain.)
#
# 6. Repeat steps 2–5 with a TRADIE account and confirm you land on
#    /tradie/dashboard with the tradie's business name visible.
#
# 7. Hit /api/health and confirm HTTP 200 is returned.
#    This is a Prisma-only path and confirms the superuser bypass is intact.
#    curl -s -o /dev/null -w "%{http_code}" https://fixit247.com.au/api/health
#    Expected output: 200
#
# PASS criteria:
#   - Customer lands on /dashboard without redirect loop.
#   - Tradie lands on /tradie/dashboard without redirect loop.
#   - /api/health returns 200.
#
# FAIL criteria (investigate immediately):
#   - Any redirect back to /login after a successful login attempt.
#   - "Unauthorized" or "Forbidden" shown on a protected page.
#   - /api/health returns non-200.
#
# If any failure occurs, check:
#   - Supabase SQL editor: SELECT relrowsecurity, relforcerowsecurity
#       FROM pg_class WHERE relname = 'users';
#     relrowsecurity should be true; relforcerowsecurity should be false.
#   - Supabase Auth dashboard: confirm the test user exists in both the
#     auth.users table AND the public.users table with a matching id.
#   - Middleware logs (Render dashboard) for "Failed to read user row" errors.
# =============================================================================
