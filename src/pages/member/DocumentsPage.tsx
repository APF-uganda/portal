import React from "react"
import { Calendar, ShieldCheck, FileText, Upload } from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { getCurrentDateFormatted } from "../../utils/dateUtils"
import { useDocuments } from "../../hooks/useDocuments"
import { Document } from "../../types/documents"
import { DocumentCard } from "../../components/documents/DocumentCard"
import { UploadArea } from "../../components/documents/UploadArea"
import { toastMessages, showInfo } from "../../utils/toast-helpers"

const DocumentsPage: React.FC = () => {
  const { documents, loading, uploadDocument, replaceDocument } = useDocuments()

  const handleViewDocument = (doc: Document) => {
    if (!doc.fileUrl) {
      showInfo('No file available for this document yet.', 'Document Preview')
      return
    }
    window.open(doc.fileUrl, '_blank', 'noopener,noreferrer')
  }

  const handleReuploadDocument = (doc: Document) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg,.jpeg,.png,.pdf'
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const success = await replaceDocument(doc.id, target.files[0])
        if (success) {
          toastMessages.document.replaced(doc.name)
        }
      }
    }
    input.click()
  }

  const handleUploadNewDocument = async (
    file: File
  ): Promise<boolean> => {
    const success = await uploadDocument(file)
    if (success) {
      toastMessages.document.uploaded()
    }
    return success
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading documents...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents & Certificates</h1>
            <p className="text-gray-600">
              Manage your required documents and upload additional certificates for verification
            </p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 w-fit">
            <Calendar className="w-4 h-4" />
            {getCurrentDateFormatted()}
          </div>
        </div>

        {/* ================= SECTION 1: UPLOAD NEW DOCUMENT ================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload New Document</h2>
              <p className="text-sm text-gray-600">Add additional certificates or qualifications for admin review</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <UploadArea onUpload={handleUploadNewDocument} />
          </div>
        </div>

        {/* ================= SECTION 2: OTHER DOCUMENTS (User Uploads) ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Documents Pending Review</h2>
                <p className="text-sm text-gray-600">Additional certificates and qualifications (require admin review)</p>
              </div>
            </div>
          </div>

          {/* Grid of user-uploaded documents */}
          {documents.user.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.user.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onView={handleViewDocument}
                  onReupload={doc.status === 'rejected' ? handleReuploadDocument : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No additional documents uploaded yet</p>
              <p className="text-sm text-gray-500 mt-1">Upload your first document below</p>
            </div>
          )}
        </div>

        {/* ================= SECTION 3: APPROVED DOCUMENTS (System Required) ================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Approved Documents</h2>
              <p className="text-sm text-gray-600">System-required documents for membership verification</p>
            </div>
          </div>

          {/* Grid of approved/system documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.system.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleViewDocument}
                onReupload={handleReuploadDocument}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DocumentsPage
