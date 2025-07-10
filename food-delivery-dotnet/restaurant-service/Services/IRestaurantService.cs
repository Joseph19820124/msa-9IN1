using RestaurantService.Models;

namespace RestaurantService.Services
{
    public interface IRestaurantService
    {
        Task<IEnumerable<Restaurant>> GetAllRestaurantsAsync();
        Task<Restaurant?> GetRestaurantByIdAsync(int id);
        Task<Restaurant> CreateRestaurantAsync(Restaurant restaurant);
        Task<Restaurant> UpdateRestaurantAsync(Restaurant restaurant);
        Task DeleteRestaurantAsync(int id);
        Task<IEnumerable<MenuItem>> GetRestaurantMenuAsync(int restaurantId);
        Task<MenuItem> AddMenuItemAsync(MenuItem menuItem);
        Task<MenuItem> UpdateMenuItemAsync(MenuItem menuItem);
        Task DeleteMenuItemAsync(int menuItemId);
    }
}