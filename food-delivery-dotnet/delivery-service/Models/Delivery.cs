using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DeliveryService.Models
{
    public class Delivery
    {
        public int Id { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        
        [Required]
        public int CustomerId { get; set; }
        
        [Required]
        public int RestaurantId { get; set; }
        
        public int? DriverId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "PENDING";
        
        [Required]
        [StringLength(200)]
        public string PickupAddress { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string DeliveryAddress { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal DeliveryFee { get; set; }
        
        public DateTime? EstimatedDeliveryTime { get; set; }
        
        public DateTime? PickupTime { get; set; }
        
        public DateTime? DeliveryTime { get; set; }
        
        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}