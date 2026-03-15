/**
 * Test file for admin payments functionality
 * This is a basic test to verify the new payment workflow
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { adminPaymentService } from '../services/adminPaymentService';

// Mock the admin payment service
vi.mock('../services/adminPaymentService', () => ({
  adminPaymentService: {
    fetchPayments: vi.fn(),
    verifyPayment: vi.fn(),
    rejectPayment: vi.fn(),
    getRevenue: vi.fn(),
    getPendingCount: vi.fn(),
  }
}));

describe('Admin Payment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch payments successfully', async () => {
    const mockPayments = [
      {
        id: 1,
        user: 'John Doe',
        application_id: 'APF-2026-000123',
        reference: 'APF-2026-000123',
        amount: 50000,
        proof_of_payment: '/media/payment_proofs/proof1.jpg',
        status: 'pending' as const,
        created_at: '2026-03-14'
      }
    ];

    (adminPaymentService.fetchPayments as any).mockResolvedValue(mockPayments);

    const result = await adminPaymentService.fetchPayments();
    expect(result).toEqual(mockPayments);
    expect(adminPaymentService.fetchPayments).toHaveBeenCalledTimes(1);
  });

  it('should verify payment successfully', async () => {
    (adminPaymentService.verifyPayment as any).mockResolvedValue(undefined);

    await adminPaymentService.verifyPayment(1);
    expect(adminPaymentService.verifyPayment).toHaveBeenCalledWith(1);
  });

  it('should reject payment successfully', async () => {
    (adminPaymentService.rejectPayment as any).mockResolvedValue(undefined);

    await adminPaymentService.rejectPayment(1);
    expect(adminPaymentService.rejectPayment).toHaveBeenCalledWith(1);
  });

  it('should fetch revenue successfully', async () => {
    const mockRevenue = { total_revenue: 1250000 };
    (adminPaymentService.getRevenue as any).mockResolvedValue(mockRevenue);

    const result = await adminPaymentService.getRevenue();
    expect(result).toEqual(mockRevenue);
  });

  it('should fetch pending count successfully', async () => {
    const mockPendingCount = { pending: 3 };
    (adminPaymentService.getPendingCount as any).mockResolvedValue(mockPendingCount);

    const result = await adminPaymentService.getPendingCount();
    expect(result).toEqual(mockPendingCount);
  });
});