import React from 'react';
import { Layout, Typography, Avatar, Space } from 'antd';
import { UserOutlined, BellOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
        餐厅管理系统
      </Title>
      <Space size="large">
        <BellOutlined style={{ fontSize: '18px' }} />
        <Avatar icon={<UserOutlined />} />
      </Space>
    </AntHeader>
  );
};

export default Header;