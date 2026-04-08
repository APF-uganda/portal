import { useEffect } from "react";
import CloudUpload from "./UploadCard";
import { DocumentData } from "../../../types/registration";

interface DocumentsStepProps {
  documents: DocumentData[];
  onChange: (documents: DocumentData[]) => void;
  onValidationChange: (isValid: boolean) => void;
}

// Document field identifiers
const DOCUMENT_FIELDS = {
  ICPAU_CERTIFICATE: 'icpau_certificate',
  FIRM_LICENSE: 'firm_license',
  
} as const;

const REQUIRED_DOCUMENT_IDS = [
  DOCUMENT_FIELDS.ICPAU_CERTIFICATE,
  DOCUMENT_FIELDS.FIRM_LICENSE,
  
] as const;

const MAX_UPLOAD_SIZE_MB = 10;
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;


function DocumentsStep({ documents, onChange, onValidationChange }: DocumentsStepProps) {
  // Helper to find document by field ID
  const getDocumentByField = (fieldId: string): DocumentData | undefined => {
    return documents.find(doc => doc.id === fieldId);
  };

  const getUploadedFiles = () => {
    return documents.filter(
      (doc) => doc.uploadStatus === "uploaded" && doc.file instanceof File
    );
  };

  // Helper to check if at least one document is uploaded
  // const hasAtLeastOneDocument = (): boolean => {
  //   return documents.some(doc => doc.file && doc.uploadStatus === 'uploaded');
  // };

  const hasAllRequiredDocuments = (): boolean => {
  return REQUIRED_DOCUMENT_IDS.every((id) =>
    documents.some(
      (doc) =>
        doc.id === id &&
        doc.uploadStatus === 'uploaded' &&
        doc.file instanceof File
    )
  );
};

  const hasOversizedFile = (): boolean => {
    return getUploadedFiles().some((doc) => doc.file.size > MAX_UPLOAD_SIZE_BYTES);
  };

  // Update validation state whenever documents change
  useEffect(() => {
    const isValid =
      hasAllRequiredDocuments() &&
      !hasOversizedFile();
    onValidationChange(isValid);
  }, [documents, onValidationChange]);

 
  
  // Handle file selection for a specific field
  const handleFileSelected = (fieldId: string, file: File) => {
    const newDocument: DocumentData = {
      id: fieldId,
      file: file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadStatus: 'uploaded',
    };

    // Update or add document
    const existingIndex = documents.findIndex(doc => doc.id === fieldId);
    let updatedDocuments: DocumentData[];
    
    if (existingIndex >= 0) {
      // Replace existing document
      updatedDocuments = [...documents];
      updatedDocuments[existingIndex] = newDocument;
    } else {
      // Add new document
      updatedDocuments = [...documents, newDocument];
    }

    onChange(updatedDocuments);
  };


  // Handle file removal for a specific field
  const handleFileRemoved = (fieldId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== fieldId);
    onChange(updatedDocuments);
  };

  return (
    <>
      <h3 className="font-semibold text-gray-800 mb-6">
        Document Uploads
      </h3>

      <div className="space-y-6">
        <CloudUpload
          title="Upload ICPAU Certificate"
          description="Max file size 10MB · JPG / PNG / PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={10}
          onFileSelected={(file) => handleFileSelected(DOCUMENT_FIELDS.ICPAU_CERTIFICATE, file)}
          onFileRemoved={() => handleFileRemoved(DOCUMENT_FIELDS.ICPAU_CERTIFICATE)}
          existingFile={getDocumentByField(DOCUMENT_FIELDS.ICPAU_CERTIFICATE)?.file || null}
          existingError={getDocumentByField(DOCUMENT_FIELDS.ICPAU_CERTIFICATE)?.errorMessage || null}
          onValidate={(file) => {
            const other = documents.find(
              (d) => d.id !== DOCUMENT_FIELDS.ICPAU_CERTIFICATE && d.file instanceof File &&
                d.file.name === file.name && d.file.size === file.size
            );
            return other ? 'This file is already used for another document. Please upload a different file.' : null;
          }}
        />

        <CloudUpload
          title="Upload Firm/Organization License"
          description="Max file size 10MB · JPG / PNG / PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={10}
          onFileSelected={(file) => handleFileSelected(DOCUMENT_FIELDS.FIRM_LICENSE, file)}
          onFileRemoved={() => handleFileRemoved(DOCUMENT_FIELDS.FIRM_LICENSE)}
          existingFile={getDocumentByField(DOCUMENT_FIELDS.FIRM_LICENSE)?.file || null}
          existingError={getDocumentByField(DOCUMENT_FIELDS.FIRM_LICENSE)?.errorMessage || null}
          onValidate={(file) => {
            const other = documents.find(
              (d) => d.id !== DOCUMENT_FIELDS.FIRM_LICENSE && d.file instanceof File &&
                d.file.name === file.name && d.file.size === file.size
            );
            return other ? 'This file is already used for another document. Please upload a different file.' : null;
          }}
        />

        {/* <CloudUpload
          title="Upload Passport Photo"
          description="Max file size 2MB · JPG / PNG"
          accept=".jpg,.jpeg,.png"
          maxSizeMB={2}
          onFileSelected={(file) => handleFileSelected(DOCUMENT_FIELDS.PASSPORT_PHOTO, file)}
          onFileRemoved={() => handleFileRemoved(DOCUMENT_FIELDS.PASSPORT_PHOTO)}
          existingFile={getDocumentByField(DOCUMENT_FIELDS.PASSPORT_PHOTO)?.file || null}
          existingError={getDocumentByField(DOCUMENT_FIELDS.PASSPORT_PHOTO)?.errorMessage || null}
        /> */}
      </div>

      {/* Validation message */}
      {documents.length === 0 && (
        <p className="text-xs text-gray-500 mt-4">
          Please upload all required documents to continue
        </p>
      )}
      {(hasOversizedFile()) && (
        <p className="text-xs text-red-600 mt-3">
          One or more files exceed the 10MB limit. Please upload a smaller file.
        </p>
      )}
    </>
  );
}

export default DocumentsStep;
