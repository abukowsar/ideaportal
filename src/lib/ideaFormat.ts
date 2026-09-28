import type { MaturityKey, TechKey } from "@/lib/tech";

export type TeamMemberData = {
  role: string;
  name: string;
  designation: string;
  address: string;
  mobile: string;
  email: string;
};

export type WorkPlanRowData = {
  task: string;
  who: string;
  timeline: string;
  risk: string;
};

export type IdeaStatus = "UPAZILA" | "DISTRICT" | "HQ" | "SELECTED";

export type IdeaView = {
  id: string;
  docket: string;
  title: string;
  officerName: string | null;
  category: string;
  district: string;
  upazila: string | null;
  concept: string;
  impact: string | null;
  solutionDescription: string | null;
  currentProcessMap: string | null;
  proposedProcessMap: string | null;
  pilotLocation: string | null;
  implementationTimeline: string | null;
  teamMembers: TeamMemberData[] | null;
  resourceFinancial: string | null;
  resourceManpower: string | null;
  resourceTechnical: string | null;
  resourceOther: string | null;
  resourceSource: string | null;
  workPlan: WorkPlanRowData[] | null;
  techTags: TechKey[];
  maturity: MaturityKey;
  status: IdeaStatus;
  submittedByName: string;
  /** DPP progress for SELECTED ideas; null when no DPP has been started (or not loaded). */
  dppStatus: "DRAFT" | "READY" | null;
  createdAt: string;
  updatedAt: string;
};

export type Viewer = { role: "UPAZILA" | "DISTRICT" | "HQ" | "ADMIN"; district: string | null } | null;
