import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  BookOutlined,
  ExceptionOutlined,
  RobotOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { key: '/student', icon: <HomeOutlined />, label: <Link to="/student">自习室</Link> },
    { key: '/student/search', icon: <SearchOutlined />, label: <Link to="/student/search">搜索座位</Link> },
    { key: '/student/reservations', icon: <BookOutlined />, label: <Link to="/student/reservations">我的预约</Link> },
    { key: '/student/violations', icon: <ExceptionOutlined />, label: <Link to="/student/violations">违约记录</Link> },
    { key: '/student/assistant', icon: <RobotOutlined />, label: <Link to="/student/assistant">智能助手</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        background: '#001529',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Space>
          <Text strong style={{ color: '#fff', fontSize: 18 }}>🎯 SeatFlow</Text>
          <Text style={{ color: 'rgba(255,255,255,0.65)', marginLeft: 8 }}>学生端</Text>
        </Space>
        <Space>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            {user?.realName || user?.username}
          </Text>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            style={{ color: 'rgba(255,255,255,0.65)' }}
            onClick={logout}
          >
            退出
          </Button>
        </Space>
      </Header>

      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['/student']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>

        <Content style={{ padding: 24, background: '#f5f5f5', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;
