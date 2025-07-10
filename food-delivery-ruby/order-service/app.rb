require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require 'httparty'
require './models/order'

# Configuration
set :port, ENV['PORT'] || 3001
set :bind, '0.0.0.0'
set :database_url, ENV['DATABASE_URL'] || 'postgresql://localhost/food_delivery_orders'

# Helper methods
def validate_order_data(data)
  required_fields = ['customer_id', 'restaurant_id', 'items', 'total_amount']
  missing_fields = required_fields.select { |field| data[field].nil? || data[field].empty? }
  
  unless missing_fields.empty?
    halt 400, json({ error: "Missing required fields: #{missing_fields.join(', ')}" })
  end
end

def notify_service(event, data)
  notification_url = ENV['NOTIFICATION_SERVICE_URL'] || 'http://notification-service:3006'
  
  begin
    HTTParty.post("#{notification_url}/notifications", {
      body: {
        type: event,
        data: data
      }.to_json,
      headers: { 'Content-Type' => 'application/json' },
      timeout: 5
    })
  rescue => e
    puts "Failed to send notification: #{e.message}"
  end
end

# Health check
get '/health' do
  json({ status: 'healthy', service: 'order-service' })
end

# Get all orders
get '/orders' do
  orders = Order.all
  json(orders.map(&:as_json))
end

# Get order by ID
get '/orders/:id' do
  order = Order.find_by(id: params[:id])
  
  if order
    json(order.as_json)
  else
    status 404
    json({ error: 'Order not found' })
  end
end

# Create new order
post '/orders' do
  request.body.rewind
  data = JSON.parse(request.body.read)
  
  validate_order_data(data)
  
  order = Order.new(
    customer_id: data['customer_id'],
    restaurant_id: data['restaurant_id'],
    items: data['items'].to_json,
    total_amount: data['total_amount'],
    status: 'pending'
  )
  
  if order.save
    # Notify other services
    notify_service('order_created', order.as_json)
    
    status 201
    json(order.as_json)
  else
    status 400
    json({ error: order.errors.full_messages })
  end
end

# Update order
put '/orders/:id' do
  order = Order.find_by(id: params[:id])
  
  unless order
    status 404
    json({ error: 'Order not found' })
    return
  end
  
  request.body.rewind
  data = JSON.parse(request.body.read)
  
  if order.update(data.select { |k, v| ['status', 'total_amount', 'items'].include?(k) })
    # Notify other services about status change
    if data['status']
      notify_service('order_updated', order.as_json)
    end
    
    json(order.as_json)
  else
    status 400
    json({ error: order.errors.full_messages })
  end
end

# Delete order
delete '/orders/:id' do
  order = Order.find_by(id: params[:id])
  
  unless order
    status 404
    json({ error: 'Order not found' })
    return
  end
  
  if order.destroy
    notify_service('order_deleted', { id: params[:id] })
    status 204
  else
    status 500
    json({ error: 'Failed to delete order' })
  end
end