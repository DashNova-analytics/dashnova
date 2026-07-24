import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { name: "Default Organization" },
    update: {},
    create: { name: "Default Organization" },
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: bcrypt.hashSync("password123", 10),
      organizationId: organization.id,
    },
  });

  // Seed sample products
  const sampleProducts = [
    { name: "SaaS Enterprise License", description: "Annual enterprise cloud subscription", price: 1299.00 },
    { name: "API Gateway Node Pro", description: "High-throughput API gateway cluster", price: 499.00 },
    { name: "Analytics Dashboard Pro", description: "Real-time BI analytics suite", price: 299.00 },
    { name: "AI Predictive Engine", description: "Machine learning forecasting model", price: 899.00 },
    { name: "Cloud Storage Tier 1", description: "1TB encrypted cloud storage bucket", price: 99.00 },
    { name: "Security Audit Package", description: "Comprehensive compliance security assessment", price: 1500.00 }
  ];

  for (const prod of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { name: prod.name, organizationId: organization.id },
    });
    if (!existing) {
      await prisma.product.create({
        data: { ...prod, organizationId: organization.id },
      });
    }
  }

  // Seed sample customers
  const sampleCustomers = [
    { name: "Acme Logistics Corp", email: "contact@acmelogistics.com", phone: "+1 (555) 234-5678" },
    { name: "Apex Technologies LLC", email: "billing@apextech.io", phone: "+1 (555) 876-5432" },
    { name: "Global Commerce Ltd", email: "finance@globalcommerce.com", phone: "+1 (555) 345-6789" },
    { name: "Vertex Software Solutions", email: "admin@vertexsoft.org", phone: "+1 (555) 987-6543" },
    { name: "Quantum Innovations", email: "hello@quantuminnovations.co", phone: "+1 (555) 456-7890" }
  ];

  for (const cust of sampleCustomers) {
    await prisma.customer.upsert({
      where: { email: cust.email },
      update: {},
      create: { ...cust, organizationId: organization.id },
    });
  }

  console.log("Prisma seed complete!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


