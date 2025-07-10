require 'sinatra'
require 'sinatra/json'
require 'redis'

# Configuration
set :port, ENV['PORT'] || 3006
set :bind, '0.0.0.0'

# Redis connection
redis_url = ENV['REDIS_URL'] || 'redis://localhost:6379'
redis = Redis.new(url: redis_url)

# Health check
get '/health' do
  begin
    redis.ping
    json({ status: 'healthy', service: 'notification-service', redis: 'connected' })
  rescue => e
    status 503
    json({ status: 'unhealthy', service: 'notification-service', error: e.message })
  end
end

# Send notification
post '/notifications' do
  request.body.rewind
  data = JSON.parse(request.body.read)
  
  notification = {
    id: SecureRandom.uuid,
    type: data['type'],
    message: generate_message(data['type'], data['data']),
    timestamp: Time.now.iso8601,
    data: data['data']
  }
  
  begin
    # Store notification in Redis
    redis.lpush('notifications', notification.to_json)
    redis.expire('notifications', 86400) # 24 hours
    
    # Log notification
    puts "Notification sent: #{notification[:type]} - #{notification[:message]}"
    
    status 201
    json(notification)
  rescue => e
    status 500
    json({ error: "Failed to send notification: #{e.message}" })
  end
end

# Get recent notifications
get '/notifications' do
  begin
    notifications = redis.lrange('notifications', 0, 49) # Last 50 notifications
    parsed_notifications = notifications.map { |n| JSON.parse(n) }
    json(parsed_notifications)
  rescue => e
    status 500
    json({ error: e.message })
  end
end

def generate_message(type, data)
  case type
  when 'order_created'
    "New order ##{data['id']} created for customer #{data['customer_id']}"
  when 'order_updated'
    "Order ##{data['id']} status updated to #{data['status']}"
  when 'order_ready'
    "Order ##{data['id']} is ready for pickup"
  when 'order_delivered'
    "Order ##{data['id']} has been delivered"
  when 'payment_processed'
    "Payment of $#{data['amount']} processed for order ##{data['order_id']}"
  else
    "Notification: #{type}"
  end
end