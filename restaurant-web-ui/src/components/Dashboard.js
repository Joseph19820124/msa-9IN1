import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Tag } from 'antd';
import { 
  ShoppingCartOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import { getOrders } from '../services/api';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersData = await getOrders();
      setOrders(ordersData.slice(0, 5)); // 显示最新5个订单
      
      // 计算统计数据
      const totalOrders = ordersData.length;
      const revenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = ordersData.filter(order => order.status === 'PENDING').length;
      const completedOrders = ordersData.filter(order => order.status === 'DELIVERED').length;
      
      setStats({ totalOrders, revenue, pendingOrders, completedOrders });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'orange',
      'CONFIRMED': 'blue',
      'PREPARING': 'cyan',
      'READY_FOR_PICKUP': 'purple',
      'OUT_FOR_DELIVERY': 'gold',
      'DELIVERED': 'green',
      'CANCELLED': 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'PENDING': '待处理',
      'CONFIRMED': '已确认',
      'PREPARING': '制作中',
      'READY_FOR_PICKUP': '待取餐',
      'OUT_FOR_DELIVERY': '配送中',
      'DELIVERED': '已送达',
      'CANCELLED': '已取消'
    };
    return texts[status] || status;
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日营收"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理订单"
              value={stats.pendingOrders}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成订单"
              value={stats.completedOrders}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Card title="最新订单" style={{ marginTop: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={orders}
          renderItem={order => (
            <List.Item>
              <List.Item.Meta
                title={`订单 #${order.id}`}
                description={`客户: ${order.customerId} | 金额: ￥${order.totalAmount}`}
              />
              <Tag color={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Dashboard;