"use server"

import { AuthError } from "next-auth"
import { signIn, signOut } from "@/lib/auth"
import { firstIssue, loginSchema } from "@/lib/validators"

export type LoginState = {
  error?: string
}

export async function loginAction(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha inválidos." }
    }
    throw error
  }

  return {}
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" })
}
