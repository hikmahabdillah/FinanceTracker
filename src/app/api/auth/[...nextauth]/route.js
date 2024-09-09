import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Jika ada account, tambahkan informasi ke token
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Tambahkan informasi ke session
      if (token) {
        session.accessToken = token.accessToken;
        session.provider = token.provider;
        session.providerId = token.providerId;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Jika tidak ada account, proses sign in gagal
      if (!account) return false;

      // Simpan data user di database jika belum ada
      const userInDb = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!userInDb) {
        await prisma.user.create({
          data: {
            email: user.email,
            username: user.name,
            provider: account.provider,
            providerId: account.providerAccountId,
          },
        });
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
