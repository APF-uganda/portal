

import { Link } from "react-router-dom";
import {CheckCircle, Clock } from "lucide-react"

function RecentApplications(){
    return(
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
    )

} export default RecentApplications
        