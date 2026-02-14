/**
 * Documents service - handles all document-related API calls
 */

import { API_V1_BASE_URL } from '../config/api'
import { Document } from '../types/documents'

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token')
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/**
 * Get all documents for the current user
 * @returns Promise with array of documents
 */
export const getDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_V1_BASE_URL}/documents/`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    return []
  }
  return response.json()
}

/**
 * Get documents by type (SYSTEM or USER)
 * @param _type - Document type filter
 * @returns Promise with filtered documents
 */
export const getDocumentsByType = async (_type: 'SYSTEM' | 'USER'): Promise<Document[]> => {
  const response = await fetch(`${API_V1_BASE_URL}/documents/?type=${_type}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    return []
  }
  return response.json()
}

/**
 * Upload a new document
 * @param _file - File to upload
 * @param _documentType - Type of document (SYSTEM or USER)
 * @returns Promise with upload result
 */
export const uploadDocument = async (_file: File): Promise<boolean> => {
  const formData = new FormData()
  formData.append('file', _file)

  const response = await fetch(`${API_V1_BASE_URL}/documents/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  return response.ok
}

/**
 * Replace an existing document
 * @param _documentId - ID of document to replace
 * @param _file - New file
 * @returns Promise with replacement result
 */
export const replaceDocument = async (_documentId: string, _file: File): Promise<boolean> => {
  const formData = new FormData()
  formData.append('file', _file)

  const response = await fetch(`${API_V1_BASE_URL}/documents/${_documentId}/replace/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,
  })

  return response.ok
}

/**
 * Delete a document
 * @param _documentId - ID of document to delete
 * @returns Promise with deletion result
 */
export const deleteDocument = async (_documentId: string): Promise<boolean> => {
  const response = await fetch(`${API_V1_BASE_URL}/documents/${_documentId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  return response.ok
}

/**
 * Download a document
 * @param documentId - ID of document to download
 * @param fileName - Name to save the file as
 * @returns Promise with download result
 */
export const downloadDocument = async (documentId: string, fileName: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_V1_BASE_URL}/documents/${documentId}/download/`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      return false
    }

    // Get the blob from response
    const blob = await response.blob()
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob)
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Download error:', error)
    return false
  }
}

