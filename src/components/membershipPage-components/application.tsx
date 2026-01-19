import {
  User,
  FileText,
  CreditCard,
  UserCheck,
} from "lucide-react";

const steps = [
  { id: 1, title: "Create Account", icon: User },
  { id: 2, title: "Submit Application & Documents", icon: FileText },
  { id: 3, title: "Make Payment & eKYC Verify", icon: CreditCard },
  { id: 4, title: "Get Approved & Access Dashboard", icon: UserCheck },
];

export default function MembershipProcess() {
  return (
    <section className="bg-[#f7f3ff] py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* TITLE */}
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-12">
          Membership Application Process
        </h2>

        {/* STEPPER */}
        <div className="relative flex items-center justify-between">
          {/* CONNECTOR LINE  */}
          <div className="absolute top-6 left-[12.5%] right-[12.5%] h-[2px] bg-purple-600" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center text-center w-1/4"
              >
                {/* ICON WRAPPER */}
                <div className="relative mb-4">
                  {/* STEP NUMBER */}
                  <span
                    className="
                      absolute -top-2 -left-2
                      w-5 h-5 rounded-full
                      bg-white border border-purple-600
                      text-xs font-semibold text-purple-700
                      flex items-center justify-center
                    "
                  >
                    {step.id}
                  </span>

                  {/* ICON CIRCLE */}
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* LABEL */}
                <p className="text-sm font-medium text-gray-800 max-w-[160px]">
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
