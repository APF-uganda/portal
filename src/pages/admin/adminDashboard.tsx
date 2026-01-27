import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { title: "Total Members", value: "2,547", change: "+12.5%", trend: "up", icon: Users },
  { title: "Pending Applications", value: "23", change: "+5", trend: "up", icon: FileText },
  { title: "Revenue (This Month)", value: "UGX 45.2M", change: "+8.3%", trend: "up", icon: CreditCard },
  { title: "Active Subscriptions", value: "2,341", change: "+3.2%", trend: "up", icon: TrendingUp },
];

function AdminDashboard(){
    return(
        <>
       {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="animate-slide-up rounded-xl border border-border bg-card p-4 transition hover:shadow-lg"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <div className="animate-slide-up rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <Link to="/admin/applications" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { id: "APP-2024-089", name: "Mary Achieng", type: "Full Member", date: "2 hours ago", status: "pending" },
              { id: "APP-2024-088", name: "Robert Kato", type: "Associate Member", date: "5 hours ago", status: "pending" },
              { id: "APP-2024-087", name: "Diana Nambi", type: "Full Member", date: "1 day ago", status: "approved" },
            ].map((app) => (
              <div key={app.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                    {app.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.type} • {app.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white ${
                    app.status === "approved" ? "bg-green-600" : "bg-yellow-500"
                  }`}
                >
                  {app.status === "approved" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="animate-slide-up rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Payments</h2>
            <Link to="/admin/payments" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { id: "PAY-2024-156", member: "John Doe", amount: "UGX 400,000", type: "Membership Fee", status: "completed" },
              { id: "PAY-2024-155", member: "Jane Smith", amount: "UGX 150,000", type: "Event Registration", status: "completed" },
            ].map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{payment.member}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.type} • {payment.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount}</p>
                  <span className="rounded-full border border-green-600 px-2 py-0.5 text-xs text-green-600">
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 animate-slide-up rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Review Applications", icon: FileText, to: "/admin/applications" },
            { label: "Send Announcement", icon: Users, to: "/admin/communications" },
            { label: "Generate Report", icon: TrendingUp, to: "/admin/reports" },
            { label: "View Analytics", icon: CreditCard, to: "/admin/analytics" },
          ].map((action) => (
            <Link key={action.label} to={action.to}>
              <button className="flex w-full items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted">
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </>
    )

}
export default AdminDashboard