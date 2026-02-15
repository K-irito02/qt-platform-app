import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  CommentOutlined,
  FolderOutlined,
  SettingOutlined,
  BgColorsOutlined,
  ArrowLeftOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.roles?.some((r: string) =>
    ['ADMIN', 'SUPER_ADMIN'].includes(r)
  );

  if (!isAuthenticated || !isAdmin) {
    navigate('/login');
    return null;
  }

  const menuItems: MenuProps['items'] = [
    { key: '/admin', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/admin/users', icon: <UserOutlined />, label: '用户管理' },
    { key: '/admin/products', icon: <AppstoreOutlined />, label: '产品管理' },
    { key: '/admin/comments', icon: <CommentOutlined />, label: '评论管理' },
    { key: '/admin/categories', icon: <FolderOutlined />, label: '分类管理' },
    { key: '/admin/theme', icon: <BgColorsOutlined />, label: '主题管理' },
    { key: '/admin/system', icon: <SettingOutlined />, label: '系统配置' },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => { dispatch(logout()); navigate('/'); },
    },
  ];

  const selectedKey = menuItems
    .map((item) => (item as { key: string }).key)
    .filter((key) => location.pathname === key || (key !== '/admin' && location.pathname.startsWith(key)))
    .sort((a, b) => b.length - a.length)[0] || '/admin';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={230}
        collapsedWidth={64}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        style={{
          background: 'var(--ink-darkest)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              border: '1.5px solid var(--cinnabar)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--cinnabar)', fontFamily: 'var(--font-serif)',
              fontSize: 14, fontWeight: 700,
            }}>
              管
            </div>
            {!collapsed && (
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-serif)', letterSpacing: '0.06em' }}>
                管理后台
              </span>
            )}
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            borderRight: 0,
            marginTop: 8,
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 64 : 230, transition: 'margin-left 0.2s' }}>
        <Header style={{
          background: 'var(--paper-base)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--ink-lightest)',
          boxShadow: 'none',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          height: 56,
          lineHeight: '56px',
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: 'var(--ink-medium)' }}
            />
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/')}
              style={{ color: 'var(--ink-medium)' }}
            >
              返回前台
            </Button>
          </Space>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                icon={<UserOutlined />}
                src={user?.avatarUrl}
                size="small"
                style={{ backgroundColor: 'var(--ink-lighter)' }}
              />
              <span style={{ color: 'var(--ink-dark)', fontSize: 13 }}>{user?.nickname || user?.username}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{
          margin: 20,
          padding: 24,
          background: 'var(--paper-base)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--ink-lightest)',
          minHeight: 360,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
