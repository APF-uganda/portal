import React, { useState } from "react"
import {
  IdCard,
  Award,
  Eye,
  RotateCcw,
  CloudUpload,
  FolderOpen,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Info,
  Plus,
  Loader2,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

const DocumentsPage: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle')
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const fileSize = (file.size / (1024 * 1024)).toFixed(2)

    if (parseFloat(fileSize) > 5) {
      alert('File size exceeds 5MB limit. Please select a smaller file.')
      return
    }

    setUploadStatus('uploading')
    
    // Simulate upload
    setTimeout(() => {
      setUploadStatus('success')
      setTimeout(() => {
        alert('Document uploaded successfully! It will now be reviewed by our admin team.')
        setUploadStatus('idle')
      }, 1000)
    }, 2000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleBrowseClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg,.jpeg,.png,.pdf'
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      handleFileUpload(target.files)
    }
    input.click()
  }

  const handleViewDocument = (docName: string) => {
    alert(`Opening ${docName} in preview mode...`)
  }

  const handleReplaceDocument = (docName: string) => {
    alert(`Initiating replacement for ${docName}...`)
    handleBrowseClick()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents Management</h1>
            <p className="text-gray-600">Manage your required documents for the APF Member Portal. Ensure all documents are up-to-date to maintain features.</p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            January 28, 2026
          </div>
        </div>

        {/* Required Documents Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Required Documents</h2>
            <p className="text-gray-600 mb-6">These documents are required for membership verification</p>
            
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">Identity Verification</CardTitle>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <IdCard className="w-6 h-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* National ID Front */}
                <div className="p-5 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IdCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-900">National ID (Front)</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  </div>
                  <div className="ml-13 space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 min-w-20">Uploaded:</span>
                      <span className="text-gray-900">2023-10-26</span>
                    </div>
                    <div className="bg-purple-50 border-l-3 border-purple-600 p-3 rounded text-sm">
                      <strong className="text-purple-700">Admin Feedback:</strong> Verified by John Doe on 2023-10-27.
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDocument('National ID (Front)')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleReplaceDocument('National ID (Front)')}
                        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Replace
                      </Button>
                    </div>
                  </div>
                </div>

                {/* National ID Back */}
                <div className="p-5 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IdCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-900">National ID (Back)</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending
                    </Badge>
                  </div>
                  <div className="ml-13 space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 min-w-20">Uploaded:</span>
                      <span className="text-gray-900">2023-10-26</span>
                    </div>
                    <div className="bg-purple-50 border-l-3 border-purple-600 p-3 rounded text-sm">
                      <strong className="text-purple-700">Admin Feedback:</strong> Document requires clearer scan. Please re-upload.
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDocument('National ID (Back)')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleReplaceDocument('National ID (Back)')}
                        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Replace
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload New Document Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload New Document</h2>
            <p className="text-gray-600 mb-6">Upload additional documents for verification</p>
            
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">Practising Certificate</CardTitle>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Existing Rejected Document */}
                <div className="p-5 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Practising Certificate</span>
                    </div>
                    <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Rejected
                    </Badge>
                  </div>
                  <div className="ml-13 space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 min-w-20">Uploaded:</span>
                      <span className="text-gray-900">2023-09-15</span>
                    </div>
                    <div className="bg-purple-50 border-l-3 border-purple-600 p-3 rounded text-sm">
                      <strong className="text-purple-700">Admin Feedback:</strong> Certificate expired. Please provide a valid, renewed copy.
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDocument('Practising Certificate')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleReplaceDocument('Practising Certificate')}
                        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Replace
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-10 text-center transition-all cursor-pointer ${
                    dragOver 
                      ? 'border-purple-600 bg-purple-50 scale-101' 
                      : uploadStatus === 'success'
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 bg-purple-50/20 hover:border-purple-600 hover:bg-purple-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={uploadStatus === 'idle' ? handleBrowseClick : undefined}
                >
                  {uploadStatus === 'success' ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-2">File uploaded successfully!</div>
                      <div className="text-gray-600 mb-5">Your document is now being processed</div>
                      <Button 
                        onClick={handleBrowseClick}
                        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Upload Another
                      </Button>
                    </>
                  ) : uploadStatus === 'uploading' ? (
                    <>
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-2">Uploading...</div>
                      <div className="text-gray-600">Please wait while we process your file</div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CloudUpload className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-2">Drag and drop your files here</div>
                      <div className="text-gray-600 mb-5">or browse files on your computer</div>
                      <Button 
                        onClick={handleBrowseClick}
                        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Browse Files
                      </Button>
                      <div className="text-sm text-gray-500 mt-4">
                        Max 5MB per file. Supported formats: JPG, PNG, PDF.
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Files are securely encrypted and stored. You can upload up to 10 documents.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DocumentsPage