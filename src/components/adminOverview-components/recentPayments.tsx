
import { Link } from "react-router-dom"
function RecentPayments(){
    return(
         <div className="animate-slide-up rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Payments</h2>
            <Link to="/admin/payments" className="text-sm text-purple-600 hover:underline" >
               View All →
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
    )
}export default RecentPayments