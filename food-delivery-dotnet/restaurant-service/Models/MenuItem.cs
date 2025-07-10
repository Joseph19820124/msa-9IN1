using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantService.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;
        
        public bool IsAvailable { get; set; } = true;
        
        public int RestaurantId { get; set; }
        
        public virtual Restaurant Restaurant { get; set; } = null!;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}