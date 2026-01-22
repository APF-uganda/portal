import Input from "../Input";

const ACCOUNT_FIELDS = [
  { label: "Full Name", placeholder: "Richard Male" },
  { label: "Email Address", placeholder: "richm@gmail.com" },
  { label: "Phone Number", placeholder: "+256 7XX XXX XXX" },
  { label: "Username or Email Login", placeholder: "Richard.M" },
  { label: "Password", type: "password" },
  { label: "Confirm Password", type: "password" },
];

function AccountStep() {
  return (
    <>
      <h3 className="font-semibold text-gray-800 mb-6 text-center">
        Account Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {ACCOUNT_FIELDS.map((field) => (
          <Input
            key={field.label}
            label={field.label}
            type={field.type || "text"}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Minimum 8 characters
      </p>
    </>
  );
}

export default AccountStep;