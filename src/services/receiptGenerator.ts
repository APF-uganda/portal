import jsPDF from 'jspdf'
import logoDashboard from '../assets/LogoDashboard.png'

export interface ReceiptData {
  id: string
  title: string
  reference: string
  date: string
  amount: string
  type: 'invoice' | 'receipt'
  description?: string
  method?: string
  status?: string
}

export interface TransactionData {
  reference: string
  type: string
  date: string
  description: string
  method: string
  amount: string
  status: string
}

export class ReceiptGenerator {
  private static addAPFHeader(pdf: jsPDF, logoImg?: HTMLImageElement): void {
    const primaryColor = '#7c3aed'
    const secondaryColor = '#64748b'
    
    if (logoImg) {
      pdf.addImage(logoImg, 'PNG', 20, 15, 30, 30)
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(primaryColor)
      pdf.text('ACCOUNTANCY PRACTITIONERS FORUM', 60, 25)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(secondaryColor)
      pdf.text('P. O. Box 190657, GPO Kampala-Uganda', 60, 32)
      pdf.text('Tel: 256 767 618 767', 60, 38)
      pdf.text('Email: practitionersug@gmail.com', 60, 44)
    } else {
      pdf.setFontSize(22)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(primaryColor)
      pdf.text('ACCOUNTANCY PRACTITIONERS FORUM', 105, 25, { align: 'center' })
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(secondaryColor)
      pdf.text('P. O. Box 190657, GPO Kampala-Uganda', 105, 32, { align: 'center' })
      pdf.text('Tel: 256 767 618 767', 105, 38, { align: 'center' })
      pdf.text('Email: practitionersug@gmail.com', 105, 44, { align: 'center' })
    }
    
    pdf.setTextColor(0, 0, 0)
    pdf.setLineWidth(0.5)
    pdf.setDrawColor(secondaryColor)
    pdf.line(20, 55, 190, 55)
  }

