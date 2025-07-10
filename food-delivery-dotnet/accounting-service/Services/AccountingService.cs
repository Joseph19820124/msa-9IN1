using Microsoft.EntityFrameworkCore;
using AccountingService.Data;
using AccountingService.Models;

namespace AccountingService.Services
{
    public class AccountingService : IAccountingService
    {
        private readonly AccountingDbContext _context;

        public AccountingService(AccountingDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
        {
            return await _context.Payments
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Payment?> GetPaymentByIdAsync(int id)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Payment> CreatePaymentAsync(Payment payment)
        {
            payment.CreatedAt = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<Payment?> UpdatePaymentStatusAsync(int id, string status)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return null;
            }

            payment.Status = status;
            payment.UpdatedAt = DateTime.UtcNow;
            
            if (status == "COMPLETED")
            {
                payment.ProcessedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync()
        {
            return await _context.Transactions
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Transaction> CreateTransactionAsync(Transaction transaction)
        {
            transaction.CreatedAt = DateTime.UtcNow;
            transaction.UpdatedAt = DateTime.UtcNow;
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<IEnumerable<Refund>> GetAllRefundsAsync()
        {
            return await _context.Refunds
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Refund> CreateRefundAsync(Refund refund)
        {
            refund.CreatedAt = DateTime.UtcNow;
            refund.UpdatedAt = DateTime.UtcNow;
            _context.Refunds.Add(refund);
            await _context.SaveChangesAsync();
            return refund;
        }

        public async Task<RevenueReport> GetRevenueReportAsync(DateTime startDate, DateTime endDate)
        {
            var payments = await _context.Payments
                .Where(p => p.CreatedAt >= startDate && p.CreatedAt <= endDate && p.Status == "COMPLETED")
                .ToListAsync();
            
            var refunds = await _context.Refunds
                .Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate && r.Status == "COMPLETED")
                .ToListAsync();
            
            var totalRevenue = payments.Sum(p => p.Amount);
            var totalRefunds = refunds.Sum(r => r.Amount);
            var totalCommission = totalRevenue * 0.05m; // 5% commission
            var netRevenue = totalRevenue - totalRefunds - totalCommission;
            
            return new RevenueReport
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalRevenue = totalRevenue,
                TotalCommission = totalCommission,
                TotalRefunds = totalRefunds,
                NetRevenue = netRevenue,
                TotalOrders = payments.Count,
                TotalPayments = payments.Count,
                GeneratedAt = DateTime.UtcNow
            };
        }
    }
}