import { PrismaClient } from './generated/client';

const db = new PrismaClient();

async function main() {
  const packs = [
    { name: 'Starter Pack', credits: 10, bonusCredits: 0, priceAud: 49, isPopular: false, isActive: true, displayOrder: 1 },
    { name: 'Pro Pack',     credits: 22, bonusCredits: 2, priceAud: 99, isPopular: true,  isActive: true, displayOrder: 2 },
    { name: 'Elite Pack',   credits: 35, bonusCredits: 5, priceAud: 149, isPopular: false, isActive: true, displayOrder: 3 },
  ];

  // Deactivate existing packs, then upsert by name
  await db.creditPackage.updateMany({ where: {}, data: { isActive: false } });

  for (const pack of packs) {
    const existing = await db.creditPackage.findFirst({ where: { name: pack.name } });
    if (existing) {
      await db.creditPackage.update({ where: { id: existing.id }, data: pack });
    } else {
      await db.creditPackage.create({ data: pack });
    }
  }

  console.log('✅ Seeded credit packages: $49 Starter / $99 Pro / $149 Elite');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
