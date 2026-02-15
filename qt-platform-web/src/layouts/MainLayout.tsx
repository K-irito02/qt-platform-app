import { Layout, Button, Space, Dropdown, Avatar, Badge } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  GlobalOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { authApi } from '@/utils/api';
import type { MenuProps } from 'antd';

const { Content, Footer } = Layout;

export default function MainLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const isAdmin = user?.roles?.some((r: string) => ['ADMIN', 'SUPER_ADMIN'].includes(r));

  const navItems = [
    { key: '/', label: t('common.home') },
    { key: '/products', label: t('common.products') },
  ];

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(logout());
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: t('common.profile') || '个人中心', onClick: () => navigate('/profile') },
    ...(isAdmin ? [{ key: 'admin', icon: <SettingOutlined />, label: t('common.admin') || '管理后台', onClick: () => navigate('/admin') }] : []),
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: t('common.logout'), onClick: handleLogout, danger: true },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ===== 水墨风格顶栏 ===== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--paper-white)',
        borderBottom: '1px solid var(--ink-lightest)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(250, 249, 247, 0.92)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo + 印章 */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <div style={{
              width: 36,
              height: 36,
              border: '2px solid var(--cinnabar)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cinnabar)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: 14,
              transform: 'rotate(-3deg)',
              flexShrink: 0,
            }}>
              Qt
            </div>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--ink-darkest)',
              letterSpacing: '0.08em',
            }} className="hide-mobile">
              {t('common.siteName') || '墨韵平台'}
            </span>
          </div>

          {/* 导航链接 — 朱砂底线激活态 */}
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="hide-mobile">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 15,
                  fontWeight: isActive(item.key) ? 600 : 400,
                  color: isActive(item.key) ? 'var(--cinnabar)' : 'var(--ink-medium)',
                  position: 'relative',
                  transition: 'color 0.2s ease',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.key)) (e.target as HTMLElement).style.color = 'var(--ink-darkest)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.key)) (e.target as HTMLElement).style.color = 'var(--ink-medium)';
                }}
              >
                {item.label}
                {isActive(item.key) && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '20%',
                    width: '60%',
                    height: 2,
                    background: 'var(--cinnabar)',
                    borderRadius: 1,
                  }} />
                )}
              </button>
            ))}
          </nav>

          {/* 右侧操作区 */}
          <Space size={4}>
            <Button
              type="text"
              icon={<GlobalOutlined />}
              onClick={toggleLanguage}
              style={{
                color: 'var(--ink-medium)',
                fontFamily: 'var(--font-serif)',
                fontSize: 13,
              }}
            >
              {i18n.language === 'zh-CN' ? 'EN' : '中文'}
            </Button>

            {isAuthenticated ? (
              <>
                <Badge dot offset={[-4, 4]}>
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    onClick={() => navigate('/profile')}
                    style={{ color: 'var(--ink-medium)' }}
                  />
                </Badge>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                  <Space style={{
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background 0.2s ease',
                  }}>
                    <Avatar
                      icon={<UserOutlined />}
                      src={user?.avatarUrl}
                      size={32}
                      style={{ backgroundColor: 'var(--ink-lighter)' }}
                    />
                    <span className="hide-mobile" style={{
                      fontSize: 14,
                      color: 'var(--ink-dark)',
                      fontWeight: 500,
                    }}>
                      {user?.nickname || user?.username}
                    </span>
                  </Space>
                </Dropdown>
              </>
            ) : (
              <Space size={8}>
                <Button
                  type="text"
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/login')}
                  style={{ color: 'var(--ink-medium)', fontWeight: 500 }}
                >
                  {t('common.login')}
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  style={{
                    background: 'var(--ink-dark)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 500,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {t('common.register')}
                </Button>
              </Space>
            )}
          </Space>
        </div>
      </header>

      {/* ===== 内容区 ===== */}
      <Content style={{
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        padding: '32px 32px 64px',
        minHeight: 'calc(100vh - 64px - 80px)',
      }}>
        <Outlet />
      </Content>

      {/* ===== 水墨风格页脚 ===== */}
      <Footer style={{
        textAlign: 'center',
        background: 'var(--paper-warm)',
        borderTop: '1px solid var(--ink-lightest)',
        padding: '32px 48px',
        position: 'relative',
      }}>
        <div style={{ position: 'relative' }}>
          {/* 水墨分割线 */}
          <div style={{
            position: 'absolute',
            top: -33,
            left: '20%',
            right: '20%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--ink-lightest), transparent)',
          }} />

          <div style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--ink-light)',
            fontSize: 13,
            letterSpacing: '0.06em',
            lineHeight: 2,
          }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: 'var(--ink-medium)' }}>墨韵平台</span>
              <span style={{ margin: '0 12px', color: 'var(--ink-lightest)' }}>·</span>
              <span>Qt 产品发布与分发</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-lighter)' }}>
              {t('footer.copyright') || `© ${new Date().getFullYear()} Qt Product Platform. All rights reserved.`}
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
