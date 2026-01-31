

import { Input, ActionButton } from './ui'; 

export const SecuritySettings = () => {
  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6">
      <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Security & Login Settings</h2>
        <p className="text-sm text-gray-400">Update your password and enhance account security.</p>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Input label="Current Password" type="password" placeholder="••••••••" />
        <Input label="New Password" type="password" placeholder="••••••••" />
        <Input label="Confirm New Password" type="password" placeholder="••••••••" />
      </div>
  
      <div className="bg-[#F9F7FD] p-4 rounded-xl flex justify-between items-center mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-800">Enable Multi-Factor Authentication (MFA)</p>
          <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
        </div>
        {/* Toggle Switch */}
        <button type="button" className="w-10 h-5 bg-[#5C32A3] rounded-full relative transition-colors cursor-pointer">
          <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
        </button>
      </div>
  
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-600 mb-4 uppercase tracking-wider">Preferred OTP Channel</p>
        <div className="flex flex-wrap gap-6">
          {['Email', 'SMS', 'Authenticator App'].map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input 
                type="radio" 
                name="otp" 
                className="w-4 h-4 accent-[#5C32A3] cursor-pointer" 
                defaultChecked={item === 'Email'} 
              /> 
              {item}
            </label>
          ))}
        </div>
      </div>
  
      <ActionButton text="Update Security Settings" />
    </section>
  );
};