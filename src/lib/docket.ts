import type { Prisma } from "@prisma/client";
import { DIST_CODE } from "@/lib/bn";

export async function nextDocket(
  tx: Prisma.TransactionClient,
  district: string,
  year = new Date().getFullYear()
): Promise<string> {
  const code = DIST_CODE[district] ?? "GEN";
  const prefix = `DoICT/${code}/IDEA/${year}/`;
  const count = await tx.idea.count({
    where: { docket: { startsWith: prefix } },
  });
  const seq = String(count + 1).padStart(3, "0");
  return `${prefix}${seq}`;
}
