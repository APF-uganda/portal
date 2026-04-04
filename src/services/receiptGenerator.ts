import jsPDF from 'jspdf'

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
  // Extended dynamic fields
  memberName?: string
  memberEmail?: string
  paymentType?: string       // e.g. 'Membership Application', 'Annual Renewal', 'Event Registration'
  invoiceNumber?: string
  periodStart?: string
  periodEnd?: string
  notes?: string
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

const APF_PURPLE = '#4A2882'
const SECONDARY = '#64748b'
const LOGO_PATH = '/LogoDashboard.png'

export class ReceiptGenerator {

  private static buildPDF(pdf: jsPDF, receipt: ReceiptData, logoImg?: HTMLImageElement): void {
    // ── Header ──────────────────────────────────────────────────────────────
    if (logoImg) {
      pdf.addImage(logoImg, 'PNG', 20, 12, 28, 28)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(APF_PURPLE)
      pdf.text('ACCOUNTANCY PRACTITIONERS FORUM', 55, 22)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(SECONDARY)
      pdf.text('P.O. Box 190657, GPO Kampala, Uganda', 55, 29)
      pdf.text('Tel: +256 767 618 767  |  Email: practitionersug@gmail.com', 55, 35)
    } else {
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(APF_PURPLE)
      pdf.text('ACCOUNTANCY PRACTITIONERS FORUM', 105, 22, { align: 'center' })
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(SECONDARY)
      pdf.text('P.O. Box 190657, GPO Kampala, Uganda', 105, 29, { align: 'center' })
      pdf.text('Tel: +256 767 618 767  |  Email: practitionersug@gmail.com', 105, 35, { align: 'center' })
    }

    pdf.setDrawColor(APF_PURPLE)
    pdf.setLineWidth(0.8)
    pdf.line(20, 45, 190, 45)

    // ── Document title ───────────────────────────────────────────────────────
    const docTitle = receipt.type === 'invoice' ? 'OFFICIAL INVOICE' : 'OFFICIAL RECEIPT'
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(APF_PURPLE)
    pdf.text(docTitle, 105, 58, { align: 'center' })

    // ── Payment type badge ───────────────────────────────────────────────────
    if (receipt.paymentType) {
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(SECONDARY)
      pdf.text(receipt.paymentType.toUpperCase(), 105, 65, { align: 'center' })
    }

    // ── Details table ────────────────────────────────────────────────────────
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)

    const rows: [string, string][] = []

    if (receipt.memberName)    rows.push(['Member Name:', receipt.memberName])
    if (receipt.memberEmail)   rows.push(['Email:', receipt.memberEmail])
    rows.push(['Reference No.:', receipt.reference])
    if (receipt.invoiceNumber) rows.push(['Invoice No.:', receipt.invoiceNumber])
    rows.push(['Date:', receipt.date])
    if (receipt.periodStart && receipt.periodEnd)
      rows.push(['Period:', `${receipt.periodStart} – ${receipt.periodEnd}`])
    rows.push(['Description:', receipt.title])
    if (receipt.description && receipt.description !== receipt.title)
      rows.push(['Details:', receipt.description])
    if (receipt.method)        rows.push(['Payment Method:', receipt.method])
    rows.push(['Status:', receipt.status || 'Paid'])

    let yPos = 76
    const lineH = 9
    const labelX = 22
    const valueX = 80

