"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, AlertCircle, History } from "lucide-react"
import { DiseaseHotspots } from "@/components/landing/disease-hotspots"

export default function VetDashboardHome() {
  const router = useRouter()
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          router.push("/login")
          return
        }

        // Fetch pending appointments
        const response = await fetch("/api/vet/appointments", {
          headers: { "Authorization": `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          const pending = data.appointments?.filter((a: any) => a.status === "PENDING").length || 0
          setAppointmentCount(pending)
        }
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome to Your Vet Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage client appointment bookings and review analysis results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Appointments Card */}
        <Card className="p-6 border-primary/20 bg-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Pending Bookings</p>
              <p className="text-4xl font-bold text-foreground">{loading ? "..." : appointmentCount}</p>
              <p className="text-sm text-muted-foreground mt-2">Awaiting your approval</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        {/* Quick Actions Card */}
        <Card className="p-6">
          <p className="text-sm text-muted-foreground uppercase font-semibold mb-4">Quick Actions</p>
          <div className="space-y-3">
            <Link href="/vet-dashboard/appointments" className="block">
              <Button className="w-full gap-2" variant="outline">
                <Calendar className="h-4 w-4" />
                View Pending Appointments
              </Button>
            </Link>
            <Link href="/vet-dashboard/history" className="block">
              <Button className="w-full h-12 gap-2 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                <History className="h-5 w-5" />
                View Appointment History
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Disease Hotspots Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <History className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Disease Hotspots By District</h2>
        </div>

        <DiseaseHotspots embedded />
      </div>
    </div>
  )
}
