import { Card, Form, Input, Button, Divider, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export default function Login() {
  const { t } = useTranslation();

  const onFinish = (values: { username: string; password: string }) => {
    console.log('Login:', values);
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          {t('auth.loginTitle')}
        </Title>
        <Form name="login" onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: `${t('auth.username')}` }]}>
            <Input prefix={<UserOutlined />} placeholder={t('auth.username')} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: `${t('auth.password')}` }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.password')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('common.login')}
            </Button>
          </Form.Item>
        </Form>
        <Divider plain>OR</Divider>
        <Button icon={<GithubOutlined />} block size="large">
          {t('auth.loginWithGithub')}
        </Button>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
          <Link to="/register">{t('auth.registerTitle')}</Link>
          <Link to="/forgot-password">{t('auth.forgotPassword')}</Link>
        </Space>
      </Card>
    </div>
  );
}
