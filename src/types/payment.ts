/**
 * Payment and transaction type definitions
 */

export interface Transaction {
  date: string
  type: string
  reference: string
  amount: string
  method: string
  methodIcon: any
  status: string
  description: string
}

export interface Receipt {
  id: string
  title: string
  date: string
  amount: string
  type: 'invoice' | 'receipt'
  reference: string
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: any
  disabled: boolean
}
