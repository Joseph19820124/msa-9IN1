use consulrs::client::{ConsulClient, ConsulClientSettingsBuilder};
use consulrs::catalog;
use std::collections::HashMap;
use tokio::sync::RwLock;
use std::sync::Arc;

#[derive(Clone)]
pub struct ServiceDiscovery {
    client: ConsulClient,
    cache: Arc<RwLock<HashMap<String, Vec<String>>>>,
}

impl ServiceDiscovery {
    pub async fn new(consul_url: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let settings = ConsulClientSettingsBuilder::default()
            .address(consul_url)
            .build()?;
        
        let client = ConsulClient::new(settings)?;
        
        Ok(Self {
            client,
            cache: Arc::new(RwLock::new(HashMap::new())),
        })
    }
    
    pub async fn get_service_url(&self, service_name: &str) -> Result<String, Box<dyn std::error::Error>> {
        // Check cache first
        {
            let cache = self.cache.read().await;
            if let Some(urls) = cache.get(service_name) {
                if !urls.is_empty() {
                    return Ok(urls[0].clone());
                }
            }
        }
        
        // If not in cache, query Consul
        let services = catalog::services(&self.client, None).await?;
        
        if let Some(service_tags) = services.get(service_name) {
            let nodes = catalog::nodes(&self.client, Some(catalog::NodesOptions {
                service: Some(service_name.to_string()),
                ..Default::default()
            })).await?;
            
            if !nodes.is_empty() {
                let url = format!("http://{}:8080", nodes[0].address);
                
                // Update cache
                let mut cache = self.cache.write().await;
                cache.insert(service_name.to_string(), vec![url.clone()]);
                
                return Ok(url);
            }
        }
        
        // Fallback to Docker service names
        Ok(format!("http://{}:8080", service_name))
    }
}