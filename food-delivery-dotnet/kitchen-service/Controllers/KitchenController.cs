using Microsoft.AspNetCore.Mvc;
using KitchenService.Models;
using KitchenService.Services;

namespace KitchenService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KitchenController : ControllerBase
    {
        private readonly IKitchenService _kitchenService;

        public KitchenController(IKitchenService kitchenService)
        {
            _kitchenService = kitchenService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<KitchenOrder>>> GetAllOrders()
        {
            var orders = await _kitchenService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<KitchenOrder>> GetOrder(int id)
        {
            var order = await _kitchenService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<KitchenOrder>> CreateOrder(KitchenOrder order)
        {
            var createdOrder = await _kitchenService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _kitchenService.UpdateOrderStatusAsync(id, status);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<KitchenOrder>>> GetPendingOrders()
        {
            var orders = await _kitchenService.GetOrdersByStatusAsync("PENDING");
            return Ok(orders);
        }

        [HttpGet("preparing")]
        public async Task<ActionResult<IEnumerable<KitchenOrder>>> GetPreparingOrders()
        {
            var orders = await _kitchenService.GetOrdersByStatusAsync("PREPARING");
            return Ok(orders);
        }

        [HttpGet("ready")]
        public async Task<ActionResult<IEnumerable<KitchenOrder>>> GetReadyOrders()
        {
            var orders = await _kitchenService.GetOrdersByStatusAsync("READY");
            return Ok(orders);
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy" });
        }
    }
}