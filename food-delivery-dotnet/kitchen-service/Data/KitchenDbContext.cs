using Microsoft.EntityFrameworkCore;
using KitchenService.Models;

namespace KitchenService.Data
{
    public class KitchenDbContext : DbContext
    {
        public KitchenDbContext(DbContextOptions<KitchenDbContext> options) : base(options)
        {
        }

        public DbSet<KitchenOrder> KitchenOrders { get; set; }
        public DbSet<KitchenOrderItem> KitchenOrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure KitchenOrder entity
            modelBuilder.Entity<KitchenOrder>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Notes).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure KitchenOrderItem entity
            modelBuilder.Entity<KitchenOrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MenuItemName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.SpecialInstructions).HasMaxLength(200);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure foreign key relationship
                entity.HasOne(e => e.KitchenOrder)
                    .WithMany(o => o.Items)
                    .HasForeignKey(e => e.KitchenOrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}