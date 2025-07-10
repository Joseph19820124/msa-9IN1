require 'sinatra'
require 'sinatra/json'
require 'httparty'
require 'rack/cors'

# Configuration
set :port, ENV['PORT'] || 3000
set :bind, '0.0.0.0'

# CORS
use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :put, :delete, :options]
  end
end

# Service URLs
SERVICES = {
  order: ENV['ORDER_SERVICE_URL'] || 'http://order-service:3001',
  restaurant: ENV['RESTAURANT_SERVICE_URL'] || 'http://restaurant-service:3002',
  kitchen: ENV['KITCHEN_SERVICE_URL'] || 'http://kitchen-service:3003',
  delivery: ENV['DELIVERY_SERVICE_URL'] || 'http://delivery-service:3004',
  accounting: ENV['ACCOUNTING_SERVICE_URL'] || 'http://accounting-service:3005',
  notification: ENV['NOTIFICATION_SERVICE_URL'] || 'http://notification-service:3006'
}

# Helper method for service calls
def call_service(service, method, path, body = nil)
  url = "#{SERVICES[service]}#{path}"
  options = {
    headers: { 'Content-Type' => 'application/json' },
    timeout: 30
  }
  options[:body] = body.to_json if body

  begin
    response = case method
    when :get
      HTTParty.get(url, options)
    when :post
      HTTParty.post(url, options)
    when :put
      HTTParty.put(url, options)
    when :delete
      HTTParty.delete(url, options)
    end

    status response.code
    json response.parsed_response
  rescue => e
    status 503
    json({ error: "Service unavailable: #{e.message}" })
  end
end

# Health check
get '/health' do
  json({ status: 'healthy', service: 'api-gateway' })
end

# Order endpoints
get '/api/orders' do
  call_service(:order, :get, '/orders')
end

get '/api/orders/:id' do
  call_service(:order, :get, "/orders/#{params[:id]}")
end

post '/api/orders' do
  request.body.rewind
  body = JSON.parse(request.body.read)
  call_service(:order, :post, '/orders', body)
end

put '/api/orders/:id' do
  request.body.rewind
  body = JSON.parse(request.body.read)
  call_service(:order, :put, "/orders/#{params[:id]}", body)
end

# Restaurant endpoints
get '/api/restaurants' do
  call_service(:restaurant, :get, '/restaurants')
end

get '/api/restaurants/:id' do
  call_service(:restaurant, :get, "/restaurants/#{params[:id]}")
end

post '/api/restaurants' do
  request.body.rewind
  body = JSON.parse(request.body.read)
  call_service(:restaurant, :post, '/restaurants', body)
end

# Menu endpoints
get '/api/restaurants/:id/menu' do
  call_service(:restaurant, :get, "/restaurants/#{params[:id]}/menu")
end

post '/api/restaurants/:id/menu' do
  request.body.rewind
  body = JSON.parse(request.body.read)
  call_service(:restaurant, :post, "/restaurants/#{params[:id]}/menu", body)
end

# Kitchen endpoints
get '/api/kitchen/orders' do
  call_service(:kitchen, :get, '/kitchen/orders')
end

put '/api/kitchen/orders/:id' do
  request.body.rewind
  body = JSON.parse(request.body.read)
  call_service(:kitchen, :put, "/kitchen/orders/#{params[:id]}", body)
end

# Delivery endpoints
get '/api/deliveries' do
  call_service(:delivery, :get, '/deliveries')
end

get '/api/deliveries/:id' do
  call_service(:delivery, :get, "/deliveries/#{params[:id]}")
end

put '/api/deliveries/:id' do
  request.body.rewind
  body = JSON.parse(request.body.read)
  call_service(:delivery, :put, "/deliveries/#{params[:id]}", body)
end

# Accounting endpoints
get '/api/payments' do
  call_service(:accounting, :get, '/payments')
end

get '/api/payments/:id' do
  call_service(:accounting, :get, "/payments/#{params[:id]}")
end

post '/api/payments' do
  request.body.rewind
  body = JSON.parse(request.body.read)
  call_service(:accounting, :post, '/payments', body)
end

# Notification endpoints
post '/api/notifications' do
  request.body.rewind
  body = JSON.parse(request.body.read)
  call_service(:notification, :post, '/notifications', body)
end