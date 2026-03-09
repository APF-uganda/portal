import jsPDF from 'jspdf';

interface MembershipInvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  memberName: string;
  memberEmail: string;
  membershipNumber?: string;
  membershipType: string;
  renewalPeriod: string; // e.g., "2026-2027"
  amount: number;
  currency?: string;
  previousBalance?: number;
  discount?: number;
  notes?: string;
}

export class MembershipInvoiceGenerator {
  private doc: jsPDF;
  private readonly pageWidth = 210; // A4 width in mm
  private readonly pageHeight = 297; // A4 height in mm
  private readonly margin = 20;
  private readonly primaryColor = '#7c3aed'; // Purple
  private readonly secondaryColor = '#64748b'; // Gray

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  }

  /**
   * Generate membership renewal invoice
   */
  async generate(data: MembershipInvoiceData, letterheadImageUrl?: string): Promise<void> {
    let yPosition = this.margin;

    // Add letterhead if provided
    if (letterheadImageUrl) {
      yPosition = await this.addLetterhead(letterheadImageUrl, yPosition);
    } else {
      yPosition = this.addDefaultHeader(yPosition);
    }

    // Add invoice title
    yPosition = this.addInvoiceTitle(yPosition);

    // Add invoice details
    yPosition = this.addInvoiceDetails(data, yPosition);

    // Add member details
    yPosition = this.addMemberDetails(data, yPosition);

    // Add invoice items table
    yPosition = this.addInvoiceTable(data, yPosition);

    // Add payment instructions
    yPosition = this.addPaymentInstructions(yPosition);

    // Add footer
    this.addFooter();
  }

  /**
   * Add letterhead image
   */
  private async addLetterhead(imageUrl: string, yPosition: number): Promise<number> {
    try {
      const img = await this.loadImage(imageUrl);
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = 40; // Fixed height for letterhead
      
      this.doc.addImage(img, 'PNG', this.margin, yPosition, imgWidth, imgHeight);
      return yPosition + imgHeight + 10;
    } catch (error) {
      console.error('Failed to load letterhead:', error);
      return this.addDefaultHeader(yPosition);
    }
  }

  /**
   * Add default header (if no letterhead)
   */
  private addDefaultHeader(yPosition: number): number {
    this.doc.setFontSize(22);
    this.doc.setTextColor(this.primaryColor);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ACCOUNTANCY PRACTITIONERS FORUM', this.pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    this.doc.setFontSize(10);
    this.doc.setTextColor(this.secondaryColor);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('P. O. Box 190657, GPO Kampala-Uganda', this.pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 5;
    this.doc.text('Tel: 256 767 618 767', this.pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 5;
    this.doc.text('Email: practitionersug@gmail.com', this.pageWidth / 2, yPosition, { align: 'center' });
    
    return yPosition + 15;
  }

  /**
   * Add invoice title
   */
  private addInvoiceTitle(yPosition: number): number {
    this.doc.setFontSize(20);
    this.doc.setTextColor(this.primaryColor);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('MEMBERSHIP RENEWAL INVOICE', this.pageWidth / 2, yPosition, { align: 'center' });
    
    return yPosition + 15;
  }

  /**
   * Add invoice details (number, date, due date)
   */
  private addInvoiceDetails(data: MembershipInvoiceData, yPosition: number): number {
    const leftCol = this.margin;
    const rightCol = this.pageWidth - this.margin - 60;

    this.doc.setFontSize(10);
    this.doc.setTextColor('#000000');
    this.doc.setFont('helvetica', 'bold');
    
    // Left column
    this.doc.text('Invoice Number:', leftCol, yPosition);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(data.invoiceNumber, leftCol + 35, yPosition);
    
    // Right column
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Invoice Date:', rightCol, yPosition);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(data.invoiceDate, rightCol + 25, yPosition);
    
    yPosition += 6;
    
    // Due date
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Due Date:', rightCol, yPosition);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(data.dueDate, rightCol + 25, yPosition);
    
    return yPosition + 12;
  }

  /**
   * Add member details
   */
  private addMemberDetails(data: MembershipInvoiceData, yPosition: number): number {
    const leftCol = this.margin;

    // Draw box around member details
    this.doc.setDrawColor(this.secondaryColor);
    this.doc.setFillColor(245, 247, 250);
    this.doc.roundedRect(leftCol, yPosition, this.pageWidth - 2 * this.margin, 25, 2, 2, 'FD');

    yPosition += 6;

    this.doc.setFontSize(10);
    this.doc.setTextColor('#000000');
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('BILL TO:', leftCol + 5, yPosition);
    
    yPosition += 6;
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(data.memberName, leftCol + 5, yPosition);
    
    yPosition += 5;
    this.doc.text(data.memberEmail, leftCol + 5, yPosition);
    
    if (data.membershipNumber) {
      yPosition += 5;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Membership No: ', leftCol + 5, yPosition);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(data.membershipNumber, leftCol + 35, yPosition);
    }
    
    return yPosition + 12;
  }

  /**
   * Add invoice items table
   */
  private addInvoiceTable(data: MembershipInvoiceData, yPosition: number): number {
    const leftCol = this.margin;
    const tableWidth = this.pageWidth - 2 * this.margin;
    const currency = data.currency || 'UGX';

    // Table header
    this.doc.setFillColor(this.primaryColor);
    this.doc.rect(leftCol, yPosition, tableWidth, 10, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Description', leftCol + 3, yPosition + 6);
    this.doc.text('Amount', this.pageWidth - this.margin - 30, yPosition + 6, { align: 'right' });
    
    yPosition += 10;

    // Table rows
    this.doc.setTextColor('#000000');
    this.doc.setFont('helvetica', 'normal');
    
    // Membership renewal row
    this.doc.setDrawColor(220, 220, 220);
    this.doc.line(leftCol, yPosition, this.pageWidth - this.margin, yPosition);
    yPosition += 6;
    
    const description = `${data.membershipType} Membership Renewal (${data.renewalPeriod})`;
    this.doc.text(description, leftCol + 3, yPosition);
    this.doc.text(this.formatCurrency(data.amount, currency), this.pageWidth - this.margin - 3, yPosition, { align: 'right' });
    
    yPosition += 6;
    this.doc.line(leftCol, yPosition, this.pageWidth - this.margin, yPosition);

    // Previous balance if any
    if (data.previousBalance && data.previousBalance > 0) {
      yPosition += 6;
      this.doc.text('Previous Balance', leftCol + 3, yPosition);
      this.doc.text(this.formatCurrency(data.previousBalance, currency), this.pageWidth - this.margin - 3, yPosition, { align: 'right' });
      yPosition += 6;
      this.doc.line(leftCol, yPosition, this.pageWidth - this.margin, yPosition);
    }

    // Discount if any
    if (data.discount && data.discount > 0) {
      yPosition += 6;
      this.doc.setTextColor(0, 150, 0);
      this.doc.text('Discount', leftCol + 3, yPosition);
      this.doc.text(`-${this.formatCurrency(data.discount, currency)}`, this.pageWidth - this.margin - 3, yPosition, { align: 'right' });
      this.doc.setTextColor('#000000');
      yPosition += 6;
      this.doc.line(leftCol, yPosition, this.pageWidth - this.margin, yPosition);
    }

    // Total
    yPosition += 8;
    const total = data.amount + (data.previousBalance || 0) - (data.discount || 0);
    
    this.doc.setFillColor(245, 247, 250);
    this.doc.rect(leftCol, yPosition - 4, tableWidth, 10, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TOTAL AMOUNT DUE:', leftCol + 3, yPosition + 3);
    this.doc.setTextColor(this.primaryColor);
    this.doc.text(this.formatCurrency(total, currency), this.pageWidth - this.margin - 3, yPosition + 3, { align: 'right' });
    
    this.doc.setTextColor('#000000');
    
    return yPosition + 15;
  }

  /**
   * Add payment instructions
   */
  private addPaymentInstructions(yPosition: number): number {
    const leftCol = this.margin;

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PAYMENT INSTRUCTIONS:', leftCol, yPosition);
    
    yPosition += 7;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const instructions = [
      'Please make payment via:',
      '• Mobile Money (MTN or Airtel)',
      '• Bank Transfer',
      '• Online Payment Portal',
      '',
      'For mobile money payments, use the payment option in your member portal.',
      'Payment reference: Use your invoice number as reference.',
      '',
      'Note: Membership year runs from 1st April to 31st March.',
    ];

    instructions.forEach(line => {
      this.doc.text(line, leftCol, yPosition);
      yPosition += 5;
    });

    return yPosition + 5;
  }

  /**
   * Add footer
   */
  private addFooter(): void {
    const footerY = this.pageHeight - 20;
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(this.secondaryColor);
    this.doc.setFont('helvetica', 'italic');
    
    this.doc.text('Thank you for your continued membership with Accountancy Practitioners Forum', this.pageWidth / 2, footerY, { align: 'center' });
    this.doc.text('For inquiries, contact: practitionersug@gmail.com | Tel: 256 767 618 767', this.pageWidth / 2, footerY + 5, { align: 'center' });
    
    // Page number
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Page 1 of 1`, this.pageWidth - this.margin, footerY + 10, { align: 'right' });
  }

  /**
   * Format currency
   */
  private formatCurrency(amount: number, currency: string): string {
    if (currency === 'UGX') {
      return `UGX ${amount.toLocaleString('en-UG')}`;
    }
    return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Load image from URL
   */
  private loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Save the PDF
   */
  save(filename: string): void {
    this.doc.save(filename);
  }

  /**
   * Get PDF as blob
   */
  getBlob(): Blob {
    return this.doc.output('blob');
  }

  /**
   * Get PDF as data URL
   */
  getDataUrl(): string {
    return this.doc.output('dataurlstring');
  }
}

/**
 * Helper function to generate membership renewal invoice
 */
export async function generateMembershipRenewalInvoice(
  data: MembershipInvoiceData,
  letterheadImageUrl?: string
): Promise<Blob> {
  const generator = new MembershipInvoiceGenerator();
  await generator.generate(data, letterheadImageUrl);
  return generator.getBlob();
}

/**
 * Helper function to download membership renewal invoice
 */
export async function downloadMembershipRenewalInvoice(
  data: MembershipInvoiceData,
  letterheadImageUrl?: string,
  filename?: string
): Promise<void> {
  const generator = new MembershipInvoiceGenerator();
  await generator.generate(data, letterheadImageUrl);
  
  const invoiceFilename = filename || `APF_Membership_Invoice_${data.invoiceNumber}.pdf`;
  generator.save(invoiceFilename);
}
