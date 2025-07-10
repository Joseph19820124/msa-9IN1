using Microsoft.AspNetCore.Mvc;
using AccountingService.Models;
using AccountingService.Services;

namespace AccountingService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountingController : ControllerBase
    {
        private readonly IAccountingService _accountingService;

        public AccountingController(IAccountingService accountingService)
        {
            _accountingService = accountingService;
        }

        [HttpGet("payments")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAllPayments()
        {
            var payments = await _accountingService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("payments/{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _accountingService.GetPaymentByIdAsync(id);
            if (payment == null)
            {
                return NotFound();
            }
            return Ok(payment);
        }

        [HttpPost("payments")]
        public async Task<ActionResult<Payment>> CreatePayment(Payment payment)
        {
            var createdPayment = await _accountingService.CreatePaymentAsync(payment);
            return CreatedAtAction(nameof(GetPayment), new { id = createdPayment.Id }, createdPayment);
        }

        [HttpPut("payments/{id}/status")]
        public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] string status)
        {
            var payment = await _accountingService.UpdatePaymentStatusAsync(id, status);
            if (payment == null)
            {
                return NotFound();
            }
            return Ok(payment);
        }

        [HttpGet("revenue")]
        public async Task<ActionResult<RevenueReport>> GetRevenueReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _accountingService.GetRevenueReportAsync(startDate, endDate);
            return Ok(report);
        }

        [HttpGet("transactions")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetAllTransactions()
        {
            var transactions = await _accountingService.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        [HttpPost("transactions")]
        public async Task<ActionResult<Transaction>> CreateTransaction(Transaction transaction)
        {
            var createdTransaction = await _accountingService.CreateTransactionAsync(transaction);
            return CreatedAtAction(nameof(GetAllTransactions), new { id = createdTransaction.Id }, createdTransaction);
        }

        [HttpGet("refunds")]
        public async Task<ActionResult<IEnumerable<Refund>>> GetAllRefunds()
        {
            var refunds = await _accountingService.GetAllRefundsAsync();
            return Ok(refunds);
        }

        [HttpPost("refunds")]
        public async Task<ActionResult<Refund>> CreateRefund(Refund refund)
        {
            var createdRefund = await _accountingService.CreateRefundAsync(refund);
            return CreatedAtAction(nameof(GetAllRefunds), new { id = createdRefund.Id }, createdRefund);
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy" });
        }
    }
}