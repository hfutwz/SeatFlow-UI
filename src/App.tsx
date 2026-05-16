import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import Login from './pages/Login';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';
import { authService } from './services/auth';

/**
 * 路由守卫组件
 * - 未登录 → 跳转 /login
 * - STUDENT 访问管理端路由 → 跳转 /403
 * - ADMIN 访问学生端路由 → 跳转 /admin
 */
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getSavedUser();

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const path = location.pathname;

    // STUDENT 不可访问管理端路由
    if (path.startsWith('/admin') && user.userType !== 'ADMIN') {
      navigate('/403', { replace: true });
      return;
    }

    // ADMIN 访问学生端根路径时重定向到 /admin
    if (path.startsWith('/student') && user.userType === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }

    setChecking(false);
  }, [location.pathname, navigate]);

  if (checking) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

/** 404 页面 */
const NotFound: React.FC = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  }}>
    <h1 style={{ fontSize: 72, margin: 0 }}>404</h1>
    <p>页面不存在</p>
    <a href="/">返回首页</a>
  </div>
);

/** 403 无权限页面 */
const Forbidden: React.FC = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  }}>
    <h1 style={{ fontSize: 72, margin: 0 }}>403</h1>
    <p>无权限访问该页面</p>
    <a href="/">返回首页</a>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/403" element={<Forbidden />} />

        {/* 学生端路由 */}
        <Route path="/student" element={
          <RouteGuard><StudentLayout /></RouteGuard>
        }>
          <Route index element={
            <div style={{ padding: 24 }}>
              <h2>欢迎使用 SeatFlow 学生端</h2>
              <p>请从左侧菜单选择功能</p>
            </div>
          } />
        </Route>

        {/* 管理端路由 */}
        <Route path="/admin" element={
          <RouteGuard><AdminLayout /></RouteGuard>
        }>
          <Route index element={
            <div style={{ padding: 24 }}>
              <h2>欢迎使用 SeatFlow 管理端</h2>
              <p>请从左侧菜单选择功能</p>
            </div>
          } />
        </Route>

        {/* 根路径重定向 */}
        <Route path="/" element={
          authService.isLoggedIn()
            ? <Navigate to={
                authService.getSavedUser()?.userType === 'ADMIN'
                  ? '/admin'
                  : '/student'
              } replace />
            : <Navigate to="/login" replace />
        } />

        {/* 兜底 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
