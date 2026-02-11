import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export default function Register() {
  const { t } = useTranslation();

  const onFinish = (values: { username: string; email: string; password: string }) => {
    console.log('Register:', values);
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          {t('auth.registerTitle')}
        </Title>
        <Form name="register" onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: `${t('auth.username')}` }]}>
            <Input prefix={<UserOutlined />} placeholder={t('auth.username')} />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: `${t('auth.email')}` }]}>
            <Input prefix={<MailOutlined />} placeholder={t('auth.email')} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, min: 8, message: `${t('auth.password')}` }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.password')} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: `${t('auth.confirmPassword')}` },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.confirmPassword')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('common.register')}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          已有账号？ <Link to="/login">{t('common.login')}</Link>
        </div>
      </Card>
    </div>
  );
}
