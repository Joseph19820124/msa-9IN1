using Microsoft.AspNetCore.Mvc;
using DeliveryService.Models;
using DeliveryService.Services;

namespace DeliveryService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DeliveryController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;

        public DeliveryController(IDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Delivery>>> GetAllDeliveries()
        {
            var deliveries = await _deliveryService.GetAllDeliveriesAsync();
            return Ok(deliveries);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Delivery>> GetDelivery(int id)
        {
            var delivery = await _deliveryService.GetDeliveryByIdAsync(id);
            if (delivery == null)
            {
                return NotFound();
            }
            return Ok(delivery);
        }

        [HttpPost]
        public async Task<ActionResult<Delivery>> CreateDelivery(Delivery delivery)
        {
            var createdDelivery = await _deliveryService.CreateDeliveryAsync(delivery);
            return CreatedAtAction(nameof(GetDelivery), new { id = createdDelivery.Id }, createdDelivery);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateDeliveryStatus(int id, [FromBody] string status)
        {
            var delivery = await _deliveryService.UpdateDeliveryStatusAsync(id, status);
            if (delivery == null)
            {
                return NotFound();
            }
            return Ok(delivery);
        }

        [HttpPut("{id}/driver")]
        public async Task<IActionResult> AssignDriver(int id, [FromBody] int driverId)
        {
            var delivery = await _deliveryService.AssignDriverAsync(id, driverId);
            if (delivery == null)
            {
                return NotFound();
            }
            return Ok(delivery);
        }

        [HttpGet("driver/{driverId}")]
        public async Task<ActionResult<IEnumerable<Delivery>>> GetDeliveriesByDriver(int driverId)
        {
            var deliveries = await _deliveryService.GetDeliveriesByDriverAsync(driverId);
            return Ok(deliveries);
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<Delivery>>> GetPendingDeliveries()
        {
            var deliveries = await _deliveryService.GetDeliveriesByStatusAsync("PENDING");
            return Ok(deliveries);
        }

        [HttpGet("in-transit")]
        public async Task<ActionResult<IEnumerable<Delivery>>> GetInTransitDeliveries()
        {
            var deliveries = await _deliveryService.GetDeliveriesByStatusAsync("IN_TRANSIT");
            return Ok(deliveries);
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy" });
        }
    }
}