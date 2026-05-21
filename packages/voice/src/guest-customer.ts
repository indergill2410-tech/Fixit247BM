import { db } from '@fixit247/database';

export interface GuestCustomer {
  userId: string;
  customerProfileId: string;
  isNew: boolean;
}

/**
 * Find an existing user by phone number, or create a guest account so that
 * any inbound call can produce a job — even from unknown callers.
 *
 * Guest users get a synthetic internal email so the unique constraint is met.
 * They can claim their account later by registering with the same phone.
 */
export async function findOrCreateGuestCustomer(
  phoneNumber: string,
  name?: string | null,
): Promise<GuestCustomer | null> {
  try {
    // 1. Try exact phone match on existing users
    const existing = await db.user.findFirst({
      where: { phone: phoneNumber },
      include: { customerProfile: true },
    });

    if (existing) {
      let profileId = existing.customerProfile?.id ?? null;

      if (!profileId) {
        const profile = await db.customerProfile.create({ data: { userId: existing.id } });
        profileId = profile.id;
      }

      // Update name if we now have it and the existing record looks like a guest
      if (name && existing.firstName === 'Voice') {
        const parts = name.trim().split(/\s+/);
        await db.user.update({
          where: { id: existing.id },
          data: {
            firstName: parts[0] ?? 'Voice',
            lastName: parts.slice(1).join(' ') || 'Customer',
          },
        });
      }

      return { userId: existing.id, customerProfileId: profileId, isNew: false };
    }

    // 2. Synthesise a deterministic guest email so retries stay idempotent
    const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');
    const guestEmail = `guest+${sanitizedPhone}@voice.fixit247.internal`;

    const existingGuest = await db.user.findUnique({
      where: { email: guestEmail },
      include: { customerProfile: true },
    });

    if (existingGuest) {
      const profileId =
        existingGuest.customerProfile?.id ??
        (await db.customerProfile.create({ data: { userId: existingGuest.id } })).id;
      return { userId: existingGuest.id, customerProfileId: profileId, isNew: false };
    }

    // 3. Create brand-new guest user + CustomerProfile in one transaction
    const parts = (name ?? '').trim().split(/\s+/);
    const firstName = parts[0] || 'Voice';
    const lastName = parts.slice(1).join(' ') || 'Customer';

    const user = await db.user.create({
      data: {
        email: guestEmail,
        firstName,
        lastName,
        phone: phoneNumber,
        role: 'CUSTOMER',
        customerProfile: { create: {} },
      },
      include: { customerProfile: true },
    });

    return {
      userId: user.id,
      customerProfileId: user.customerProfile!.id,
      isNew: true,
    };
  } catch (err) {
    console.error('[guest-customer] findOrCreateGuestCustomer failed', {
      phoneNumber,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
