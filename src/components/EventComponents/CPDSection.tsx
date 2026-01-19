import {
  TrendingUp,
  GraduationCap,
  CheckCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

const CPDSection = () => {
  return (
    <section className="bg-[#E5DCF9] py-16 -mx-[50vw] px-[50vw]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          CPD Accreditation
        </h2>

        <h3 className="text-xl font-semibold text-[#562497] mb-4">
          Elevate Your Expertise with APF CPD
        </h3>
        <p className="text-gray-700 mb-8">
          Our Continuous Professional Development (CPD) programs are meticulously
          designed to ensure accountancy practitioners in Uganda remain at the
          forefront of industry knowledge, ethical standards, and professional skills.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 text-[#562497] mt-1" />
            <p className="text-gray-700">
              Stay updated with the latest industry trends and regulations.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <GraduationCap className="w-6 h-6 text-[#562497] mt-1" />
            <p className="text-gray-700">
              Enhance your professional skills and competencies.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-[#562497] mt-1" />
            <p className="text-gray-700">
              Access exclusive workshops, webinars, and conferences.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#562497] mt-1" />
            <p className="text-gray-700">
              Maintain your professional license and credibility.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <Users className="w-6 h-6 text-[#562497] mt-1" />
            <p className="text-gray-700">
              Network with leading professionals in the accountancy field.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CPDSection;