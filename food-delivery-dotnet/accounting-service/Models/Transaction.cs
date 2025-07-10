using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AccountingService.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // PAYMENT, REFUND, COMMISSION
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "PENDING";
        
        [Required]
        [StringLength(100)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string ReferenceId { get; set; } = string.Empty;
        
        public DateTime ProcessedAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}