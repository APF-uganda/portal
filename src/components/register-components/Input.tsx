type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  name?: string;
};

function Input({ label, type = "text", placeholder, required, pattern, minLength, name }: InputProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        minLength={minLength}
        name={name}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

export default Input;