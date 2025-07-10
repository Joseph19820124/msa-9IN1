using AccountingService.Models;

namespace AccountingService.Services
{
    public interface IAccountingService
    {
        Task<IEnumerable<Payment>> GetAllPaymentsAsync();
        Task<Payment?> GetPaymentByIdAsync(int id);
        Task<Payment> CreatePaymentAsync(Payment payment);
        Task<Payment?> UpdatePaymentStatusAsync(int id, string status);
        Task<IEnumerable<Transaction>> GetAllTransactionsAsync();
        Task<Transaction> CreateTransactionAsync(Transaction transaction);
        Task<IEnumerable<Refund>> GetAllRefundsAsync();
        Task<Refund> CreateRefundAsync(Refund refund);
        Task<RevenueReport> GetRevenueReportAsync(DateTime startDate, DateTime endDate);
    }
}