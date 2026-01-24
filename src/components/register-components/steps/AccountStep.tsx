import Input from "../Input";

const ACCOUNT_FIELDS = [
  { label: "Full Name", placeholder: "Richard Male", required: true, pattern: "^[A-Za-z ]+$" },
  { label: "Email Address", placeholder: "richm@gmail.com", type: "email", required: true },
  { label: "Phone Number", placeholder: "+256 7XX XXX XXX", required: true, pattern: "^\\+256[0-9]{9}$" },
  { label: "Username or Email Login", placeholder: "Richard.M", required: true, minLength: 5 },
  { label: "Password", type: "password", name: "password", required: true, minLength: 8 },
  { label: "Confirm Password", type: "password", name: "confirmPassword", required: true, minLength: 8 },
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
            required={field.required} 
            pattern={field.pattern}
            minLength={field.minLength}
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