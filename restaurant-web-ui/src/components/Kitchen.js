import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, message, Space } from 'antd';
import { ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import { getOrders, updateOrderStatus } from '../services/api';

const Kitchen = () => {
  const [kitchenOrders, setKitchenOrders] = useState([]);

  useEffect(() => {
    fetchKitchenOrders();
    // 每30秒刷新一次
    const interval = setInterval(fetchKitchenOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const data = await getOrders();
      // 只显示需要厨房处理的订单
      const filteredOrders = data.filter(order => 
        ['CONFIRMED', 'PREPARING'].includes(order.status)
      );
      setKitchenOrders(filteredOrders);
    } catch (error) {
      message.error('获取厨房订单失败');
    }
  };

  const handleStartCooking = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'PREPARING');
      message.success('开始制作');
      fetchKitchenOrders();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'READY_FOR_PICKUP');
      message.success('订单完成');
      fetchKitchenOrders();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const getOrderPriority = (createdAt) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMinutes = (now - orderTime) / (1000 * 60);
    
    if (diffMinutes > 20) return 'high';
    if (diffMinutes > 10) return 'medium';
    return 'normal';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#ff4d4f',
      'medium': '#fa8c16',
      'normal': '#52c41a'
    };
    return colors[priority];
  };

  return (
    <div>
      <h2>厨房管理</h2>
      <Row gutter={[16, 16]}>
        {kitchenOrders.map(order => {
          const priority = getOrderPriority(order.createdAt);
          return (
            <Col span={8} key={order.id}>
              <Card
                title={
                  <Space>
                    <span>订单 #{order.id}</span>
                    <Tag color={getPriorityColor(priority)}>
                      {priority === 'high' ? '紧急' : 
                       priority === 'medium' ? '优先' : '正常'}
                    </Tag>
                  </Space>
                }
                extra={
                  <Tag color={order.status === 'PREPARING' ? 'blue' : 'orange'}>
                    {order.status === 'PREPARING' ? '制作中' : '待开始'}
                  </Tag>
                }
                style={{ 
                  borderLeft: `4px solid ${getPriorityColor(priority)}`,
                  height: '100%'
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <p><ClockCircleOutlined /> 下单时间: {new Date(order.createdAt).toLocaleTimeString()}</p>
                  <p>金额: ￥{order.totalAmount}</p>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <h4>订单内容:</h4>
                  {order.items && order.items.map((item, index) => (
                    <div key={index} style={{ marginBottom: 8 }}>
                      <span>{item.itemName} x {item.quantity}</span>
                      <Tag style={{ marginLeft: 8 }}>￥{item.price}</Tag>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                  {order.status === 'CONFIRMED' && (
                    <Button 
                      type="primary" 
                      icon={<FireOutlined />}
                      onClick={() => handleStartCooking(order.id)}
                      block
                    >
                      开始制作
                    </Button>
                  )}
                  {order.status === 'PREPARING' && (
                    <Button 
                      type="primary" 
                      onClick={() => handleCompleteOrder(order.id)}
                      block
                    >
                      制作完成
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      {kitchenOrders.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <h3>暂无待处理订单</h3>
        </div>
      )}
    </div>
  );
};

export default Kitchen;