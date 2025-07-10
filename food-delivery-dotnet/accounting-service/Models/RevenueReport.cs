using System.ComponentModel.DataAnnotations.Schema;

namespace AccountingService.Models
{
    public class RevenueReport
    {
        public DateTime StartDate { get; set; }
        
        public DateTime EndDate { get; set; }
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalRevenue { get; set; }
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalCommission { get; set; }
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalRefunds { get; set; }
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal NetRevenue { get; set; }
        
        public int TotalOrders { get; set; }
        
        public int TotalPayments { get; set; }
        
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}