    rows.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold')
      pdf.text(label, labelX, yPos)
      pdf.setFont('helvetica', 'normal')
      const lines = pdf.splitTextToSize(value, 108)
      pdf.text(lines, valueX, yPos)
      yPos += lineH * lines.length
    })

    // ── Divider ──────────────────────────────────────────────────────────────
    yPos += 4
    pdf.setDrawColor(220, 220, 220)
    pdf.setLineWidth(0.3)
    pdf.line(20, yPos, 190, yPos)
    yPos += 8

    // ── Amount box ───────────────────────────────────────────────────────────
    pdf.setFillColor(245, 242, 252)
    pdf.setDrawColor(APF_PURPLE)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(20, yPos, 170, 18, 2, 2, 'FD')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    pdf.text('TOTAL AMOUNT:', 26, yPos + 12)
    pdf.setFontSize(13)
    pdf.setTextColor(APF_PURPLE)
    pdf.text(receipt.amount, 188, yPos + 12, { align: 'right' })
    yPos += 30

    // ── Notes ────────────────────────────────────────────────────────────────
    if (receipt.notes) {
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'italic')
      pdf.setTextColor(SECONDARY)
      const noteLines = pdf.splitTextToSize(`Note: ${receipt.notes}`, 170)
      pdf.text(noteLines, 20, yPos)
      yPos += noteLines.length * 6 + 6
    }

    // ── Watermark ────────────────────────────────────────────────────────────
    pdf.setFontSize(60)
    pdf.setTextColor(240, 237, 248)
    pdf.text('APF', 105, 180, { align: 'center', angle: 45 })

    // ── Footer ───────────────────────────────────────────────────────────────
    const footerY = 272
    pdf.setDrawColor(220, 220, 220)
    pdf.setLineWidth(0.3)
    pdf.line(20, footerY - 6, 190, footerY - 6)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(SECONDARY)
    pdf.text('Thank you for your continued membership with Accountancy Practitioners Forum', 105, footerY, { align: 'center' })
    pdf.text('For inquiries: practitionersug@gmail.com  |  Tel: +256 767 618 767', 105, footerY + 5, { align: 'center' })
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, footerY + 11, { align: 'center' })
  }

  static async generateReceiptPDF(receipt: ReceiptData): Promise<jsPDF> {
    const pdf = new jsPDF()
    return new Promise<jsPDF>((resolve, reject) => {
      const logoImg = new Image()
      logoImg.crossOrigin = 'anonymous'
      logoImg.onload = () => {
        try { this.buildPDF(pdf, receipt, logoImg); resolve(pdf) }
        catch (e) { reject(e) }
      }
      logoImg.onerror = () => {
        try { this.buildPDF(pdf, receipt); resolve(pdf) }
        catch (e) { reject(e) }
      }
      logoImg.src = LOGO_PATH
    })
  }

  static async generateSummaryPDF(receipts: ReceiptData[]): Promise<jsPDF> {
    const pdf = new jsPDF()
    return new Promise<jsPDF>((resolve, reject) => {
      const logoImg = new Image()
      logoImg.crossOrigin = 'anonymous'
      const build = (img?: HTMLImageElement) => {
        try {
          // Header
          if (img) {
            pdf.addImage(img, 'PNG', 20, 12, 28, 28)
            pdf.setFontSize(14); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(APF_PURPLE)
            pdf.text('ACCOUNTANCY PRACTITIONERS FORUM', 55, 22)
            pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(SECONDARY)
            pdf.text('P.O. Box 190657, GPO Kampala, Uganda', 55, 29)
          } else {
            pdf.setFontSize(14); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(APF_PURPLE)
            pdf.text('ACCOUNTANCY PRACTITIONERS FORUM', 105, 22, { align: 'center' })
            pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(SECONDARY)
            pdf.text('P.O. Box 190657, GPO Kampala, Uganda', 105, 29, { align: 'center' })
          }
          pdf.setDrawColor(APF_PURPLE); pdf.setLineWidth(0.8); pdf.line(20, 45, 190, 45)

          pdf.setFontSize(16); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(APF_PURPLE)
          pdf.text('RECEIPTS & INVOICES SUMMARY', 105, 58, { align: 'center' })

          // Table header
          let yPos = 74
          pdf.setFontSize(9); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(0, 0, 0)
          pdf.setFillColor(245, 242, 252)
          pdf.rect(20, yPos - 5, 170, 10, 'F')
          pdf.text('Date', 22, yPos)
          pdf.text('Reference', 52, yPos)
          pdf.text('Type', 92, yPos)
          pdf.text('Description', 115, yPos)
          pdf.text('Amount', 175, yPos, { align: 'right' })
          yPos += 6
          pdf.setDrawColor(APF_PURPLE); pdf.setLineWidth(0.4); pdf.line(20, yPos, 190, yPos)
          yPos += 6

          pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9)
          receipts.forEach((r, i) => {
            if (yPos > 260) { pdf.addPage(); yPos = 30 }
            if (i % 2 === 0) { pdf.setFillColor(250, 249, 255); pdf.rect(20, yPos - 4, 170, 8, 'F') }
            pdf.setTextColor(0, 0, 0)
            pdf.text(r.date, 22, yPos)
            pdf.text(r.reference.length > 16 ? r.reference.substring(0, 16) + '…' : r.reference, 52, yPos)
            pdf.text(r.type === 'invoice' ? 'Invoice' : 'Receipt', 92, yPos)
            const shortTitle = r.title.length > 22 ? r.title.substring(0, 22) + '…' : r.title
            pdf.text(shortTitle, 115, yPos)
            pdf.setTextColor(APF_PURPLE); pdf.setFont('helvetica', 'bold')
            pdf.text(r.amount, 188, yPos, { align: 'right' })
            pdf.setTextColor(0, 0, 0); pdf.setFont('helvetica', 'normal')
            yPos += 8
          })

          // Footer
          const footerY = 272
          pdf.setDrawColor(220, 220, 220); pdf.setLineWidth(0.3); pdf.line(20, footerY - 6, 190, footerY - 6)
          pdf.setFontSize(8); pdf.setFont('helvetica', 'italic'); pdf.setTextColor(SECONDARY)
          pdf.text('Accountancy Practitioners Forum  |  practitionersug@gmail.com  |  +256 767 618 767', 105, footerY, { align: 'center' })
          pdf.setFontSize(7); pdf.setFont('helvetica', 'normal')
          pdf.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, footerY + 6, { align: 'center' })

          resolve(pdf)
        } catch (e) { reject(e) }
      }
      logoImg.onload = () => build(logoImg)
      logoImg.onerror = () => build()
      logoImg.src = LOGO_PATH
    })
  }

  static downloadPDF(pdf: jsPDF, filename: string): void {
    pdf.save(filename)
  }

  static viewPDF(pdf: jsPDF): boolean {
    const url = URL.createObjectURL(pdf.output('blob'))
    const w = window.open(url, '_blank')
    return !!w
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
  setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification) }, 3000)
}
