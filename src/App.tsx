import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuth } from './hooks/useAuth'

// Layouts
import StudentLayout from './layouts/StudentLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import LoginPage from './pages/Login'
import ForbiddenPage from './pages/Forbidden'
import NotFoundPage from './pages/NotFound'

// Student pages (M2)
import RoomList from './pages/student/RoomList'
import RoomDetailPage from './pages/student/RoomDetailPage'

// Student pages (M3)
import MyReservations from './pages/student/MyReservations'

// Admin pages (M2)
import RoomManage from './pages/admin/RoomManage'
import SeatManage from './pages/admin/SeatManage'

// Admin pages (M3)
import ReservationManage from './pages/admin/ReservationManage'

// Student placeholder pages
const StudentSearch: React.FC = () => <div>搜索座位（M5实现）</div>
const StudentCheckIn: React.FC = () => <div>签到（M4实现）</div>
const StudentViolations: React.FC = () => <div>违约记录（M4实现）</div>
const StudentAssistant: React.FC = () => <div>智能助手（M6实现）</div>

// Admin placeholder pages
const AdminDashboard: React.FC = () => <div>仪表盘（M5实现）</div>
const AdminViolations: React.FC = () => <div>违约管理（M4实现）</div>
const AdminUsers: React.FC = () => <div>用户管理（M5实现）</div>
const AdminRoles: React.FC = () => <div>角色管理（M5实现）</div>
const AdminConfig: React.FC = () => <div>系统参数（M5实现）</div>
const AdminCheckInCodes: React.FC = () => <div>签到编码（M4实现）</div>

// 路由守卫：需要登录
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading, isLoggedIn } = useAuth()
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>
  }
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// 路由守卫：仅管理员
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userInfo } = useAuth()
  if (userInfo?.userType !== 'ADMIN') {
    return <Navigate to="/403" replace />
  }
  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 学生端路由 */}
        <Route path="/student" element={
          <RequireAuth>
            <StudentLayout />
          </RequireAuth>
        }>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<RoomList />} />
          <Route path="rooms/:id" element={<RoomDetailPage />} />
          <Route path="search" element={<StudentSearch />} />
          <Route path="reservations" element={<MyReservations />} />
          <Route path="check-in" element={<StudentCheckIn />} />
          <Route path="violations" element={<StudentViolations />} />
          <Route path="assistant" element={<StudentAssistant />} />
        </Route>

        {/* 管理端路由 */}
        <Route path="/admin" element={
          <RequireAuth>
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          </RequireAuth>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="rooms" element={<RoomManage />} />
          <Route path="seats" element={<SeatManage />} />
          <Route path="seats/:roomId" element={<SeatManage />} />
          <Route path="reservations" element={<ReservationManage />} />
          <Route path="violations" element={<AdminViolations />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="config" element={<AdminConfig />} />
          <Route path="check-in-codes" element={<AdminCheckInCodes />} />
        </Route>

        {/* 错误页面 */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* 默认跳转 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
