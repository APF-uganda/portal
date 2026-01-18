import { TrendingUp, GraduationCap, CheckCircle, ShieldCheck, Users } from "lucide-react";

const CPDSection = () => {
  return (
    <div className="py-12 bg-[#f3e8ff] -mx-[50vw] ml-[50%] px-[50vw] pl-[50%] text-center">
      <div className="max-w-[1000px] mx-auto px-6">
        <h4 className="text-2xl font-semibold mb-4">
          CPD Accreditation
        </h4>
        <h5 className="text-xl font-semibold mb-4">
          Elevate Your Expertise with APF CPD
        </h5>
        <p className="max-w-[700px] mx-auto mb-8">
          Our Continuous Professional Development (CPD) programs are meticulously designed to ensure
          accountancy practitioners in Uganda remain at the forefront of industry knowledge, ethical
          standards, and professional skills.
        </p>

        <ul className="max-w-[700px] mx-auto text-left list-none">
          <li className="flex items-start mb-4">
            <div className="mr-4 mt-1">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <p>Stay updated with the latest industry trends and regulations.</p>
          </li>
          <li className="flex items-start mb-4">
            <div className="mr-4 mt-1">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <p>Enhance your professional skills and competencies.</p>
          </li>
          <li className="flex items-start mb-4">
            <div className="mr-4 mt-1">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <p>Access exclusive workshops, webinars, and conferences.</p>
          </li>
          <li className="flex items-start mb-4">
            <div className="mr-4 mt-1">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <p>Maintain your professional license and credibility.</p>
          </li>
          <li className="flex items-start mb-4">
            <div className="mr-4 mt-1">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p>Network with leading professionals in the accountancy field.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CPDSection;