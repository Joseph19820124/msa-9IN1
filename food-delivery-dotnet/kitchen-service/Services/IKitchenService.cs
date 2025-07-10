using KitchenService.Models;

namespace KitchenService.Services
{
    public interface IKitchenService
    {
        Task<IEnumerable<KitchenOrder>> GetAllOrdersAsync();
        Task<KitchenOrder?> GetOrderByIdAsync(int id);
        Task<KitchenOrder> CreateOrderAsync(KitchenOrder order);
        Task<KitchenOrder?> UpdateOrderStatusAsync(int id, string status);
        Task<IEnumerable<KitchenOrder>> GetOrdersByStatusAsync(string status);
        Task<IEnumerable<KitchenOrder>> GetOrdersByRestaurantAsync(int restaurantId);
    }
}