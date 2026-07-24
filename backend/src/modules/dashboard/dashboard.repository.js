import prisma from "../../config/prisma.js";

export async function getSummary() {
  const [usersCount, organizationsCount, productsCount, customersCount, uploadsCount, products, customers, sales, uploads] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.product.count(),
    prisma.customer.count(),
    prisma.upload.count(),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.customer.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.sale.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.upload.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const hasData = (productsCount > 0 || customersCount > 0 || sales.length > 0 || uploadsCount > 0);

  if (!hasData) {
    return {
      hasData: false,
      kpis: {
        totalRevenue: "Rs 0.00",
        activeCustomers: 0,
        salesCount: 0,
        averageOrderValue: "Rs 0.00",
        hasData: false
      },
      counts: {
        users: usersCount,
        organizations: organizationsCount,
        products: 0,
        customers: 0,
        uploads: 0
      },
      products: [],
      customers: [],
      uploads: []
    };
  }

  // Compute live aggregates from Neon DB tables
  const salesCount = sales.length;
  const salesRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
  const customersRevenue = customers.reduce((sum, c) => sum + (c.sales || 0), 0);
  const productsValue = products.reduce((sum, p) => sum + (p.price * (p.soldCount || 1)), 0);

  const totalRevenueNum = salesRevenue > 0 ? salesRevenue : (customersRevenue > 0 ? customersRevenue : productsValue);
  const totalRevenueStr = `Rs ${totalRevenueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const avgOrderValueNum = salesCount > 0 ? totalRevenueNum / salesCount : (customersCount > 0 ? totalRevenueNum / customersCount : 0);
  const avgOrderValueStr = `Rs ${avgOrderValueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return {
    hasData: true,
    kpis: {
      totalRevenue: totalRevenueStr,
      activeCustomers: customersCount,
      salesCount: salesCount,
      averageOrderValue: avgOrderValueStr,
      hasData: true
    },
    counts: {
      users: usersCount,
      organizations: organizationsCount,
      products: productsCount,
      customers: customersCount,
      uploads: uploadsCount
    },
    products,
    customers,
    uploads
  };
}


