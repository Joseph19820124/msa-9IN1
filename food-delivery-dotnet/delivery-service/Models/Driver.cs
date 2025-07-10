using System.ComponentModel.DataAnnotations;

namespace DeliveryService.Models
{
    public class Driver
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string VehicleType { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string LicensePlate { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string Status { get; set; } = "AVAILABLE";
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}