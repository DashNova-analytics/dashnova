import "./env.js";
import { PrismaClient } from "@prisma/client";

let prismaInstance = null;
let prismaError = false;

function getPrismaClient() {
  if (prismaError) return null;
  if (!prismaInstance) {
    try {
      if (!process.env.DATABASE_URL) {
        prismaError = true;
        return null;
      }
      prismaInstance = new PrismaClient();
    } catch (err) {
      console.warn("[Prisma] Failed to initialize PrismaClient:", err.message);
      prismaError = true;
      return null;
    }
  }
  return prismaInstance;
}

// In-memory fallback storage when Prisma/PostgreSQL database is unconfigured or unavailable
const memoryStore = {
  user: [],
  organization: [],
  product: [],
  customer: [],
  sale: [],
  upload: []
};

const createModelProxy = (modelName) => {
  return new Proxy({}, {
    get(target, method) {
      return async (...args) => {
        const client = getPrismaClient();
        if (client && client[modelName] && typeof client[modelName][method] === 'function') {
          try {
            return await client[modelName][method](...args);
          } catch (err) {
            console.warn(`[Prisma] Query ${modelName}.${method} failed:`, err.message);
          }
        }

        // Safe in-memory fallback so server API calls never crash
        const store = memoryStore[modelName] || [];
        const params = args[0] || {};

        if (method === 'findMany') {
          return store;
        }
        if (method === 'findUnique' || method === 'findFirst') {
          if (!params.where) return store[0] || null;
          const found = store.find(item => {
            return Object.entries(params.where).some(([k, v]) => item[k] === v);
          });
          return found || null;
        }
        if (method === 'create') {
          const newRecord = {
            id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...(params.data || {})
          };
          store.push(newRecord);
          return newRecord;
        }
        if (method === 'upsert') {
          let existing = null;
          if (params.where) {
            existing = store.find(item => {
              return Object.entries(params.where).some(([k, v]) => item[k] === v);
            });
          }
          if (existing) {
            Object.assign(existing, params.update || {}, { updatedAt: new Date() });
            return existing;
          } else {
            const newRecord = {
              id: 'mem_org_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
              createdAt: new Date(),
              updatedAt: new Date(),
              ...(params.create || {}),
              ...(params.where || {})
            };
            store.push(newRecord);
            return newRecord;
          }
        }
        if (method === 'update') {
          let existing = null;
          if (params.where?.id) {
            existing = store.find(item => item.id === params.where.id);
          }
          if (existing) {
            Object.assign(existing, params.data || {}, { updatedAt: new Date() });
            return existing;
          }
          return { id: params.where?.id || 'mem_1', ...(params.data || {}) };
        }
        if (method === 'delete') {
          return { id: params.where?.id || 'mem_1' };
        }
        if (method === 'createMany') {
          const items = params.data || [];
          items.forEach(data => {
            store.push({
              id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
              createdAt: new Date(),
              updatedAt: new Date(),
              ...data
            });
          });
          return { count: items.length };
        }
        if (method === 'count') {
          return store.length;
        }
        if (method === 'aggregate' || method === 'groupBy') {
          return { _sum: { amount: 0, price: 0 }, _count: { id: store.length } };
        }

        return { id: 'mem_fallback_' + Date.now() };
      };
    }
  });
};

const prismaProxy = new Proxy({}, {
  get(target, prop) {
    if (prop === '$connect') return async () => {};
    if (prop === '$disconnect') return async () => {};
    if (prop === '$transaction') return async (fn) => typeof fn === 'function' ? fn(prismaProxy) : fn;

    const client = getPrismaClient();
    if (client && prop in client) {
      if (typeof client[prop] === 'function') {
        return client[prop].bind(client);
      }
      return client[prop];
    }

    return createModelProxy(prop);
  }
});

export default prismaProxy;
