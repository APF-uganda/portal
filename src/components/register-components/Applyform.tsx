import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Stepper from "./steps/Stepper";
import AccountStep from "./steps/AccountStep";
import PersonalStep from "./steps/PersonalStep";
import DocumentsStep from "./steps/DocumentStep";
import PaymentSteps from "./steps/PaymentSteps";
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

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const FILE_SIZE_ERROR_MESSAGE =
  "One or more files are too large. Maximum file size is 5MB.";

function ApplyForm() {
  const navigate = useNavigate(); 
  
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

  // Clear any stale data when component first mounts
  useEffect(() => {
    // Check if this is a fresh visit (no current form data)
    if (!accountDetails && !personalInfo && currentStep === 0) {
      console.log('[Applyform] Fresh visit detected, clearing any stale sessionStorage');
      clearAllData();
    }
  }, []); // Only run on mount

  // Validation states for each step
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false);
  const [isDocumentsValid, setIsDocumentsValid] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // Track completed steps
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    icpauCertificateNumber: '',
    organization: '',
  };

  const documentsData: DocumentData[] = documents || [];

  const paymentData: PaymentData | null = payment || null;

  // Determine if Next button should be enabled
  const canProceed = () => {
    if (currentStep === 0) return isAccountValid;
    if (currentStep === 1) return isPersonalInfoValid;
    if (currentStep === 2) return isDocumentsValid;
    if (currentStep === 3) return isPaymentValid;
    return true; // For other steps, allow navigation for now
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Note: Email and Password validation is now handled inside AccountStep
    if (!accountData || !personalData || documentsData.length === 0 || !paymentData) {
      console.log('[Applyform] Validation failed: missing data');
      setSubmissionError('Please complete all required fields');
      return;
    }

    const uploadedDocuments = documentsData.filter(
      (doc) => doc.file instanceof File
    );

    const hasOversizedFile = uploadedDocuments.some(
      (doc) => doc.file.size > MAX_UPLOAD_SIZE_BYTES
    );
    const totalUploadSize = uploadedDocuments.reduce(
      (sum, doc) => sum + doc.file.size,
      0
    );

    if (hasOversizedFile || totalUploadSize > MAX_UPLOAD_SIZE_BYTES) {
      setSubmissionError(FILE_SIZE_ERROR_MESSAGE);
      return;
    }

    // Validate payment is successful - check isValidated flag (proof of payment uploaded)
    if (!paymentData.isValidated) {
      setSubmissionError('Please complete payment and upload proof of payment before submitting');
      return;
    }

    console.log('[Applyform] Starting submission...');
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Transform data to ApplicationSubmissionData format
      const submissionData: ApplicationSubmissionData = {
        // Account details
        username: accountData.username,
        email: accountData.email,
        password: accountData.password,
        
        // Personal information
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        age_range: personalData.ageRange,
        phoneNumber: personalData.phoneNumber,
        address: personalData.address,
        icpauCertificateNumber: personalData.icpauCertificateNumber,
        organization: personalData.organization,
        
        // Payment information
        paymentMethod: paymentData.method,
        paymentPhone: paymentData.phoneNumber,
        paymentCardNumber: paymentData.cardNumber,
        paymentCardExpiry: paymentData.expiryDate,
        paymentCardCvv: paymentData.cvv,
        paymentCardholderName: paymentData.cardholderName,
        paymentStatus: paymentData.status,
        paymentTransactionReference: paymentData.transactionReference,
        paymentErrorMessage: paymentData.errorMessage,
        paymentAmount: 50000, // Standard application fee
        
        // Documents with IDs
        documents: documentsData.filter((doc) => doc.file instanceof File),
      };

      // Add proof of payment to documents if it exists
      if (paymentData.proofOfPayment) {
        submissionData.documents.push({
          id: 'proof_of_payment',
          file: paymentData.proofOfPayment,
          fileName: paymentData.proofOfPayment.name,
          fileSize: paymentData.proofOfPayment.size,
          fileType: paymentData.proofOfPayment.type,
          uploadStatus: 'uploaded' as const,
        });
      }

      // Submit application
      const result = await submitApplication(submissionData);

      if (result.success) {
        // Store the data we want to pass before clearing
        const usernameToPass = accountData.username;
        const firstNameToPass = personalData.firstName;
        
        // Navigate directly to pending page with form data
        console.log('=== Navigation Debug ===');
        console.log('Account data:', JSON.stringify(accountData, null, 2));
        console.log('Personal data:', JSON.stringify(personalData, null, 2));
        console.log('Navigating with state:', JSON.stringify({ 
          username: usernameToPass,
          firstName: firstNameToPass 
        }, null, 2));
        
        navigate('/apply/pending', { 
          state: { 
            username: usernameToPass,
            firstName: firstNameToPass 
          } 
        });
        
        // Clear session storage AFTER navigation
        clearAllData();
      } else {
        // Display error message on submission failure (Requirement 9.5)
        setSubmissionError(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      // Display error message on submission failure (Requirement 9.5)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Next/Submit button click
  const handleNextOrSubmit = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      // Mark current step as completed when moving to next step
      if (canProceed() && !completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle Back button click
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
            <Stepper steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />
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

          {/* Error message display */}
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
