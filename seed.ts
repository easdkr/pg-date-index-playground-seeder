import { LocalDateTime, convert } from "js-joda";
import { prisma } from "./prisma/prisma-client";

async function seed() {
  await prisma.$connect();
  const bulkSize = 1000000;

  await prisma.user.createMany({
    data: new Array(bulkSize).fill(0).map((_, index) => ({
      name: `User ${index + 1}`,
    })),
  });

  // 계속 프리즈마가 터져서 시간차를 두고 실행
  for (let i = 0; i < bulkSize; i += 10000) {
    await prisma.post.createMany({
      data: new Array(10000).fill(0).map((_, index) => ({
        title: `Post for user ${i + index + 1}`,
        // createdAt과 updatedAt을 3년 전 날짜부터 현재까지 랜덤하게 생성
        createdAt: convert(
          LocalDateTime.now()
            .minusYears(3)
            .plusDays(Math.floor(Math.random() * 1095))
        ).toDate(),
        updatedAt: convert(
          LocalDateTime.now()
            .minusYears(3)
            .plusDays(Math.floor(Math.random() * 1095))
        ).toDate(),
        authorId: i + index + 1,
      })),
    });
  }

  await prisma.$disconnect();
}

await seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
