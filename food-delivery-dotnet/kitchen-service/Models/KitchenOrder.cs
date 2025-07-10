using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KitchenService.Models
{
    public class KitchenOrder
    {
        public int Id { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        
        [Required]
        public int RestaurantId { get; set; }
        
        [Required]
        public int CustomerId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "PENDING";
        
        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;
        
        public DateTime OrderTime { get; set; }
        
        public DateTime? PrepStartTime { get; set; }
        
        public DateTime? ReadyTime { get; set; }
        
        public int EstimatedPrepTime { get; set; } // in minutes
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public virtual ICollection<KitchenOrderItem> Items { get; set; } = new List<KitchenOrderItem>();
    }
}