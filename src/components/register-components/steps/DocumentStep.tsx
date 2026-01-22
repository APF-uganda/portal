import CloudUpload from "./UploadCard";

function DocumentsStep() {
  return (
    <>
      <h3 className="font-semibold text-gray-800 mb-6">
        Document Uploads
      </h3>

      <div className="space-y-6">
        <CloudUpload
          title="Upload National ID (Front)"
          description="Max file size 5MB · JPG / PNG / PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={5}
        />

        <CloudUpload
          title="Upload National ID (Back)"
          description="Max file size 5MB · JPG / PNG / PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={5}
        />

        <CloudUpload
          title="Upload Practising Certificate"
          description="Max file size 5MB · JPG / PNG / PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={5}
        />

        <CloudUpload
          title="Upload Passport Photo"
          description="Max file size 2MB · JPG / PNG"
          accept=".jpg,.jpeg,.png"
          maxSizeMB={2}
        />
      </div>
    </>
  );
}

export default DocumentsStep;
