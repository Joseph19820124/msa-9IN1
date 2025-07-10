import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      // 模拟菜单数据
      const mockData = [
        {
          id: 1,
          name: '麻辣香锅',
          description: '麻辣鲜香，传统川味',
          price: 68.00,
          category: '主食',
          available: true,
          image: 'https://via.placeholder.com/150'
        },
        {
          id: 2,
          name: '宫保鸡丁',
          description: '鲜嫩鸡丁配花生米',
          price: 32.00,
          category: '主食',
          available: true,
          image: 'https://via.placeholder.com/150'
        },
        {
          id: 3,
          name: '西湖龙井',
          description: '清香淡雅，回味甘美',
          price: 25.00,
          category: '饮品',
          available: true,
          image: 'https://via.placeholder.com/150'
        }
      ];
      setMenuItems(mockData);
    } catch (error) {
      message.error('获取菜单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个菜品吗？',
      onOk: () => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        // 编辑
        setMenuItems(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...values } : item
        ));
        message.success('更新成功');
      } else {
        // 新增
        const newItem = {
          id: Date.now(),
          ...values,
          available: true,
          image: 'https://via.placeholder.com/150'
        };
        setMenuItems(prev => [...prev, newItem]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: (url) => <Image width={50} src={url} />
    },
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `￥${price}`,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '状态',
      dataIndex: 'available',
      key: 'available',
      render: (available) => (
        <span style={{ color: available ? 'green' : 'red' }}>
          {available ? '可供应' : '已售罄'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>菜单管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加菜品
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={menuItems} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingItem ? '编辑菜品' : '添加菜品'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="菜品名称"
            rules={[{ required: true, message: '请输入菜品名称' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              addonBefore="￥"
            />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请输入分类' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? '更新' : '添加'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Menu;