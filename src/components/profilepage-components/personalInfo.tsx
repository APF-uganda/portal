import { Input, ActionButton } from './ui';

export const PersonalInfo = () => (
  <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
    <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
      <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
      <p className="text-sm text-gray-400">Review and update your contact and personal details.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Input label="Full Name" placeholder="Joan Ntaky" />
      <Input label="Email Address" placeholder="jane.doe@apf.org" />
      <Input label="Phone Number" placeholder="+256 770 123 456" />
      <Input label="Date of Birth" placeholder="Select Date" />
    </div>
    
    <div className="mb-6">
      <Input label="National ID Number" placeholder="CM000000000000" />
      <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
        ℹ️ Verified and locked for security
      </p>
    </div>
    
    <ActionButton text="Save Changes" />
  </section>
);