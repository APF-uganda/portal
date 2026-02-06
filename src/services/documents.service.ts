/**
 * Documents service - handles all document-related API calls
 * Currently returns empty data - will be connected to backend API
 */

import { Document } from '../mocks/documents.mock'

/**
 * Get all documents for the current user
 * @returns Promise with array of documents
 */
export const getDocuments = async (): Promise<Document[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/documents`)
  // return response.json()
  
  return []
}

/**
 * Get documents by type (SYSTEM or USER)
 * @param _type - Document type filter
 * @returns Promise with filtered documents
 */
export const getDocumentsByType = async (_type: 'SYSTEM' | 'USER'): Promise<Document[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/documents?type=${_type}`)
  // return response.json()
  
  return []
}

/**
 * Upload a new document
 * @param _file - File to upload
 * @param _documentType - Type of document (SYSTEM or USER)
 * @returns Promise with upload result
 */
export const uploadDocument = async (_file: File, _documentType: 'SYSTEM' | 'USER'): Promise<boolean> => {
  // TODO: Replace with actual API call
  // const formData = new FormData()
  // formData.append('file', _file)
  // formData.append('type', _documentType)
  // 
  // const response = await fetch(`${API_BASE_URL}/documents/upload`, {
  //   method: 'POST',
  //   body: formData
  // })
  // return response.ok
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  return true
}

/**
 * Replace an existing document
 * @param _documentId - ID of document to replace
 * @param _file - New file
 * @returns Promise with replacement result
 */
export const replaceDocument = async (_documentId: string, _file: File): Promise<boolean> => {
  // TODO: Replace with actual API call
  // const formData = new FormData()
  // formData.append('file', _file)
  // 
  // const response = await fetch(`${API_BASE_URL}/documents/${_documentId}/replace`, {
  //   method: 'PUT',
  //   body: formData
  // })
  // return response.ok
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  return true
}

/**
 * Delete a document
 * @param _documentId - ID of document to delete
 * @returns Promise with deletion result
 */
export const deleteDocument = async (_documentId: string): Promise<boolean> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/documents/${_documentId}`, {
  //   method: 'DELETE'
  // })
  // return response.ok
  
  return true
}
