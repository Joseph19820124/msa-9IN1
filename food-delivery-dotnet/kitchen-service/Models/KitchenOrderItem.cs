using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KitchenService.Models
{
    public class KitchenOrderItem
    {
        public int Id { get; set; }
        
        [Required]
        public int MenuItemId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string MenuItemName { get; set; } = string.Empty;
        
        [Required]
        public int Quantity { get; set; }
        
        [StringLength(200)]
        public string SpecialInstructions { get; set; } = string.Empty;
        
        [Required]
        public int KitchenOrderId { get; set; }
        
        public virtual KitchenOrder KitchenOrder { get; set; } = null!;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}