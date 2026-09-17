const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({
    select: {
      name: true,
      slug: true,
      billingPeriod: true,
      priceCents: true,
      isFeatured: true,
    },
    orderBy: [{ billingPeriod: "asc" }, { priceCents: "asc" }],
  });
  console.log(JSON.stringify(packages, null, 2));
  console.log("count=", packages.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
