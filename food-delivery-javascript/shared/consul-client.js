const consul = require('consul');

class ConsulClient {
  constructor(host = 'localhost', port = 8500) {
    this.consul = consul({ host, port });
  }

  async registerService(service) {
    try {
      await this.consul.agent.service.register({
        id: service.id,
        name: service.name,
        address: service.address,
        port: service.port,
        check: {
          http: `http://${service.address}:${service.port}/health`,
          interval: '10s'
        }
      });
      console.log(`Service ${service.name} registered with Consul`);
    } catch (error) {
      console.error('Error registering service:', error);
    }
  }

  async deregisterService(serviceId) {
    try {
      await this.consul.agent.service.deregister(serviceId);
      console.log(`Service ${serviceId} deregistered from Consul`);
    } catch (error) {
      console.error('Error deregistering service:', error);
    }
  }

  async discoverService(serviceName) {
    try {
      const services = await this.consul.health.service(serviceName);
      return services.filter(service => service.Checks.every(check => check.Status === 'passing'));
    } catch (error) {
      console.error('Error discovering service:', error);
      return [];
    }
  }

  async getServiceEndpoint(serviceName) {
    const services = await this.discoverService(serviceName);
    if (services.length === 0) {
      throw new Error(`No healthy instances of ${serviceName} found`);
    }
    
    // Simple round-robin load balancing
    const service = services[Math.floor(Math.random() * services.length)];
    return `http://${service.Service.Address}:${service.Service.Port}`;
  }
}

module.exports = ConsulClient;