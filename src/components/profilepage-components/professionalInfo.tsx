

import { Input, ActionButton } from './ui'; 

export const ProfessionalInfo = () => {
  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6">
      {/* Section Header */}
      <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Professional Information</h2>
        <p className="text-sm text-gray-400">Manage your professional details and membership standing.</p>
      </div>
  
      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Input label="Membership Category" placeholder="Full Member" />
        <Input label="ICPAU Registration Number" placeholder="F/ICPAU/2015/001" />
        <Input label="Organization / Firm" placeholder="APF Audit" />
        <Input label="Practising Status" placeholder="Active" />
      </div>
  
      {/* Help Text */}
      <p className="text-[10px] text-gray-400 mb-6 flex items-center gap-1">
        <span role="img" aria-label="info">ℹ️</span> Changes require admin approval
      </p>
  
      {/* Form Action */}
      <ActionButton text="Update Professional Info" />
    </section>
  );
};