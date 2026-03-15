import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  buttonText?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, children, buttonText }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
      <div className="border-l-4 border-purple-700 pl-3 md:pl-4 mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      
      {children}

      {buttonText && (
        <button className="mt-6 md:mt-8 bg-purple-800 hover:bg-purple-900 text-white px-4 md:px-6 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center">
          {buttonText}
          <span>→</span>
        </button>
      )}
    </div>
  );
};

export default SectionCard;