import { useState, useEffect } from 'react'
import { Document, isExpired } from '../mocks/documents.mock'
import { getDocuments, uploadDocument as uploadDocumentService, replaceDocument as replaceDocumentService } from '../services/documents.service'

/**
 * Custom hook for document management
 * Fetches documents from backend API
 */
export const useDocuments = () => {
  const [documents, setDocuments] = useState<{
    system: Document[]
    user: Document[]
  }>({
    system: [],
    user: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const allDocuments = await getDocuments()
        
        // Separate documents by type
        const systemDocs = allDocuments.filter(doc => doc.type === 'SYSTEM')
        const userDocs = allDocuments.filter(doc => doc.type === 'USER')
        
        setDocuments({
          system: systemDocs,
          user: userDocs
        })
      } catch (err) {
        setError('Failed to load documents')
        console.error('Documents error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  /**
   * Upload a new document
   */
  const uploadDocument = async (file: File, documentType: 'SYSTEM' | 'USER'): Promise<boolean> => {
    try {
      const success = await uploadDocumentService(file, documentType)
      
      if (success) {
        // Refresh documents after upload
        const allDocuments = await getDocuments()
        const systemDocs = allDocuments.filter(doc => doc.type === 'SYSTEM')
        const userDocs = allDocuments.filter(doc => doc.type === 'USER')
        
        setDocuments({
          system: systemDocs,
          user: userDocs
        })
      }
      
      return success
    } catch (error) {
      console.error('Upload failed:', error)
      return false
    }
  }

  /**
   * Replace an existing document
   */
  const replaceDocument = async (documentId: string, file: File): Promise<boolean> => {
    try {
      const success = await replaceDocumentService(documentId, file)
      
      if (success) {
        // Refresh documents after replacement
        const allDocuments = await getDocuments()
        const systemDocs = allDocuments.filter(doc => doc.type === 'SYSTEM')
        const userDocs = allDocuments.filter(doc => doc.type === 'USER')
        
        setDocuments({
          system: systemDocs,
          user: userDocs
        })
      }
      
      return success
    } catch (error) {
      console.error('Replace failed:', error)
      return false
    }
  }

  /**
   * Check if a document needs re-upload
   */
  const needsReupload = (doc: Document): boolean => {
    return isExpired(doc.expiryDate) || doc.status === 'rejected'
  }

  return {
    documents,
    loading,
    error,
    uploadDocument,
    replaceDocument,
    needsReupload,
    isExpired
  }
}
