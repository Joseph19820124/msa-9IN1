using DeliveryService.Models;

namespace DeliveryService.Services
{
    public interface IDeliveryService
    {
        Task<IEnumerable<Delivery>> GetAllDeliveriesAsync();
        Task<Delivery?> GetDeliveryByIdAsync(int id);
        Task<Delivery> CreateDeliveryAsync(Delivery delivery);
        Task<Delivery?> UpdateDeliveryStatusAsync(int id, string status);
        Task<Delivery?> AssignDriverAsync(int id, int driverId);
        Task<IEnumerable<Delivery>> GetDeliveriesByDriverAsync(int driverId);
        Task<IEnumerable<Delivery>> GetDeliveriesByStatusAsync(string status);
        Task<IEnumerable<Driver>> GetAvailableDriversAsync();
    }
}