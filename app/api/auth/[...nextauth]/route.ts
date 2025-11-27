import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = process.env.ADMIN_EMAILS?.split(",") || [];
      if (
        user.email &&
        allowedEmails.map((e) => e.trim()).includes(user.email)
      ) {
        return true; // Allow access
      }

      // 3. Reject everyone else
      return false;
    },
  },
  pages: {
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };
