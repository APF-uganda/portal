import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import Stepper from "./steps/Stepper";
import AccountStep from "./steps/AccountStep";
import PersonalStep from "./steps/PersonalStep";
import DocumentsStep from "./steps/DocumentStep";
import PaymentSteps from "./steps/PaymentSteps";
import SuccessModal from "./SuccessModal";
import { useRegistrationForm } from "../../hooks/useRegistrationForm";
import { submitApplication } from "../../services/applicationApi";
import { AccountDetailsData, PersonalInfoData, DocumentData, PaymentData, ApplicationSubmissionData } from "../../types/registration";

// Constants
const STEPS = [
  "Account Details",
  "Personal Information",
  "Documents",
  "Payments",
];

function ApplyForm() {
  const navigate = useNavigate(); // Initialize navigate hook
  
  // Form state management
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

  // Validation states for each step
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false);
  const [isDocumentsValid, setIsDocumentsValid] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const isLastStep = currentStep === STEPS.length - 1;

  // Initialize data if null
  const accountData: AccountDetailsData = accountDetails || {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const personalData: PersonalInfoData = personalInfo || {
    firstName: '',
    lastName: '',
    ageRange: '',
    phoneNumber: '',
    address: '',
    nationalIdNumber: '',
    icpauCertificateNumber: '',
    organization: '',
  };

  const documentsData: DocumentData[] = documents || [];
  const paymentData: PaymentData | null = payment || null;

  
  const canProceed = () => {
    if (currentStep === 0) return isAccountValid;
    if (currentStep === 1) return isPersonalInfoValid;
    if (currentStep === 2) return isDocumentsValid;
    if (currentStep === 3) return isPaymentValid;
    return true; 
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!accountData || !personalData || documentsData.length === 0 || !paymentData) {
      setSubmissionError('Please complete all required fields');
      return;
    }

    if ((paymentData.status !== 'success' && paymentData.status !== 'completed') || !paymentData.isValidated) {
      setSubmissionError('Please complete payment before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const submissionData: ApplicationSubmissionData = {
        username: accountData.username,
        email: accountData.email,
        password: accountData.password,
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        age_range: personalData.ageRange,
        phoneNumber: personalData.phoneNumber,
        address: personalData.address,
        nationalIdNumber: personalData.nationalIdNumber,
        icpauCertificateNumber: personalData.icpauCertificateNumber,
        organization: personalData.organization,
        paymentMethod: paymentData.method,
        paymentPhone: paymentData.phoneNumber,
        paymentCardNumber: paymentData.cardNumber,
        paymentCardExpiry: paymentData.expiryDate,
        paymentCardCvv: paymentData.cvv,
        paymentCardholderName: paymentData.cardholderName,
        paymentStatus: paymentData.status,
        paymentTransactionReference: paymentData.transactionReference,
        paymentErrorMessage: paymentData.errorMessage,
        paymentAmount: 50000, 
        documents: documentsData.filter((doc) => doc.file instanceof File),
      };

      const result = await submitApplication(submissionData);

      if (result.success) {
        clearAllData();
        setShowSuccessModal(true);
      } else {
        setSubmissionError(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextOrSubmit = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Updated to redirect to the Pending Approval screen
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/apply/pending'); // Redirects to the branded pending page
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
          <div className="sm:hidden text-center">
            <p className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {STEPS[currentStep]}
            </p>
          </div>
          <div className="hidden sm:block">
            <Stepper steps={STEPS} currentStep={currentStep} />
          </div>
        </div>

        {/* FORM CARD */}
        <div className="w-full max-w-4xl bg-white border border-purple-300 rounded-lg p-4 sm:p-6 md:p-8">
          {currentStep === 0 && (
            <AccountStep
              data={accountData}
              onChange={setAccountDetails}
              onValidationChange={setIsAccountValid}
            />
          )}
          {currentStep === 1 && (
            <PersonalStep
              data={personalData}
              onChange={setPersonalInfo}
              onValidationChange={setIsPersonalInfoValid}
            />
          )}
          {currentStep === 2 && (
            <DocumentsStep
              documents={documentsData}
              onChange={setDocuments}
              onValidationChange={setIsDocumentsValid}
            />
          )}
          {currentStep === 3 && (
            <PaymentSteps
              data={paymentData}
              onChange={setPayment}
              onValidationChange={setIsPaymentValid}
              onPaymentComplete={handleSubmit}
            />
          )}

          {/* ACTIONS */}
          <div className="flex justify-between mt-10 gap-4">
            <button
              disabled={currentStep === 0}
              onClick={handleBack}
              className={`px-6 sm:px-8 py-3 sm:py-2 rounded-lg text-sm font-medium min-h-[44px] min-w-[44px]
                ${
                  currentStep === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Back
            </button>

            <button
              type="button"
              disabled={!canProceed() || isSubmitting}
              onClick={handleNextOrSubmit}
              className={`px-6 sm:px-8 py-3 sm:py-2 rounded-lg text-white text-sm font-medium transition min-h-[44px] min-w-[44px]
                ${canProceed() && !isSubmitting
                  ? "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? "Submitting..." : isLastStep ? "Submit" : "Next"}
            </button>
          </div>

          {submissionError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submissionError}</p>
            </div>
          )}
        </div>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          message="Your application has been submitted successfully! Please await a confirmation email from the admin."
        />
      </div>
    </section>
  );
}

export default ApplyForm;