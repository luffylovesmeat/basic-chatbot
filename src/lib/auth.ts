import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  // Optional: Add database adapter if using Prisma
  // adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  // Optional: Configure session
  session: {
    strategy: "jwt",
  },
})

// Optional: Export auth types
export type { Session } from "next-auth"
