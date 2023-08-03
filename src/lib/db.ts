import { PrismaClient } from "@prisma/client/edge";

declare global {
  var prisma: PrismaClient | undefined;
}

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  db = global.prisma;
}

export { db };
