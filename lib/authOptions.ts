import GoogleProvider from "next-auth/providers/google";
import { type NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodbClientPromise";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin", // Customize as needed
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub ?? "unknown-id";

      return session;
    },
  },
};
