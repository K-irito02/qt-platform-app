import { Layout, Menu, Button, Space, Dropdown, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import type { MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const menuItems: MenuProps['items'] = [
    { key: '/', icon: <HomeOutlined />, label: t('common.home') },
    { key: '/products', icon: <AppstoreOutlined />, label: t('common.products') },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'logout', icon: <LogoutOutlined />, label: t('common.logout'), onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div
          style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 32, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Qt Platform
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1 }}
        />
        <Space>
          <Button type="text" icon={<GlobalOutlined />} onClick={toggleLanguage} style={{ color: '#fff' }}>
            {i18n.language === 'zh-CN' ? 'EN' : '中'}
          </Button>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer', color: '#fff' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatarUrl} size="small" />
                <span>{user?.nickname || user?.username}</span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button type="link" style={{ color: '#fff' }} icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                {t('common.login')}
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                {t('common.register')}
              </Button>
            </Space>
          )}
        </Space>
      </Header>

      <Content style={{ padding: '24px 48px', minHeight: 'calc(100vh - 134px)' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', color: '#999' }}>
        {t('footer.copyright')}
      </Footer>
    </Layout>
  );
}
