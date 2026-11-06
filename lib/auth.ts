import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/validators"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user) {
          return null
        }

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        )
        if (!valid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id
      }
      return session
    },
  },
})
