-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Idea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "docket" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "upazila" TEXT,
    "concept" TEXT NOT NULL,
    "impact" TEXT,
    "officerName" TEXT,
    "solutionDescription" TEXT,
    "currentProcessMap" TEXT,
    "proposedProcessMap" TEXT,
    "pilotLocation" TEXT,
    "implementationTimeline" TEXT,
    "teamMembers" JSONB,
    "resourceFinancial" TEXT,
    "resourceManpower" TEXT,
    "resourceTechnical" TEXT,
    "resourceOther" TEXT,
    "resourceSource" TEXT,
    "workPlan" JSONB,
    "techTags" JSONB,
    "maturity" TEXT NOT NULL DEFAULT 'CONCEPT',
    "status" TEXT NOT NULL DEFAULT 'UPAZILA',
    "submittedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Idea_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Idea" ("category", "concept", "createdAt", "currentProcessMap", "district", "docket", "id", "impact", "implementationTimeline", "officerName", "pilotLocation", "proposedProcessMap", "resourceFinancial", "resourceManpower", "resourceOther", "resourceSource", "resourceTechnical", "solutionDescription", "status", "submittedById", "teamMembers", "title", "upazila", "updatedAt", "workPlan") SELECT "category", "concept", "createdAt", "currentProcessMap", "district", "docket", "id", "impact", "implementationTimeline", "officerName", "pilotLocation", "proposedProcessMap", "resourceFinancial", "resourceManpower", "resourceOther", "resourceSource", "resourceTechnical", "solutionDescription", "status", "submittedById", "teamMembers", "title", "upazila", "updatedAt", "workPlan" FROM "Idea";
DROP TABLE "Idea";
ALTER TABLE "new_Idea" RENAME TO "Idea";
CREATE UNIQUE INDEX "Idea_docket_key" ON "Idea"("docket");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
