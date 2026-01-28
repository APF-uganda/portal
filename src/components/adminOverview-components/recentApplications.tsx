
import { Link } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";

function RecentApplications() {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Recent Applications
        </h2>
        <Link
          to="/admin/approval"
          className="text-sm text-purple-600 hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100">
        {[
          {
            id: "1",
            name: "Mary Acheng",
            type: "Full Member",
            time: "2 hours ago",
            status: "pending",
          },
          {
            id: "2",
            name: "Robert Kato",
            type: "Full Member",
            time: "5 hours ago",
            status: "pending",
          },
          {
            id: "3",
            name: "Diana Nambi",
            type: "Full Member",
            time: "10 hours ago",
            status: "approved",
          },
          {
            id: "4",
            name: "Joseph Odongo",
            type: "Full Member",
            time: "10 hours ago",
            status: "approved",
          },
        ].map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between py-3"
          >
            {/* Left */}
            <div>
              <p className="text-sm font-medium text-gray-800">
                {app.name}
              </p>
              <p className="text-xs text-gray-400">
                {app.type} • {app.time}
              </p>
            </div>

            {/* Status */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                app.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {app.status === "approved" ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              {app.status === "approved" ? "Approved" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentApplications;

        