  private static addFooter(pdf: jsPDF, yPos: number): void {
    const secondaryColor = '#64748b'
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(secondaryColor)
    pdf.text('Thank you for your continued membership with Accountancy Practitioners Forum', 105, yPos, { align: 'center' })
    pdf.text('For inquiries, contact: practitionersug@gmail.com | Tel: 256 767 618 767', 105, yPos + 5, { align: 'center' })
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, yPos + 12, { align: 'center' })
    pdf.setFontSize(40)
    pdf.setTextColor(240, 240, 240)
    pdf.text('APF', 105, 150, { align: 'center', angle: 45 })
    pdf.setTextColor(0, 0, 0)
  }

  private static addAmountBox(pdf: jsPDF, amount: string, yPos: number): void {
    const primaryColor = '#7c3aed'
    pdf.setDrawColor('#64748b')
    pdf.setFillColor(245, 247, 250)
    pdf.roundedRect(20, yPos - 5, 170, 20, 2, 2, 'FD')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text('TOTAL AMOUNT:', 25, yPos + 5)
    pdf.setFontSize(14)
    pdf.setTextColor(primaryColor)
    pdf.text(amount, 185, yPos + 5, { align: 'right' })
    pdf.setTextColor(0, 0, 0)
  }

  static async generateReceiptPDF(receipt: ReceiptData): Promise<jsPDF> {
    const pdf = new jsPDF()
    return new Promise<jsPDF>((resolve, reject) => {
      const logoImg = new Image()
      logoImg.crossOrigin = 'anonymous'
      logoImg.onload = () => {
        try {
          this.addAPFHeader(pdf, logoImg)
          pdf.setFontSize(20)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor('#7c3aed')
          const docTitle = receipt.type === 'invoice' ? 'OFFICIAL INVOICE' : 'OFFICIAL RECEIPT'
          pdf.text(docTitle, 105, 70, { align: 'center' })
          pdf.setTextColor(0, 0, 0)
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'normal')
          let yPos = 90
          const lineHeight = 8
          pdf.setFont('helvetica', 'bold')
          pdf.text('Document Type:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text(receipt.type === 'invoice' ? 'Invoice' : 'Receipt', 70, yPos)
          yPos += lineHeight
          pdf.setFont('helvetica', 'bold')
          pdf.text('Reference Number:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text(receipt.reference, 70, yPos)
          yPos += lineHeight
          pdf.setFont('helvetica', 'bold')
          pdf.text('Issue Date:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text(receipt.date, 70, yPos)
          yPos += lineHeight
          pdf.setFont('helvetica', 'bold')
          pdf.text('Description:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          const splitDescription = pdf.splitTextToSize(receipt.title, 100)
          pdf.text(splitDescription, 70, yPos)
          yPos += (splitDescription.length - 1) * lineHeight
          yPos += lineHeight
          pdf.setFont('helvetica', 'bold')
          pdf.text('Status:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Paid', 70, yPos)
          yPos += 20
          this.addAmountBox(pdf, receipt.amount, yPos)
          yPos += 40
          this.addFooter(pdf, yPos)
          resolve(pdf)
        } catch (error) {
          reject(error)
        }
      }
      logoImg.onerror = () => {
        try {
          this.addAPFHeader(pdf)
          pdf.setFontSize(20)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor('#7c3aed')
          const docTitle = receipt.type === 'invoice' ? 'OFFICIAL INVOICE' : 'OFFICIAL RECEIPT'
          pdf.text(docTitle, 105, 70, { align: 'center' })
          pdf.setTextColor(0, 0, 0)
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'normal')
          let yPos = 90
          const lineHeight = 8
          pdf.setFont('helvetica', 'bold')
          pdf.text('Document Type:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text(receipt.type === 'invoice' ? 'Invoice' : 'Receipt', 70, yPos)
          yPos += lineHeight
          pdf.setFont('helvetica', 'bold')
          pdf.text('Reference Number:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text(receipt.reference, 70, yPos)
          yPos += lineHeight
          pdf.setFont('helvetica', 'bold')
          pdf.text('Issue Date:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text(receipt.date, 70, yPos)
          yPos += lineHeight
          pdf.setFont('helvetica', 'bold')
          pdf.text('Description:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          const splitDescription = pdf.splitTextToSize(receipt.title, 100)
          pdf.text(splitDescription, 70, yPos)
          yPos += (splitDescription.length - 1) * lineHeight
          yPos += lineHeight
          pdf.setFont('helvetica', 'bold')
          pdf.text('Status:', 20, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Paid', 70, yPos)
          yPos += 20
          this.addAmountBox(pdf, receipt.amount, yPos)
          yPos += 40
          this.addFooter(pdf, yPos)
          resolve(pdf)
        } catch (error) {
          reject(error)
        }
      }
      logoImg.src = logoDashboard
    })
  }

  static async generateSummaryPDF(receipts: ReceiptData[]): Promise<jsPDF> {
    const pdf = new jsPDF()
    return new Promise<jsPDF>((resolve, reject) => {
      const logoImg = new Image()
      logoImg.crossOrigin = 'anonymous'
      logoImg.onload = () => {
        try {
          this.addAPFHeader(pdf, logoImg)
          pdf.setFontSize(20)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor('#7c3aed')
          pdf.text('RECEIPTS & INVOICES SUMMARY', 105, 70, { align: 'center' })
          pdf.setTextColor(0, 0, 0)
          pdf.setFontSize(10)
          let yPos = 90
          pdf.setFont('helvetica', 'bold')
          pdf.text('Date', 20, yPos)
          pdf.text('Reference', 50, yPos)
          pdf.text('Description', 90, yPos)
          pdf.text('Amount', 160, yPos)
          pdf.line(20, yPos + 2, 190, yPos + 2)
          yPos += 10
          pdf.setFont('helvetica', 'normal')
          receipts.forEach((receipt) => {
            if (yPos > 250) {
              pdf.addPage()
              yPos = 30
            }
            pdf.text(receipt.date, 20, yPos)
            pdf.text(receipt.reference, 50, yPos)
            const shortTitle = receipt.title.length > 30 ? receipt.title.substring(0, 30) + '...' : receipt.title
            pdf.text(shortTitle, 90, yPos)
            pdf.text(receipt.amount, 160, yPos)
            yPos += 8
          })
          yPos += 20
          this.addFooter(pdf, yPos)
          resolve(pdf)
        } catch (error) {
          reject(error)
        }
      }
      logoImg.onerror = () => {
        try {
          this.addAPFHeader(pdf)
          pdf.setFontSize(20)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor('#7c3aed')
          pdf.text('RECEIPTS & INVOICES SUMMARY', 105, 70, { align: 'center' })
          pdf.setTextColor(0, 0, 0)
          pdf.setFontSize(10)
          let yPos = 90
          pdf.setFont('helvetica', 'bold')
          pdf.text('Date', 20, yPos)
          pdf.text('Reference', 50, yPos)
          pdf.text('Description', 90, yPos)
          pdf.text('Amount', 160, yPos)
          pdf.line(20, yPos + 2, 190, yPos + 2)
          yPos += 10
          pdf.setFont('helvetica', 'normal')
          receipts.forEach((receipt) => {
            if (yPos > 250) {
              pdf.addPage()
              yPos = 30
            }
            pdf.text(receipt.date, 20, yPos)
            pdf.text(receipt.reference, 50, yPos)
            const shortTitle = receipt.title.length > 30 ? receipt.title.substring(0, 30) + '...' : receipt.title
            pdf.text(shortTitle, 90, yPos)
            pdf.text(receipt.amount, 160, yPos)
            yPos += 8
          })
          yPos += 20
          this.addFooter(pdf, yPos)
          resolve(pdf)
        } catch (error) {
          reject(error)
        }
      }
      logoImg.src = logoDashboard
    })
  }

  static downloadPDF(pdf: jsPDF, filename: string): void {
    pdf.save(filename)
  }

  static viewPDF(pdf: jsPDF): boolean {
    const pdfBlob = pdf.output('blob')
    const url = URL.createObjectURL(pdfBlob)
    const newWindow = window.open(url, '_blank')
    if (!newWindow) {
      return false
    }
    return true
  }
}

export const showNotification = (message: string, type: 'success' | 'error'): void => {
  const notification = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  const icon = type === 'success' 
    ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
    : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>'
  
  notification.className = `fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`
  notification.innerHTML = `${icon}${message}`
  document.body.appendChild(notification)
  
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification)
    }
  }, 3000)
}