import Input from "../Input";

function PersonalStep() {
  return (
    <>
      <h3 className="font-semibold text-gray-800 mb-6">
        Personal & Professional Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Input label="National ID Number (NIN)" placeholder="CMXXXXXXXXXX" />
        <Input label="Date of Birth" type="date" />
        <Input
          label="ICPAU Practising Certificate Number"
          placeholder="ICPAU/XXXX/XX"
        />
        <Input
            label="Organization / Firm (Optional)"
            placeholder="ABC Accounting Firm"
          />
       
      </div>
    </>
  );
}

export default PersonalStep;