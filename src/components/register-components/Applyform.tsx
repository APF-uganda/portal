import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./steps/Stepper";
import AccountStep from "./steps/AccountStep";
import PersonalStep from "./steps/PersonalStep";
import DocumentsStep from "./steps/DocumentStep";
import PaymentSteps from "./steps/PaymentSteps";
import { useRegistrationForm } from "../../hooks/useRegistrationForm";
import { submitApplication } from "../../services/applicationApi";
import {
  AccountDetailsData,
  PersonalInfoData,
  DocumentData,
  PaymentData,
  ApplicationSubmissionData,
} from "../../types/registration";

const STEPS = ["Account Details", "Personal Information", "Documents", "Payments"];
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

function ApplyForm() {
  const navigate = useNavigate();

  const {
    currentStep,
    accountDetails,
    personalInfo,
    documents,
    payment,
    setCurrentStep,
    setAccountDetails,
    setPersonalInfo,
    setDocuments,
    setPayment,
    clearAllData,
  } = useRegistrationForm();

  const [isAccountValid, setIsAccountValid] = useState(false);
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false);
  const [isDocumentsValid, setIsDocumentsValid] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const isLastStep = currentStep === STEPS.length - 1;

  const accountData: AccountDetailsData = accountDetails || {
    username: "", email: "", password: "", passwordConfirmation: "",
  };
  const personalData: PersonalInfoData = personalInfo || {
    firstName: "", lastName: "", ageRange: "", phoneNumber: "",
    address: "", icpauCertificateNumber: "", organization: "",
  };
  const documentsData: DocumentData[] = documents || [];
  const paymentData: PaymentData | null = payment || null;

  const canProceed = () => {
    if (currentStep === 0) return isAccountValid;
    if (currentStep === 1) return isPersonalInfoValid;
    if (currentStep === 2) return isDocumentsValid;
    if (currentStep === 3) return isPaymentValid;
    return false;
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true); // disable immediately

    if (!accountDetails || !personalInfo || !payment) {
      setSubmissionError("Please complete all required fields");
      return;
    }

    const uploadedDocuments = (documents || []).filter((doc) => doc.file instanceof File);
    if (uploadedDocuments.length === 0) {
      setSubmissionError("Please upload your documents before submitting");
      return;
    }

    if (uploadedDocuments.some((doc) => doc.file.size > MAX_UPLOAD_SIZE_BYTES)) {
      setSubmissionError("One or more files are too large. Maximum file size is 10MB.");
      return;
    }

    if (!payment.isValidated || !payment.proofOfPayment) {
      setSubmissionError("Please upload proof of payment before submitting");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const submissionData: ApplicationSubmissionData = {
        username: accountDetails.username,
        email: accountDetails.email,
        password: accountDetails.password,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        age_range: personalInfo.ageRange,
        phoneNumber: personalInfo.phoneNumber,
        address: personalInfo.address,
        icpauCertificateNumber: personalInfo.icpauCertificateNumber,
        organization: personalInfo.organization,
        paymentMethod: payment.method,
        paymentPhone: payment.phoneNumber,
        paymentCardNumber: payment.cardNumber,
        paymentCardExpiry: payment.expiryDate,
        paymentCardCvv: payment.cvv,
        paymentCardholderName: payment.cardholderName,
        paymentStatus: payment.status,
        paymentTransactionReference: payment.transactionReference,
        paymentErrorMessage: payment.errorMessage,
        paymentAmount: 50000,
        applicationReference: payment.applicationReference,
        documents: uploadedDocuments,
      };

      // Attach proof of payment
      submissionData.documents.push({
        id: "proof_of_payment",
        file: payment.proofOfPayment,
        fileName: payment.proofOfPayment.name,
        fileSize: payment.proofOfPayment.size,
        fileType: payment.proofOfPayment.type,
        uploadStatus: "uploaded" as const,
      });

      const result = await submitApplication(submissionData);

      if (result.success) {
        const username = accountDetails.username;
        const firstName = personalInfo.firstName;
        clearAllData();
        navigate("/apply/pending", { state: { username, firstName } });
      } else if (result.error?.includes('already registered') || result.error?.includes('already exists')) {
        // Application already submitted (e.g. user retried after timeout) — treat as success
        clearAllData();
        navigate("/apply/pending", { state: { username: accountDetails.username, firstName: personalInfo.firstName } });
      } else {
        setSubmissionError(result.error || "Failed to submit application. Please try again.");
      }
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, accountDetails, personalInfo, documents, payment, clearAllData, navigate]);

  const handleNext = () => {
    if (canProceed() && !completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <section className="bg-gray-100 py-6 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-8 text-center max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Apply for APF Membership</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete the form below to submit your membership application for review.
          </p>
        </div>

        <div className="w-full mb-6">
          <div className="sm:hidden text-center">
            <p className="text-sm font-medium text-gray-700">Step {currentStep + 1} of {STEPS.length}</p>
            <p className="text-xs text-purple-600 mt-1">{STEPS[currentStep]}</p>
          </div>
          <div className="hidden sm:block">
            <Stepper steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />
          </div>
        </div>

        <div className="w-full max-w-4xl bg-white border border-purple-300 rounded-lg p-4 sm:p-6 md:p-8">
          {currentStep === 0 && (
            <AccountStep data={accountData} onChange={setAccountDetails} onValidationChange={setIsAccountValid} />
          )}
          {currentStep === 1 && (
            <PersonalStep data={personalData} onChange={setPersonalInfo} onValidationChange={setIsPersonalInfoValid} />
          )}
          {currentStep === 2 && (
            <DocumentsStep documents={documentsData} onChange={setDocuments} onValidationChange={setIsDocumentsValid} />
          )}
          {currentStep === 3 && (
            <PaymentSteps data={paymentData} onChange={setPayment} onValidationChange={setIsPaymentValid} />
          )}

          <div className="flex justify-between mt-10 gap-4">
            <button
              disabled={currentStep === 0 || isSubmitting}
              onClick={handleBack}
              className={`px-6 sm:px-8 py-3 sm:py-2 rounded-lg text-sm font-medium min-h-[44px] min-w-[44px] ${currentStep === 0 || isSubmitting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
            >
              Back
            </button>

            {isLastStep ? (
              <button
                type="button"
                disabled={!canProceed() || isSubmitting}
                onClick={() => {
                  if (!isSubmitting) {
                    setIsSubmitting(true); // lock immediately
                    handleSubmit();
                  }
                }}
                className={`px-6 sm:px-8 py-3 sm:py-2 rounded-lg text-white text-sm font-medium transition min-h-[44px] min-w-[44px] ${canProceed() && !isSubmitting
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>

            ) : (
              <button
                type="button"
                disabled={!canProceed()}
                onClick={handleNext}
                className={`px-6 sm:px-8 py-3 sm:py-2 rounded-lg text-white text-sm font-medium transition min-h-[44px] min-w-[44px] ${canProceed() ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                Next
              </button>
            )}
          </div>

          {submissionError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submissionError}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ApplyForm;
