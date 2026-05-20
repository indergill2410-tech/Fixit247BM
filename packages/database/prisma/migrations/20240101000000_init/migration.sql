-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'TRADIE', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'OPEN', 'CLAIMED', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "JobPriority" AS ENUM ('STANDARD', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "TradeCategory" AS ENUM ('PLUMBING', 'ELECTRICAL', 'HVAC', 'CARPENTRY', 'PAINTING', 'ROOFING', 'TILING', 'PEST_CONTROL', 'LOCKSMITH', 'GLAZING', 'PLASTERING', 'LANDSCAPING', 'CLEANING', 'APPLIANCE_REPAIR', 'GENERAL_MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'HELD_IN_ESCROW', 'RELEASED', 'REFUNDED', 'DISPUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('JOB_CREATED', 'JOB_ASSIGNED', 'JOB_ACCEPTED', 'JOB_DECLINED', 'TRADIE_EN_ROUTE', 'TRADIE_ARRIVED', 'JOB_STARTED', 'JOB_COMPLETED', 'PAYMENT_HELD', 'PAYMENT_RELEASED', 'PAYMENT_FAILED', 'DISPUTE_OPENED', 'DISPUTE_RESOLVED', 'NEW_MESSAGE', 'CREDIT_LOW', 'SUBSCRIPTION_RENEWED', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'SYSTEM_ALERT');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('INCOMPLETE', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TradeBadge" AS ENUM ('VERIFIED', 'PREMIUM', 'ELITE', 'EMERGENCY_SPECIALIST', 'TOP_RATED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_RESET', 'EMAIL_VERIFIED', 'ROLE_CHANGED', 'PROFILE_UPDATED', 'DOCUMENT_UPLOADED', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'PAYMENT_INITIATED', 'PAYMENT_RELEASED', 'JOB_CREATED', 'JOB_CLAIMED', 'JOB_COMPLETED', 'DISPUTE_OPENED', 'DISPUTE_RESOLVED', 'ACCOUNT_SUSPENDED', 'ACCOUNT_REINSTATED');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL', 'ELITE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAUSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'PAYOUT', 'REFUND', 'PLATFORM_FEE', 'CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'FALLBACK');

-- CreateEnum
CREATE TYPE "JobEventType" AS ENUM ('CREATED', 'AI_PROCESSED', 'MATCHING_STARTED', 'OFFER_SENT', 'OFFER_ACCEPTED', 'OFFER_DECLINED', 'OFFER_EXPIRED', 'REASSIGNED', 'TRADIE_EN_ROUTE', 'TRADIE_ARRIVED', 'WORK_STARTED', 'WORK_COMPLETED', 'PAYMENT_REQUESTED', 'PAYMENT_RECEIVED', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OnlineStatus" AS ENUM ('ONLINE', 'OFFLINE', 'BUSY', 'EMERGENCY_ONLY', 'AWAY');

-- CreateEnum
CREATE TYPE "JobComplexity" AS ENUM ('SIMPLE', 'MEDIUM', 'COMPLEX');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'HELD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SurgeFactor" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CreditTransactionType" AS ENUM ('PURCHASE', 'JOB_DEDUCTION', 'BONUS', 'REFUND', 'ADMIN_ADJUSTMENT', 'REFERRAL', 'SUBSCRIPTION_CREDIT');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM', 'STATUS_UPDATE', 'VOICE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "NotifStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "NotifChannel" AS ENUM ('IN_APP', 'EMAIL', 'PUSH', 'SMS');

-- CreateEnum
CREATE TYPE "FraudFlagType" AS ENUM ('FAKE_JOB', 'DUPLICATE_ACCOUNT', 'PAYMENT_ABUSE', 'EXCESSIVE_REFUNDS', 'LOCATION_SPOOFING', 'FAKE_REVIEW', 'BOT_ACTIVITY', 'SUSPICIOUS_MESSAGING', 'TRADIE_COLLUSION', 'EXCESSIVE_CANCELLATIONS', 'MULTI_ACCOUNT', 'OTHER');

-- CreateEnum
CREATE TYPE "FraudSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FraudFlagStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED_SAFE', 'RESOLVED_FRAUD', 'ESCALATED', 'AUTO_SUSPENDED');

-- CreateEnum
CREATE TYPE "DisputeReason" AS ENUM ('INCOMPLETE_WORK', 'NO_SHOW', 'PAYMENT_DISAGREEMENT', 'DAMAGE_CLAIM', 'REFUND_REQUEST', 'EMERGENCY_COMPLAINT', 'QUALITY_ISSUE', 'OTHER');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'AWAITING_EVIDENCE', 'MEDIATION', 'RESOLVED_CUSTOMER', 'RESOLVED_TRADIE', 'RESOLVED_SPLIT', 'CLOSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "ModerationActionType" AS ENUM ('WARNING', 'TEMPORARY_SUSPENSION', 'PERMANENT_SUSPENSION', 'ACCOUNT_REINSTATEMENT', 'PROFILE_FLAG', 'REVIEW_REMOVAL', 'PAYOUT_HOLD', 'PAYOUT_RELEASE', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'TRUST_SCORE_OVERRIDE', 'FRAUD_FLAG_DISMISSED', 'FRAUD_FLAG_CONFIRMED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('PAYMENT', 'JOB_ISSUE', 'ACCOUNT', 'TECHNICAL', 'FRAUD', 'OTHER');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('FRAUD_SPIKE', 'PAYMENT_FAILURE', 'DISPATCH_FAILURE', 'UNUSUAL_REFUNDS', 'SYSTEM_ERROR', 'REVENUE_DROP', 'HIGH_DISPUTE_RATE', 'TRADIE_SHORTAGE');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'DISMISSED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'SIGNED_UP', 'COMPLETED', 'REWARDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReferralRewardType" AS ENUM ('CREDITS', 'SUBSCRIPTION_DISCOUNT', 'CASH_EQUIVALENT', 'FREE_LEADS');

-- CreateEnum
CREATE TYPE "SEOPageType" AS ENUM ('SUBURB_TRADE', 'EMERGENCY_SERVICE', 'TRADIE_PROFILE', 'SUBURB_LANDING', 'TRADE_LANDING', 'BLOG_ARTICLE', 'FAQ_PAGE');

-- CreateEnum
CREATE TYPE "GrowthEventType" AS ENUM ('PAGE_VIEW', 'CTA_CLICK', 'JOB_STARTED', 'JOB_COMPLETED', 'REFERRAL_SENT', 'REFERRAL_CONVERTED', 'REVIEW_SUBMITTED', 'SIGNUP_STARTED', 'SIGNUP_COMPLETED', 'TRADIE_SIGNUP_STARTED', 'TRADIE_SIGNUP_COMPLETED', 'TRADIE_FIRST_JOB', 'SUBURB_EXPANDED', 'CONTENT_GENERATED', 'EMAIL_OPENED', 'EMAIL_CLICKED', 'PUSH_CLICKED');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'PUSH', 'SMS', 'REFERRAL', 'SEO', 'PAID_SOCIAL', 'RETARGETING');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReviewRequestStatus" AS ENUM ('PENDING', 'SENT', 'REVIEWED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('INITIATED', 'RINGING', 'IN_PROGRESS', 'AI_HANDLING', 'HUMAN_TAKEOVER', 'COMPLETED', 'FAILED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "CallDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "VoiceEventType" AS ENUM ('CALL_STARTED', 'CALL_ANSWERED', 'SPEECH_DETECTED', 'TRANSCRIPTION_RECEIVED', 'EMERGENCY_DETECTED', 'JOB_CREATED', 'DISPATCH_TRIGGERED', 'TRADIE_ASSIGNED', 'HUMAN_TAKEOVER_REQUESTED', 'HUMAN_TOOK_OVER', 'CALL_ENDED', 'AI_CONFIDENCE_LOW', 'ESCALATION_TRIGGERED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'LIFE_THREATENING');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'GATHERING_INFO', 'CONFIRMING', 'JOB_CREATED', 'DISPATCHING', 'COMPLETED', 'ABANDONED', 'ESCALATED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "phone" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "lastIpAddress" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID,
    "action" "AuditAction" NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "suburb" TEXT,
    "postcode" TEXT,
    "state" TEXT,
    "defaultAddressId" UUID,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "notifyBySms" BOOLEAN NOT NULL DEFAULT true,
    "notifyByEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyByPush" BOOLEAN NOT NULL DEFAULT true,
    "creditBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "jobsPosted" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tradie_profiles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "businessName" TEXT,
    "abn" TEXT,
    "bio" TEXT,
    "trades" "TradeCategory"[],
    "yearsExperience" INTEGER,
    "hourlyRate" DECIMAL(10,2),
    "calloutFee" DECIMAL(10,2),
    "serviceRadiusKm" INTEGER NOT NULL DEFAULT 25,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isEmergencyAvailable" BOOLEAN NOT NULL DEFAULT false,
    "acceptsSameDay" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "onboardingStep" INTEGER NOT NULL DEFAULT 1,
    "stripeAccountId" TEXT,
    "stripeOnboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "avgRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalJobsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "responseTimeMinutes" INTEGER,
    "completionRate" DECIMAL(5,2) NOT NULL DEFAULT 100,
    "cancellationRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "trustScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "trustBadges" "TradeBadge"[],
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "rankScore" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tradie_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tradie_documents" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "expiresAt" TIMESTAMP(3),
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "tradie_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tradie_portfolios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "beforeImageUrl" TEXT,
    "afterImageUrl" TEXT,
    "category" "TradeCategory" NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tradie_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_category_configs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "emergencyAvailable" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "trade_category_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_settings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "maxRadius" INTEGER NOT NULL DEFAULT 25,
    "responseTimeMinutes" INTEGER NOT NULL DEFAULT 30,
    "surchargePercent" DECIMAL(5,2) NOT NULL DEFAULT 50,
    "autoAccept" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "customerProfileId" UUID,
    "label" TEXT,
    "street" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'AU',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_tradies" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "customerId" UUID NOT NULL,
    "tradieId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_tradies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "customerId" UUID NOT NULL,
    "tradieId" UUID,
    "addressId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "TradeCategory" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "JobPriority" NOT NULL DEFAULT 'STANDARD',
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "scheduledFor" TIMESTAMP(3),
    "estimatedHours" DECIMAL(5,2),
    "agreedPrice" DECIMAL(10,2),
    "finalPrice" DECIMAL(10,2),
    "platformFee" DECIMAL(10,2),
    "tradieEarnings" DECIMAL(10,2),
    "aiMatchScore" DECIMAL(5,4),
    "aiSuggestedTradies" UUID[],
    "claimedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "budgetMin" DECIMAL(10,2),
    "budgetMax" DECIMAL(10,2),
    "complexity" "JobComplexity" NOT NULL DEFAULT 'MEDIUM',
    "mediaUrls" TEXT[],
    "voiceNoteUrl" TEXT,
    "preferredTime" TEXT,
    "leadPrice" DECIMAL(8,2),
    "matchingBatchNo" INTEGER NOT NULL DEFAULT 0,
    "aiProcessedAt" TIMESTAMP(3),
    "offerExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_claims" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "tradieId" UUID NOT NULL,
    "message" TEXT,
    "quotedPrice" DECIMAL(10,2) NOT NULL,
    "estimatedHours" DECIMAL(5,2),
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "acceptedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_status_history" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "fromStatus" "JobStatus",
    "toStatus" "JobStatus" NOT NULL,
    "note" TEXT,
    "changedBy" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_images" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "uploadedBy" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "revieweeId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "responseText" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "receiverId" UUID,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "jobId" UUID,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "status" "NotifStatus" NOT NULL DEFAULT 'PENDING',
    "channel" "NotifChannel" NOT NULL DEFAULT 'IN_APP',
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "tradieId" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "platformFee" DECIMAL(10,2) NOT NULL,
    "tradieAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AUD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentIntentId" TEXT,
    "stripeTransferId" TEXT,
    "stripeCustomerId" TEXT,
    "paidAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundAmount" DECIMAL(10,2),
    "refundReason" TEXT,
    "disputeId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credits_wallets" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "lifetimeEarned" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lifetimeSpent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credits_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "walletId" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "balanceAfter" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licences" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "licenceType" TEXT NOT NULL,
    "licenceNumber" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurances" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "insurer" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "coverType" TEXT NOT NULL,
    "coverAmount" DECIMAL(12,2) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "documentUrl" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insurances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_matching_queue" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "tradieId" UUID NOT NULL,
    "batchNumber" INTEGER NOT NULL DEFAULT 1,
    "matchScore" DECIMAL(8,4) NOT NULL,
    "distanceKm" DECIMAL(8,2),
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "declineReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_matching_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "type" "JobEventType" NOT NULL,
    "actorId" UUID,
    "actorRole" "Role",
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tradie_realtime_status" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "onlineStatus" "OnlineStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastHeartbeatAt" TIMESTAMP(3),
    "currentJobId" UUID,
    "activeJobCount" INTEGER NOT NULL DEFAULT 0,
    "travelRadiusKm" INTEGER NOT NULL DEFAULT 25,
    "currentLatitude" DECIMAL(10,7),
    "currentLongitude" DECIMAL(10,7),
    "isAutoAccept" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tradie_realtime_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_job_insights" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "rawInput" TEXT NOT NULL,
    "extractedCategory" "TradeCategory" NOT NULL,
    "complexity" "JobComplexity" NOT NULL DEFAULT 'MEDIUM',
    "urgencyScore" INTEGER NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "isEmergencyDetected" BOOLEAN NOT NULL DEFAULT false,
    "emergencyIndicators" TEXT[],
    "suggestedTitle" TEXT NOT NULL,
    "professionalSummary" TEXT NOT NULL,
    "suggestedMaterials" TEXT[],
    "estimatedPriceMin" DECIMAL(10,2),
    "estimatedPriceMax" DECIMAL(10,2),
    "leadPrice" DECIMAL(8,2),
    "suggestedTrades" TEXT[],
    "imageAnalysis" JSONB,
    "voiceTranscript" TEXT,
    "modelUsed" TEXT,
    "processingMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_job_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "jobId" UUID,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AUD',
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "stripeTransferId" TEXT,
    "stripePayoutId" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "isHeld" BOOLEAN NOT NULL DEFAULT false,
    "heldReason" TEXT,
    "heldBy" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_packages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "priceAud" DECIMAL(8,2) NOT NULL,
    "bonusCredits" INTEGER NOT NULL DEFAULT 0,
    "stripePriceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_ledger" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "type" "CreditTransactionType" NOT NULL,
    "credits" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "jobId" UUID,
    "packageId" UUID,
    "referenceId" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_config" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "updatedBy" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surge_pricing_rules" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "factor" "SurgeFactor" NOT NULL,
    "multiplier" DECIMAL(4,2) NOT NULL,
    "startHour" INTEGER,
    "endHour" INTEGER,
    "daysOfWeek" INTEGER[],
    "tradeCategories" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surge_pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStart" INTEGER,
    "quietHoursEnd" INTEGER,
    "disabledTypes" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_tracking" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "jobId" UUID,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_score_history" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tradieId" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "previousScore" INTEGER,
    "reason" TEXT NOT NULL,
    "jobId" UUID,
    "adminId" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_score_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_flags" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "type" "FraudFlagType" NOT NULL,
    "severity" "FraudSeverity" NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "status" "FraudFlagStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidence" JSONB,
    "jobId" UUID,
    "reviewedBy" UUID,
    "reviewedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "autoDetected" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fraud_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "tradieId" UUID NOT NULL,
    "reason" "DisputeReason" NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidenceUrls" TEXT[],
    "adminNotes" TEXT,
    "resolution" TEXT,
    "refundAmount" DECIMAL(10,2),
    "assignedTo" UUID,
    "resolvedBy" UUID,
    "resolvedAt" TIMESTAMP(3),
    "dueBy" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_actions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "adminId" UUID NOT NULL,
    "targetUserId" UUID NOT NULL,
    "actionType" "ModerationActionType" NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_log" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "adminId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "jobId" UUID,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'NORMAL',
    "category" "TicketCategory" NOT NULL,
    "assignedTo" UUID,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_messages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "ticketId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_alerts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "dismissedBy" UUID,
    "dismissedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "inviterId" UUID NOT NULL,
    "invitedEmail" TEXT,
    "invitedUserId" UUID,
    "code" TEXT NOT NULL,
    "rewardType" "ReferralRewardType" NOT NULL,
    "rewardValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "rewardedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_pages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "slug" TEXT NOT NULL,
    "pageType" "SEOPageType" NOT NULL,
    "title" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "h1" TEXT NOT NULL,
    "suburb" TEXT,
    "state" TEXT,
    "tradeCategory" TEXT,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "content" JSONB,
    "faqContent" JSONB,
    "schemaMarkup" JSONB,
    "canonicalUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "lastGeneratedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "indexable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "growth_events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID,
    "sessionId" TEXT,
    "eventType" "GrowthEventType" NOT NULL,
    "page" TEXT,
    "referrer" TEXT,
    "suburb" TEXT,
    "metadata" JSONB,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "growth_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suburb_metrics" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "suburb" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postcode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "demandScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "supplyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgResponseTime" DOUBLE PRECISION,
    "jobCount30d" INTEGER NOT NULL DEFAULT 0,
    "tradieCount" INTEGER NOT NULL DEFAULT 0,
    "isUnderserved" BOOLEAN NOT NULL DEFAULT false,
    "expansionPriority" INTEGER NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suburb_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_campaigns" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "targetAudience" JSONB,
    "content" JSONB,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "conversionCount" INTEGER NOT NULL DEFAULT 0,
    "revenueGenerated" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costSpent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_requests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "tradieId" UUID NOT NULL,
    "status" "ReviewRequestStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_programs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "targetRole" "Role" NOT NULL,
    "rewardType" "ReferralRewardType" NOT NULL,
    "rewardValue" DECIMAL(10,2) NOT NULL,
    "inviterRewardType" "ReferralRewardType" NOT NULL,
    "inviterRewardValue" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxRewardsPerUser" INTEGER NOT NULL DEFAULT 10,
    "expiryDays" INTEGER NOT NULL DEFAULT 30,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_calls" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "twilioCallSid" TEXT,
    "customerId" UUID,
    "phoneNumber" TEXT NOT NULL,
    "direction" "CallDirection" NOT NULL,
    "status" "CallStatus" NOT NULL DEFAULT 'INITIATED',
    "duration" INTEGER,
    "recordingUrl" TEXT,
    "transcript" TEXT,
    "urgencyScore" INTEGER,
    "aiConfidence" DOUBLE PRECISION,
    "jobId" UUID,
    "assignedAgentId" UUID,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answeredAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "voice_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "callId" UUID NOT NULL,
    "eventType" "VoiceEventType" NOT NULL,
    "payload" JSONB,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_assessments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID,
    "callId" UUID,
    "riskLevel" "RiskLevel" NOT NULL,
    "emergencyScore" INTEGER NOT NULL,
    "detectedKeywords" TEXT[],
    "tradeCategory" TEXT,
    "recommendedAction" TEXT NOT NULL,
    "safetyInstructions" TEXT[],
    "autoDispatch" BOOLEAN NOT NULL DEFAULT false,
    "adminAlerted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "jobId" UUID,
    "callId" UUID,
    "sessionId" TEXT NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "messages" JSONB NOT NULL,
    "extractedEntities" JSONB,
    "aiSummary" TEXT,
    "tradeCategory" TEXT,
    "urgencyScore" INTEGER,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "jobData" JSONB,
    "turnCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resourceId_idx" ON "audit_logs"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_userId_key" ON "customer_profiles"("userId");

-- CreateIndex
CREATE INDEX "customer_profiles_userId_idx" ON "customer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tradie_profiles_userId_key" ON "tradie_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tradie_profiles_abn_key" ON "tradie_profiles"("abn");

-- CreateIndex
CREATE UNIQUE INDEX "tradie_profiles_stripeAccountId_key" ON "tradie_profiles"("stripeAccountId");

-- CreateIndex
CREATE INDEX "tradie_profiles_verificationStatus_idx" ON "tradie_profiles"("verificationStatus");

-- CreateIndex
CREATE INDEX "tradie_profiles_isAvailable_idx" ON "tradie_profiles"("isAvailable");

-- CreateIndex
CREATE INDEX "tradie_profiles_isEmergencyAvailable_idx" ON "tradie_profiles"("isEmergencyAvailable");

-- CreateIndex
CREATE INDEX "tradie_profiles_isFeatured_idx" ON "tradie_profiles"("isFeatured");

-- CreateIndex
CREATE INDEX "tradie_profiles_rankScore_idx" ON "tradie_profiles"("rankScore");

-- CreateIndex
CREATE INDEX "tradie_profiles_avgRating_idx" ON "tradie_profiles"("avgRating");

-- CreateIndex
CREATE INDEX "tradie_documents_tradieId_idx" ON "tradie_documents"("tradieId");

-- CreateIndex
CREATE INDEX "tradie_documents_status_idx" ON "tradie_documents"("status");

-- CreateIndex
CREATE INDEX "tradie_documents_type_idx" ON "tradie_documents"("type");

-- CreateIndex
CREATE INDEX "tradie_portfolios_tradieId_idx" ON "tradie_portfolios"("tradieId");

-- CreateIndex
CREATE INDEX "tradie_portfolios_category_idx" ON "tradie_portfolios"("category");

-- CreateIndex
CREATE UNIQUE INDEX "trade_category_configs_slug_key" ON "trade_category_configs"("slug");

-- CreateIndex
CREATE INDEX "trade_category_configs_slug_idx" ON "trade_category_configs"("slug");

-- CreateIndex
CREATE INDEX "trade_category_configs_isActive_idx" ON "trade_category_configs"("isActive");

-- CreateIndex
CREATE INDEX "trade_category_configs_displayOrder_idx" ON "trade_category_configs"("displayOrder");

-- CreateIndex
CREATE INDEX "availability_tradieId_idx" ON "availability"("tradieId");

-- CreateIndex
CREATE UNIQUE INDEX "availability_tradieId_dayOfWeek_key" ON "availability"("tradieId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_settings_tradieId_key" ON "emergency_settings"("tradieId");

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE INDEX "addresses_customerProfileId_idx" ON "addresses"("customerProfileId");

-- CreateIndex
CREATE INDEX "addresses_deletedAt_idx" ON "addresses"("deletedAt");

-- CreateIndex
CREATE INDEX "saved_tradies_customerId_idx" ON "saved_tradies"("customerId");

-- CreateIndex
CREATE INDEX "saved_tradies_tradieId_idx" ON "saved_tradies"("tradieId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_tradies_customerId_tradieId_key" ON "saved_tradies"("customerId", "tradieId");

-- CreateIndex
CREATE INDEX "jobs_customerId_idx" ON "jobs"("customerId");

-- CreateIndex
CREATE INDEX "jobs_tradieId_idx" ON "jobs"("tradieId");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_category_idx" ON "jobs"("category");

-- CreateIndex
CREATE INDEX "jobs_priority_idx" ON "jobs"("priority");

-- CreateIndex
CREATE INDEX "jobs_isEmergency_idx" ON "jobs"("isEmergency");

-- CreateIndex
CREATE INDEX "jobs_scheduledFor_idx" ON "jobs"("scheduledFor");

-- CreateIndex
CREATE INDEX "jobs_createdAt_idx" ON "jobs"("createdAt");

-- CreateIndex
CREATE INDEX "job_claims_jobId_idx" ON "job_claims"("jobId");

-- CreateIndex
CREATE INDEX "job_claims_tradieId_idx" ON "job_claims"("tradieId");

-- CreateIndex
CREATE INDEX "job_claims_isAccepted_idx" ON "job_claims"("isAccepted");

-- CreateIndex
CREATE INDEX "job_status_history_jobId_idx" ON "job_status_history"("jobId");

-- CreateIndex
CREATE INDEX "job_status_history_createdAt_idx" ON "job_status_history"("createdAt");

-- CreateIndex
CREATE INDEX "job_images_jobId_idx" ON "job_images"("jobId");

-- CreateIndex
CREATE INDEX "job_images_type_idx" ON "job_images"("type");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_jobId_key" ON "reviews"("jobId");

-- CreateIndex
CREATE INDEX "reviews_revieweeId_idx" ON "reviews"("revieweeId");

-- CreateIndex
CREATE INDEX "reviews_reviewerId_idx" ON "reviews"("reviewerId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "reviews_isPublic_idx" ON "reviews"("isPublic");

-- CreateIndex
CREATE INDEX "messages_jobId_idx" ON "messages"("jobId");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "messages_receiverId_idx" ON "messages"("receiverId");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "messages"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_jobId_idx" ON "notifications"("jobId");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payments_jobId_key" ON "payments"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "payments_customerId_idx" ON "payments"("customerId");

-- CreateIndex
CREATE INDEX "payments_tradieId_idx" ON "payments"("tradieId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_tier_idx" ON "subscriptions"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "credits_wallets_userId_key" ON "credits_wallets"("userId");

-- CreateIndex
CREATE INDEX "transactions_walletId_idx" ON "transactions"("walletId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- CreateIndex
CREATE INDEX "licences_tradieId_idx" ON "licences"("tradieId");

-- CreateIndex
CREATE INDEX "licences_status_idx" ON "licences"("status");

-- CreateIndex
CREATE INDEX "insurances_tradieId_idx" ON "insurances"("tradieId");

-- CreateIndex
CREATE INDEX "insurances_status_idx" ON "insurances"("status");

-- CreateIndex
CREATE INDEX "certifications_tradieId_idx" ON "certifications"("tradieId");

-- CreateIndex
CREATE INDEX "certifications_status_idx" ON "certifications"("status");

-- CreateIndex
CREATE INDEX "job_matching_queue_jobId_idx" ON "job_matching_queue"("jobId");

-- CreateIndex
CREATE INDEX "job_matching_queue_tradieId_idx" ON "job_matching_queue"("tradieId");

-- CreateIndex
CREATE INDEX "job_matching_queue_status_idx" ON "job_matching_queue"("status");

-- CreateIndex
CREATE INDEX "job_matching_queue_batchNumber_idx" ON "job_matching_queue"("batchNumber");

-- CreateIndex
CREATE INDEX "job_matching_queue_expiresAt_idx" ON "job_matching_queue"("expiresAt");

-- CreateIndex
CREATE INDEX "job_events_jobId_idx" ON "job_events"("jobId");

-- CreateIndex
CREATE INDEX "job_events_type_idx" ON "job_events"("type");

-- CreateIndex
CREATE INDEX "job_events_createdAt_idx" ON "job_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tradie_realtime_status_tradieId_key" ON "tradie_realtime_status"("tradieId");

-- CreateIndex
CREATE INDEX "tradie_realtime_status_onlineStatus_idx" ON "tradie_realtime_status"("onlineStatus");

-- CreateIndex
CREATE INDEX "tradie_realtime_status_lastHeartbeatAt_idx" ON "tradie_realtime_status"("lastHeartbeatAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_job_insights_jobId_key" ON "ai_job_insights"("jobId");

-- CreateIndex
CREATE INDEX "ai_job_insights_jobId_idx" ON "ai_job_insights"("jobId");

-- CreateIndex
CREATE INDEX "ai_job_insights_extractedCategory_idx" ON "ai_job_insights"("extractedCategory");

-- CreateIndex
CREATE INDEX "ai_job_insights_urgencyScore_idx" ON "ai_job_insights"("urgencyScore");

-- CreateIndex
CREATE UNIQUE INDEX "payouts_stripeTransferId_key" ON "payouts"("stripeTransferId");

-- CreateIndex
CREATE INDEX "payouts_tradieId_idx" ON "payouts"("tradieId");

-- CreateIndex
CREATE INDEX "payouts_status_idx" ON "payouts"("status");

-- CreateIndex
CREATE INDEX "payouts_jobId_idx" ON "payouts"("jobId");

-- CreateIndex
CREATE INDEX "payouts_createdAt_idx" ON "payouts"("createdAt");

-- CreateIndex
CREATE INDEX "credit_packages_isActive_idx" ON "credit_packages"("isActive");

-- CreateIndex
CREATE INDEX "credit_packages_displayOrder_idx" ON "credit_packages"("displayOrder");

-- CreateIndex
CREATE INDEX "credit_ledger_tradieId_idx" ON "credit_ledger"("tradieId");

-- CreateIndex
CREATE INDEX "credit_ledger_type_idx" ON "credit_ledger"("type");

-- CreateIndex
CREATE INDEX "credit_ledger_jobId_idx" ON "credit_ledger"("jobId");

-- CreateIndex
CREATE INDEX "credit_ledger_createdAt_idx" ON "credit_ledger"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "platform_config_key_key" ON "platform_config"("key");

-- CreateIndex
CREATE INDEX "platform_config_category_idx" ON "platform_config"("category");

-- CreateIndex
CREATE INDEX "surge_pricing_rules_isActive_idx" ON "surge_pricing_rules"("isActive");

-- CreateIndex
CREATE INDEX "surge_pricing_rules_factor_idx" ON "surge_pricing_rules"("factor");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "location_tracking_tradieId_idx" ON "location_tracking"("tradieId");

-- CreateIndex
CREATE INDEX "location_tracking_jobId_idx" ON "location_tracking"("jobId");

-- CreateIndex
CREATE INDEX "location_tracking_createdAt_idx" ON "location_tracking"("createdAt");

-- CreateIndex
CREATE INDEX "trust_score_history_tradieId_idx" ON "trust_score_history"("tradieId");

-- CreateIndex
CREATE INDEX "trust_score_history_createdAt_idx" ON "trust_score_history"("createdAt");

-- CreateIndex
CREATE INDEX "fraud_flags_userId_idx" ON "fraud_flags"("userId");

-- CreateIndex
CREATE INDEX "fraud_flags_status_idx" ON "fraud_flags"("status");

-- CreateIndex
CREATE INDEX "fraud_flags_type_idx" ON "fraud_flags"("type");

-- CreateIndex
CREATE INDEX "fraud_flags_severity_idx" ON "fraud_flags"("severity");

-- CreateIndex
CREATE INDEX "fraud_flags_createdAt_idx" ON "fraud_flags"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "disputes_jobId_key" ON "disputes"("jobId");

-- CreateIndex
CREATE INDEX "disputes_customerId_idx" ON "disputes"("customerId");

-- CreateIndex
CREATE INDEX "disputes_tradieId_idx" ON "disputes"("tradieId");

-- CreateIndex
CREATE INDEX "disputes_status_idx" ON "disputes"("status");

-- CreateIndex
CREATE INDEX "disputes_createdAt_idx" ON "disputes"("createdAt");

-- CreateIndex
CREATE INDEX "moderation_actions_adminId_idx" ON "moderation_actions"("adminId");

-- CreateIndex
CREATE INDEX "moderation_actions_targetUserId_idx" ON "moderation_actions"("targetUserId");

-- CreateIndex
CREATE INDEX "moderation_actions_actionType_idx" ON "moderation_actions"("actionType");

-- CreateIndex
CREATE INDEX "moderation_actions_createdAt_idx" ON "moderation_actions"("createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_log_adminId_idx" ON "admin_audit_log"("adminId");

-- CreateIndex
CREATE INDEX "admin_audit_log_entity_idx" ON "admin_audit_log"("entity");

-- CreateIndex
CREATE INDEX "admin_audit_log_createdAt_idx" ON "admin_audit_log"("createdAt");

-- CreateIndex
CREATE INDEX "support_tickets_userId_idx" ON "support_tickets"("userId");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_priority_idx" ON "support_tickets"("priority");

-- CreateIndex
CREATE INDEX "support_tickets_assignedTo_idx" ON "support_tickets"("assignedTo");

-- CreateIndex
CREATE INDEX "support_tickets_createdAt_idx" ON "support_tickets"("createdAt");

-- CreateIndex
CREATE INDEX "support_messages_ticketId_idx" ON "support_messages"("ticketId");

-- CreateIndex
CREATE INDEX "platform_alerts_type_idx" ON "platform_alerts"("type");

-- CreateIndex
CREATE INDEX "platform_alerts_severity_idx" ON "platform_alerts"("severity");

-- CreateIndex
CREATE INDEX "platform_alerts_status_idx" ON "platform_alerts"("status");

-- CreateIndex
CREATE INDEX "platform_alerts_createdAt_idx" ON "platform_alerts"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_code_key" ON "referrals"("code");

-- CreateIndex
CREATE INDEX "referrals_inviterId_idx" ON "referrals"("inviterId");

-- CreateIndex
CREATE INDEX "referrals_code_idx" ON "referrals"("code");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- CreateIndex
CREATE INDEX "referrals_invitedEmail_idx" ON "referrals"("invitedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "seo_pages_slug_key" ON "seo_pages"("slug");

-- CreateIndex
CREATE INDEX "seo_pages_slug_idx" ON "seo_pages"("slug");

-- CreateIndex
CREATE INDEX "seo_pages_pageType_idx" ON "seo_pages"("pageType");

-- CreateIndex
CREATE INDEX "seo_pages_suburb_idx" ON "seo_pages"("suburb");

-- CreateIndex
CREATE INDEX "seo_pages_tradeCategory_idx" ON "seo_pages"("tradeCategory");

-- CreateIndex
CREATE INDEX "seo_pages_publishedAt_idx" ON "seo_pages"("publishedAt");

-- CreateIndex
CREATE INDEX "growth_events_userId_idx" ON "growth_events"("userId");

-- CreateIndex
CREATE INDEX "growth_events_eventType_idx" ON "growth_events"("eventType");

-- CreateIndex
CREATE INDEX "growth_events_suburb_idx" ON "growth_events"("suburb");

-- CreateIndex
CREATE INDEX "growth_events_createdAt_idx" ON "growth_events"("createdAt");

-- CreateIndex
CREATE INDEX "suburb_metrics_demandScore_idx" ON "suburb_metrics"("demandScore");

-- CreateIndex
CREATE INDEX "suburb_metrics_supplyScore_idx" ON "suburb_metrics"("supplyScore");

-- CreateIndex
CREATE INDEX "suburb_metrics_isUnderserved_idx" ON "suburb_metrics"("isUnderserved");

-- CreateIndex
CREATE INDEX "suburb_metrics_expansionPriority_idx" ON "suburb_metrics"("expansionPriority");

-- CreateIndex
CREATE UNIQUE INDEX "suburb_metrics_suburb_state_key" ON "suburb_metrics"("suburb", "state");

-- CreateIndex
CREATE INDEX "marketing_campaigns_type_idx" ON "marketing_campaigns"("type");

-- CreateIndex
CREATE INDEX "marketing_campaigns_status_idx" ON "marketing_campaigns"("status");

-- CreateIndex
CREATE INDEX "marketing_campaigns_scheduledAt_idx" ON "marketing_campaigns"("scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "review_requests_jobId_key" ON "review_requests"("jobId");

-- CreateIndex
CREATE INDEX "review_requests_customerId_idx" ON "review_requests"("customerId");

-- CreateIndex
CREATE INDEX "review_requests_tradieId_idx" ON "review_requests"("tradieId");

-- CreateIndex
CREATE INDEX "review_requests_status_idx" ON "review_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "review_requests_jobId_customerId_key" ON "review_requests"("jobId", "customerId");

-- CreateIndex
CREATE UNIQUE INDEX "voice_calls_twilioCallSid_key" ON "voice_calls"("twilioCallSid");

-- CreateIndex
CREATE INDEX "voice_calls_customerId_idx" ON "voice_calls"("customerId");

-- CreateIndex
CREATE INDEX "voice_calls_status_idx" ON "voice_calls"("status");

-- CreateIndex
CREATE INDEX "voice_calls_startedAt_idx" ON "voice_calls"("startedAt");

-- CreateIndex
CREATE INDEX "voice_calls_twilioCallSid_idx" ON "voice_calls"("twilioCallSid");

-- CreateIndex
CREATE INDEX "voice_events_callId_idx" ON "voice_events"("callId");

-- CreateIndex
CREATE INDEX "voice_events_eventType_idx" ON "voice_events"("eventType");

-- CreateIndex
CREATE INDEX "voice_events_createdAt_idx" ON "voice_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_assessments_jobId_key" ON "emergency_assessments"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_assessments_callId_key" ON "emergency_assessments"("callId");

-- CreateIndex
CREATE INDEX "emergency_assessments_riskLevel_idx" ON "emergency_assessments"("riskLevel");

-- CreateIndex
CREATE INDEX "emergency_assessments_emergencyScore_idx" ON "emergency_assessments"("emergencyScore");

-- CreateIndex
CREATE INDEX "emergency_assessments_createdAt_idx" ON "emergency_assessments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_conversations_jobId_key" ON "ai_conversations"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_conversations_callId_key" ON "ai_conversations"("callId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_conversations_sessionId_key" ON "ai_conversations"("sessionId");

-- CreateIndex
CREATE INDEX "ai_conversations_sessionId_idx" ON "ai_conversations"("sessionId");

-- CreateIndex
CREATE INDEX "ai_conversations_status_idx" ON "ai_conversations"("status");

-- CreateIndex
CREATE INDEX "ai_conversations_isEmergency_idx" ON "ai_conversations"("isEmergency");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tradie_profiles" ADD CONSTRAINT "tradie_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tradie_documents" ADD CONSTRAINT "tradie_documents_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tradie_portfolios" ADD CONSTRAINT "tradie_portfolios_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_settings" ADD CONSTRAINT "emergency_settings_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "customer_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_tradies" ADD CONSTRAINT "saved_tradies_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_claims" ADD CONSTRAINT "job_claims_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_claims" ADD CONSTRAINT "job_claims_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_status_history" ADD CONSTRAINT "job_status_history_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_images" ADD CONSTRAINT "job_images_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credits_wallets" ADD CONSTRAINT "credits_wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "credits_wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licences" ADD CONSTRAINT "licences_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "tradie_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_matching_queue" ADD CONSTRAINT "job_matching_queue_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_events" ADD CONSTRAINT "job_events_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_job_insights" ADD CONSTRAINT "ai_job_insights_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_requests" ADD CONSTRAINT "review_requests_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_calls" ADD CONSTRAINT "voice_calls_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_events" ADD CONSTRAINT "voice_events_callId_fkey" FOREIGN KEY ("callId") REFERENCES "voice_calls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_assessments" ADD CONSTRAINT "emergency_assessments_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_assessments" ADD CONSTRAINT "emergency_assessments_callId_fkey" FOREIGN KEY ("callId") REFERENCES "voice_calls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_callId_fkey" FOREIGN KEY ("callId") REFERENCES "voice_calls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

