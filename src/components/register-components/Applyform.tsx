import { useState } from "react";
import Stepper from "./steps/Stepper";
import AccountStep from "./steps/AccountStep";
import PersonalStep from "./steps/PersonalStep";
import DocumentsStep from "./steps/DocumentStep";
import PaymentSteps from "./steps/PaymentSteps";

// Constants
const STEPS = [
  "Account Details",
  "Personal Information",
  "Documents",
  "Payments",
];

function ApplyForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (currentStep === 0) {
      const password = form.querySelector<HTMLInputElement>('input[name="password"]');
      const confirmPassword = form.querySelector<HTMLInputElement>('input[name="confirmPassword"]');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords do not match");
        confirmPassword.reportValidity();
        return;
      } else {
        confirmPassword?.setCustomValidity("");
      }
    }

    if (isLastStep) {
      console.log("Submitting the form");
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  return (
    <section className="bg-gray-100 py-6 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Apply for APF Membership
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete the form below to submit your membership application for review.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="w-full mb-6">
          {/* Mobile: simple indicator */}
          <div className="sm:hidden text-center">
            <p className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {STEPS[currentStep]}
            </p>
          </div>

          {/* Desktop: full stepper */}
          <div className="hidden sm:block">
            <Stepper steps={STEPS} currentStep={currentStep} />
          </div>
        </div>

        {/* Form Card */}
        <form className="w-full max-w-4xl bg-white border border-purple-300 rounded-lg p-4 sm:p-6 md:p-8">
          {currentStep === 0 && <AccountStep />}
          {currentStep === 1 && <PersonalStep />}
          {currentStep === 2 && <DocumentsStep />}
          {currentStep === 3 && <PaymentSteps />}

          {/* Actions */}
          <div className="flex justify-between mt-10">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((s) => s - 1)}
              className={`px-8 py-2 rounded-lg text-sm font-medium ${
                currentStep === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
            >
              {isLastStep ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ApplyForm;
