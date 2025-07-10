using Microsoft.EntityFrameworkCore;
using DeliveryService.Data;
using DeliveryService.Models;

namespace DeliveryService.Services
{
    public class DeliveryService : IDeliveryService
    {
        private readonly DeliveryDbContext _context;

        public DeliveryService(DeliveryDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Delivery>> GetAllDeliveriesAsync()
        {
            return await _context.Deliveries
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task<Delivery?> GetDeliveryByIdAsync(int id)
        {
            return await _context.Deliveries
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Delivery> CreateDeliveryAsync(Delivery delivery)
        {
            delivery.CreatedAt = DateTime.UtcNow;
            delivery.UpdatedAt = DateTime.UtcNow;
            _context.Deliveries.Add(delivery);
            await _context.SaveChangesAsync();
            return delivery;
        }

        public async Task<Delivery?> UpdateDeliveryStatusAsync(int id, string status)
        {
            var delivery = await _context.Deliveries.FindAsync(id);
            if (delivery == null)
            {
                return null;
            }

            delivery.Status = status;
            delivery.UpdatedAt = DateTime.UtcNow;
            
            // Set timestamps based on status
            switch (status.ToUpper())
            {
                case "PICKED_UP":
                    delivery.PickupTime = DateTime.UtcNow;
                    break;
                case "DELIVERED":
                    delivery.DeliveryTime = DateTime.UtcNow;
                    break;
            }

            await _context.SaveChangesAsync();
            return delivery;
        }

        public async Task<Delivery?> AssignDriverAsync(int id, int driverId)
        {
            var delivery = await _context.Deliveries.FindAsync(id);
            if (delivery == null)
            {
                return null;
            }

            delivery.DriverId = driverId;
            delivery.Status = "ASSIGNED";
            delivery.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return delivery;
        }

        public async Task<IEnumerable<Delivery>> GetDeliveriesByDriverAsync(int driverId)
        {
            return await _context.Deliveries
                .Where(d => d.DriverId == driverId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Delivery>> GetDeliveriesByStatusAsync(string status)
        {
            return await _context.Deliveries
                .Where(d => d.Status == status)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Driver>> GetAvailableDriversAsync()
        {
            return await _context.Drivers
                .Where(d => d.IsActive && d.Status == "AVAILABLE")
                .ToListAsync();
        }
    }
}