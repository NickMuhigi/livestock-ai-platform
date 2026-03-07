import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export const metadata = {
  title: "Log In - Herd AI",
  description: "Log in to your Herd AI account to manage livestock health.",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
