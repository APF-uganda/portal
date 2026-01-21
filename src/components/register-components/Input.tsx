type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
};

function Input({ label, type = "text", placeholder }: InputProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

export default Input;