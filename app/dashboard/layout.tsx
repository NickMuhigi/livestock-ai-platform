import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata = {
  title: "Dashboard - Herd AI",
  description: "Manage your livestock health analysis from your Herd AI dashboard.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
