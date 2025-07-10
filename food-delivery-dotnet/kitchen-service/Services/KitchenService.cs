using Microsoft.EntityFrameworkCore;
using KitchenService.Data;
using KitchenService.Models;

namespace KitchenService.Services
{
    public class KitchenService : IKitchenService
    {
        private readonly KitchenDbContext _context;

        public KitchenService(KitchenDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<KitchenOrder>> GetAllOrdersAsync()
        {
            return await _context.KitchenOrders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<KitchenOrder?> GetOrderByIdAsync(int id)
        {
            return await _context.KitchenOrders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<KitchenOrder> CreateOrderAsync(KitchenOrder order)
        {
            order.CreatedAt = DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;
            _context.KitchenOrders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<KitchenOrder?> UpdateOrderStatusAsync(int id, string status)
        {
            var order = await _context.KitchenOrders.FindAsync(id);
            if (order == null)
            {
                return null;
            }

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            
            // Set timestamps based on status
            switch (status.ToUpper())
            {
                case "PREPARING":
                    order.PrepStartTime = DateTime.UtcNow;
                    break;
                case "READY":
                    order.ReadyTime = DateTime.UtcNow;
                    break;
            }

            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<IEnumerable<KitchenOrder>> GetOrdersByStatusAsync(string status)
        {
            return await _context.KitchenOrders
                .Include(o => o.Items)
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<KitchenOrder>> GetOrdersByRestaurantAsync(int restaurantId)
        {
            return await _context.KitchenOrders
                .Include(o => o.Items)
                .Where(o => o.RestaurantId == restaurantId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
    }
}