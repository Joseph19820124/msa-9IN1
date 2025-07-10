import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Menu from './components/Menu';
import Kitchen from './components/Kitchen';

const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout className="site-layout">
            <Header />
            <Content style={{ margin: '16px' }}>
              <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/kitchen" element={<Kitchen />} />
                </Routes>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </div>
  );
}

export default App;