import { prisma } from "./prisma/prisma-client";

async function bootstrap() {
  await prisma.$connect();
  const explain = await prisma.$queryRaw`
    EXPLAIN ANALYZE
    SELECT * FROM posts
    WHERE created_at > '2021-01-01' AND created_at < '2021-12-31'
  `;

  console.log(explain);
}

await bootstrap().finally(async () => {
  await prisma.$disconnect();
});
