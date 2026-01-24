type PaymentOptionProps = {
  label: string;
  value: string;
  logo : string;
  selected: string | null;
  onSelect: (value: string) => void;
};

function PaymentOption({
  label,
  value,
  logo,
  selected,
  onSelect,
}: PaymentOptionProps) {
  const isActive = selected === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`border rounded-lg p-4 text-sm text-center transition min-h-[44px] touch-manipulation
        ${
          isActive
            ? "border-purple-600 bg-purple-50 text-purple-700"
            : "border-gray-200 hover:border-purple-400 active:border-purple-500"
        }`}
    >
        <div className="flex justify-center mb-2">
        <img
        src={logo}
        alt={label}
        className="h-12 object-contain"
      />
    </div>
      {label}
    </button>
  );
}
export default PaymentOption;