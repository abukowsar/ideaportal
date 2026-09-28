-- CreateTable
CREATE TABLE "Dpp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ideaId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectNameEn" TEXT,
    "sponsoringMinistry" TEXT NOT NULL,
    "executingAgency" TEXT NOT NULL,
    "location" TEXT,
    "implStart" TEXT,
    "implEnd" TEXT,
    "background" TEXT,
    "objectives" TEXT,
    "activities" TEXT,
    "outputs" TEXT,
    "planAlignment" TEXT,
    "feasibility" TEXT,
    "manpower" TEXT,
    "risks" TEXT,
    "sustainability" TEXT,
    "costItems" JSONB,
    "fundGob" REAL NOT NULL DEFAULT 0,
    "fundOwn" REAL NOT NULL DEFAULT 0,
    "fundOther" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "preparedById" TEXT,
    "finalizedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dpp_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Dpp_preparedById_fkey" FOREIGN KEY ("preparedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Dpp_ideaId_key" ON "Dpp"("ideaId");
