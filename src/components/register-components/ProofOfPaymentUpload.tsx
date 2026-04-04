import React, { useState } from 'react';

interface ProofOfPaymentUploadProps {
  proofOfPayment: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

function ProofOfPaymentUpload({ proofOfPayment, onFileChange, onRemoveFile }: ProofOfPaymentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [sizeError, setSizeError] = useState('');

  const MAX_SIZE_BYTES = 10 * 1024 * 1024;

  const validateAndDispatch = (file: File, fileInput: HTMLInputElement) => {
    if (file.size > MAX_SIZE_BYTES) {
      setSizeError('File exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }
    setSizeError('');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const fileInput = document.getElementById('proofOfPayment') as HTMLInputElement;
      if (fileInput) validateAndDispatch(file, fileInput);
    }
  };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Upload Proof of Payment <span className="text-red-500">*</span>
      </label>
      <div className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
        isDragOver
          ? 'border-purple-500 bg-purple-100'
          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      >
        {!proofOfPayment ? (
          <label htmlFor="proofOfPayment" className="cursor-pointer block">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-3">
                <span className="text-purple-600 hover:text-purple-500 font-medium text-lg">Click anywhere to upload</span>
                <p className="text-sm text-gray-600 mt-2">Drag and drop your file here, or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
            <input
              id="proofOfPayment"
              type="file"
              className="sr-only"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > MAX_SIZE_BYTES) {
                  setSizeError('File exceeds the 10MB limit. Please upload a smaller file.');
                  e.target.value = '';
                  return;
                }
                setSizeError('');
                onFileChange(e);
              }}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="ml-2 text-sm text-gray-900">{proofOfPayment.name}</span>
            </div>
            <button
              type="button"
              onClick={() => { setSizeError(''); onRemoveFile(); }}
              className="text-red-600 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              title="Remove file"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {sizeError && (
        <p className="text-xs text-red-600 mt-1">{sizeError}</p>
      )}
    </div>
  );
}

export default ProofOfPaymentUpload;