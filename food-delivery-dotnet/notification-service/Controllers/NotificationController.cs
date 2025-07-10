using Microsoft.AspNetCore.Mvc;
using NotificationService.Models;
using NotificationService.Services;

namespace NotificationService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetAllNotifications()
        {
            var notifications = await _notificationService.GetAllNotificationsAsync();
            return Ok(notifications);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Notification>> GetNotification(int id)
        {
            var notification = await _notificationService.GetNotificationByIdAsync(id);
            if (notification == null)
            {
                return NotFound();
            }
            return Ok(notification);
        }

        [HttpPost]
        public async Task<ActionResult<Notification>> CreateNotification(Notification notification)
        {
            var createdNotification = await _notificationService.CreateNotificationAsync(notification);
            return CreatedAtAction(nameof(GetNotification), new { id = createdNotification.Id }, createdNotification);
        }

        [HttpPost("email")]
        public async Task<ActionResult<Notification>> SendEmailNotification(EmailNotificationRequest request)
        {
            var notification = await _notificationService.SendEmailNotificationAsync(
                request.UserId, 
                request.Subject, 
                request.Message, 
                request.Email
            );
            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, notification);
        }

        [HttpPost("sms")]
        public async Task<ActionResult<Notification>> SendSmsNotification(SmsNotificationRequest request)
        {
            var notification = await _notificationService.SendSmsNotificationAsync(
                request.UserId, 
                request.Message, 
                request.Phone
            );
            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, notification);
        }

        [HttpPost("push")]
        public async Task<ActionResult<Notification>> SendPushNotification(PushNotificationRequest request)
        {
            var notification = await _notificationService.SendPushNotificationAsync(
                request.UserId, 
                request.Title, 
                request.Message,
                request.DeviceToken
            );
            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, notification);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetUserNotifications(int userId)
        {
            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _notificationService.MarkAsReadAsync(id);
            if (notification == null)
            {
                return NotFound();
            }
            return Ok(notification);
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy" });
        }
    }

    public class EmailNotificationRequest
    {
        public int UserId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class SmsNotificationRequest
    {
        public int UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    public class PushNotificationRequest
    {
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string DeviceToken { get; set; } = string.Empty;
    }
}