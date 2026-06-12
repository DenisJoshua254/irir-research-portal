// src/types/index.ts
import type { User, Project, Document, Comment, Role, ProjectStatus } from "@prisma/client";

export type { Role, ProjectStatus };

export type UserWithoutPassword = Omit<User, "password">;

export type ProjectWithOwner = Project & {
  owner: UserWithoutPassword;
  _count?: {
    documents: number;
    comments: number;
    collaborations: number;
  };
};

export type ProjectWithDetails = Project & {
  owner: UserWithoutPassword;
  collaborations: {
    user: UserWithoutPassword;
  }[];
  documents: Document[];
  comments: (Comment & {
    user: UserWithoutPassword;
  })[];
};

export type CommentWithUser = Comment & {
  user: {
    id: string;
    name: string;
  };
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}
