const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const features = ["Mistakes To Avoid", "Your Startup", "Knew About Fonts"];

// Monthly and yearly are separate package records (not calculated)
const packages = [
  {
    name: "Basic",
    slug: "basic-monthly",
    description: "Essential Security Suite Perfect for startups and small teams",
    features,
    billingPeriod: "MONTHLY",
    priceCents: 2900,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Premium",
    slug: "premium-monthly",
    description: "Data Analytics Tools Ideal for growing businesses requiring",
    features,
    billingPeriod: "MONTHLY",
    priceCents: 6900,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise-monthly",
    description: "Personalized On boarding For large organizations desiring",
    features,
    billingPeriod: "MONTHLY",
    priceCents: 8900,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Basic",
    slug: "basic-yearly",
    description: "Essential Security Suite Perfect for startups and small teams",
    features,
    billingPeriod: "YEARLY",
    priceCents: 8200,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Premium",
    slug: "premium-yearly",
    description: "Data Analytics Tools Ideal for growing businesses requiring",
    features,
    billingPeriod: "YEARLY",
    priceCents: 11300,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise-yearly",
    description: "Personalized On boarding For large organizations desiring",
    features,
    billingPeriod: "YEARLY",
    priceCents: 18700,
    isFeatured: false,
    isActive: true,
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "eintuitionadmin@yopmail.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  // Remove legacy combined packages (basic/premium/enterprise without period)
  await prisma.payment.deleteMany();
  await prisma.package.deleteMany();

  for (const pkg of packages) {
    await prisma.package.create({ data: pkg });
  }

  console.log("Seed complete:");
  console.log(`- Admin: ${email}`);
  console.log(
    `- Packages: ${packages.map((p) => `${p.name} (${p.billingPeriod}) $${(p.priceCents / 100).toFixed(0)}`).join(", ")}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
