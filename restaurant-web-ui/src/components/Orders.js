import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, message } from 'antd';
import { getOrders, updateOrderStatus } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      message.error('获取订单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      message.success('订单状态更新成功');
      fetchOrders();
    } catch (error) {
      message.error('状态更新失败');
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

  const columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: amount => `￥${amount}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: time => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleStatusUpdate(record.id, 'CONFIRMED')}
            >
              确认订单
            </Button>
          )}
          {record.status === 'CONFIRMED' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleStatusUpdate(record.id, 'PREPARING')}
            >
              开始制作
            </Button>
          )}
          {record.status === 'PREPARING' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleStatusUpdate(record.id, 'READY_FOR_PICKUP')}
            >
              制作完成
            </Button>
          )}
          {(record.status === 'PENDING' || record.status === 'CONFIRMED') && (
            <Button 
              danger 
              size="small"
              onClick={() => handleStatusUpdate(record.id, 'CANCELLED')}
            >
              取消订单
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>订单管理</h2>
      <Table 
        columns={columns} 
        dataSource={orders} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Orders;