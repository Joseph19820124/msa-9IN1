import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  CookOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表板</Link>
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/orders">订单管理</Link>
    },
    {
      key: '/menu',
      icon: <MenuOutlined />,
      label: <Link to="/menu">菜单管理</Link>
    },
    {
      key: '/kitchen',
      icon: <CookOutlined />,
      label: <Link to="/kitchen">厨房管理</Link>
    }
  ];

  return (
    <Sider theme="dark" width={200}>
      <div style={{ 
        height: '64px', 
        background: '#001529',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        🍽️ 餐厅
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;