import { AuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { MongoClient } from "mongodb";
import clientPromise from "../../../../lib/mongodb-client";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          hd: "vitstudent.ac.in",
          prompt: "select_account",
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise as Promise<MongoClient>),
  session: {
    strategy: "database" as SessionStrategy,
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email && user.email.endsWith("@vitstudent.ac.in")) {
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
