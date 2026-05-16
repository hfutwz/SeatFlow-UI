import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  TableOutlined,
  BookOutlined,
  WarningOutlined,
  UserOutlined,
  SafetyOutlined,
  SettingOutlined,
  QrcodeOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  // 根据权限动态生成菜单
  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">仪表盘</Link>,
    },
    {
      key: '/admin/rooms',
      icon: <HomeOutlined />,
      label: <Link to="/admin/rooms">自习室管理</Link>,
      show: hasPermission('room:manage'),
    },
    {
      key: '/admin/seats',
      icon: <TableOutlined />,
      label: <Link to="/admin/seats">座位管理</Link>,
      show: hasPermission('seat:manage'),
    },
    {
      key: '/admin/reservations',
      icon: <BookOutlined />,
      label: <Link to="/admin/reservations">预约管理</Link>,
      show: hasPermission('reservation:view') || hasPermission('reservation:manage'),
    },
    {
      key: '/admin/violations',
      icon: <WarningOutlined />,
      label: <Link to="/admin/violations">违约管理</Link>,
      show: hasPermission('violation:view'),
    },
    {
      key: '/admin/checkin-codes',
      icon: <QrcodeOutlined />,
      label: <Link to="/admin/checkin-codes">签到编码</Link>,
      show: hasPermission('room:manage'),
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">用户管理</Link>,
      show: hasPermission('user:manage'),
    },
    {
      key: '/admin/roles',
      icon: <SafetyOutlined />,
      label: <Link to="/admin/roles">角色管理</Link>,
      show: hasPermission('role:manage'),
    },
    {
      key: '/admin/config',
      icon: <SettingOutlined />,
      label: <Link to="/admin/config">系统参数</Link>,
      show: hasPermission('system:config'),
    },
  ].filter(item => item.show !== false);  // 过滤掉 show=false 的项

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
          <Text style={{ color: 'rgba(255,255,255,0.65)', marginLeft: 8 }}>管理端</Text>
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
            selectedKeys={[location.pathname]}
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

export default AdminLayout;
