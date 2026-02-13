# Document Download Feature

## Overview
Members can now download their uploaded documents directly from the Documents page. This allows them to keep local copies of their membership documents and re-upload them when they expire.

## User Story
As a member, I want to access and download my membership documents so that I can view my documents and be able to re-upload them when they expire.

## Implementation

### Backend Changes
- Added `download` action to `DocumentViewSet` in `Backend/Documents/views.py`
- Endpoint: `GET /api/v1/documents/{id}/download/`
- Returns file as downloadable attachment with proper headers
- Security: Members can only download their own documents

### Frontend Changes

#### 1. Service Layer (`documents.service.ts`)
- Added `downloadDocument()` function
- Handles file download using Blob API
- Creates temporary download link and triggers browser download

#### 2. Hook Layer (`useDocuments.ts`)
- Added `downloadDocument()` method to the hook
- Provides easy access to download functionality

#### 3. Component Layer (`DocumentCard.tsx`)
- Added Download button with download icon
- Positioned between View and Re-upload buttons
- Shows for all documents that have files

#### 4. Page Layer (`DocumentsPage.tsx`)
- Added `handleDownloadDocument()` handler
- Shows success/error toast messages
- Passes download handler to all DocumentCard components

#### 5. Toast Messages (`toast-helpers.ts`)
- Added `document.downloaded()` message
- Shows success notification with document name

## Usage

### For Members
1. Navigate to Documents page
2. Find the document you want to download
3. Click the "Download" button
4. File will be downloaded to your default downloads folder

### Button Layout
Each document card now has up to 3 action buttons:
- **View**: Opens document in new tab (if URL available)
- **Download**: Downloads document to local machine
- **Re-upload**: Replaces document (shown for expired/rejected docs)

## Technical Details

### Download Flow
1. User clicks Download button
2. Frontend calls `/api/v1/documents/{id}/download/`
3. Backend validates user owns the document
4. Backend returns file with proper headers:
   - `Content-Type`: File's MIME type
   - `Content-Disposition`: attachment with filename
   - `Content-Length`: File size
5. Frontend creates Blob from response
6. Creates temporary URL and triggers download
7. Cleans up temporary URL after download

### Security
- JWT authentication required
- Users can only download their own documents
- Backend validates document ownership before serving file

### Error Handling
- Shows error toast if download fails
- Handles missing files gracefully
- Logs errors to console for debugging

## Testing Checklist
- [ ] Download approved documents
- [ ] Download pending documents
- [ ] Download expired documents
- [ ] Download rejected documents
- [ ] Verify correct filename
- [ ] Verify file integrity after download
- [ ] Test with different file types (PDF, JPG, PNG)
- [ ] Test with large files
- [ ] Verify security (can't download other users' docs)
- [ ] Test error handling (missing file, network error)

## Future Enhancements
- Bulk download (download all documents as ZIP)
- Download history tracking
- Preview before download
- Share document with admin
- Email document to self
