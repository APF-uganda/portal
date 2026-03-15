import { Link } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchRecentApplications,RecentApplication } from "../../services/dashboard";

function RecentApplications() {
  const [applications, setApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentApplications()
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date: string) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    
    // If less than 24 hours, show "hours ago"
    if (hours < 24) {
      if (hours < 1) return "Just now";
      return `${hours} hours ago`;
    }
    
    // If 24 hours or more, show date in dd/mm/yyyy format
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };




  return (
    <div className="rounded-xl border border-border bg-white p-4 md:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold text-gray-700">
          Recent Applications
        </h2>
        <Link
          to="/admin/approval"
          className="text-xs md:text-sm text-purple-600 hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-gray-400">Loading applications…</p>
      )}

      {/* List */}
      <div className="divide-y divide-gray-100">
       {applications.map((app) => {
        const isApproved = app.status === "approved";
        const isRejected = app.status === "rejected";

  return (
    <div
      key={app.id}
      className="flex items-center justify-between py-3 gap-2"
    >
      {/* Left */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {app.first_name} {app.last_name}
        </p>
        <p className="text-xs text-gray-400">
          Member • {formatDate(app.submitted_at)}
        </p>
      </div>

      {/* Status */}
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 md:px-3 py-1 text-xs font-medium flex-shrink-0 ${
          isApproved
            ? "bg-green-100 text-green-700"
            : isRejected
            ? "bg-red-100 text-red-700"
            : "bg-orange-100 text-orange-700"
        }`}
      >
        {isApproved ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
        <span className="hidden sm:inline">
          {isApproved ? "Approved" : isRejected ? "Rejected" : "Pending"}
        </span>
      </span>
    </div>
  );
})}


        {!loading && applications.length === 0 && (
          <p className="text-sm text-gray-400 py-3">
            No recent applications found.
          </p>
        )}
      </div>
    </div>
  );
}

export default RecentApplications;
