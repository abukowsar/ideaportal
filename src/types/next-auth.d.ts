import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: Role;
    district: string | null;
    upazila: string | null;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
      district: string | null;
      upazila: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: Role;
    district: string | null;
    upazila: string | null;
  }
}
