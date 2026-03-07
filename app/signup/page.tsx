import { AuthForm } from "@/components/auth/auth-form"

export const metadata = {
  title: "Sign Up - Herd AI",
  description: "Create your free Herd AI account and start detecting livestock diseases with AI.",
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
