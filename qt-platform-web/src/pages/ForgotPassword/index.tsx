import { useState } from 'react';
import { Form, Input, Button, Typography, Space, Steps, message } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/utils/api';

const { Paragraph } = Typography;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [form] = Form.useForm();

  const sendCode = async () => {
    const emailVal = form.getFieldValue('email');
    if (!emailVal) { message.warning('请输入邮箱'); return; }
    setCodeSending(true);
    try {
      await authApi.sendCode({ email: emailVal, type: 'RESET_PASSWORD' });
      message.success('验证码已发送');
      setEmail(emailVal);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((p) => { if (p <= 1) { clearInterval(timer); return 0; } return p - 1; });
      }, 1000);
      setStep(1);
    } catch { /* handled */ } finally { setCodeSending(false); }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authApi.resetPassword({ email, code: values.code, newPassword: values.newPassword });
      message.success('密码重置成功，请登录');
      navigate('/login');
    } catch { /* handled */ } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="paper-card animate-ink-spread" style={{ width: '100%', maxWidth: 420, padding: '44px 40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="ink-seal" style={{ margin: '0 auto 16px', width: 44, height: 44, fontSize: 16 }} aria-hidden="true">
            密
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--ink-darkest)', letterSpacing: '0.08em', marginBottom: 8 }}>
            重置密码
          </h2>
          <Paragraph style={{ color: 'var(--ink-light)', fontSize: 14, marginBottom: 0 }}>
            通过邮箱验证码重置您的密码
          </Paragraph>
        </div>

        <Steps current={step} size="small" style={{ marginBottom: 28 }}
          items={[{ title: '验证邮箱' }, { title: '设置新密码' }]} />

        <Form form={form} onFinish={step === 0 ? undefined : onFinish} size="large" layout="vertical">
          {step === 0 && (
            <>
              <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入邮箱' }]}>
                <Input prefix={<MailOutlined style={{ color: 'var(--ink-lighter)' }} />} placeholder="邮箱地址" style={{ borderRadius: 'var(--radius-md)' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" block loading={codeSending} onClick={sendCode} style={{
                  height: 44, fontWeight: 500, borderRadius: 'var(--radius-md)', background: 'var(--ink-dark)', border: 'none',
                }}>
                  发送验证码
                </Button>
              </Form.Item>
            </>
          )}
          {step === 1 && (
            <>
              <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input prefix={<SafetyOutlined style={{ color: 'var(--ink-lighter)' }} />} placeholder="验证码" style={{ flex: 1, borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }} />
                  <Button onClick={sendCode} disabled={countdown > 0} loading={codeSending} style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                    {countdown > 0 ? `${countdown}s` : '重新发送'}
                  </Button>
                </Space.Compact>
              </Form.Item>
              <Form.Item name="newPassword" rules={[
                { required: true, message: '请输入新密码' },
                { min: 8, message: '密码至少 8 个字符' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: '需包含大小写字母和数字' },
              ]}>
                <Input.Password prefix={<LockOutlined style={{ color: 'var(--ink-lighter)' }} />} placeholder="新密码" style={{ borderRadius: 'var(--radius-md)' }} />
              </Form.Item>
              <Form.Item name="confirmPassword" dependencies={['newPassword']} rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                    return Promise.reject(new Error('两次密码不一致'));
                  },
                }),
              ]}>
                <Input.Password prefix={<LockOutlined style={{ color: 'var(--ink-lighter)' }} />} placeholder="确认新密码" style={{ borderRadius: 'var(--radius-md)' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} style={{
                  height: 44, fontWeight: 500, borderRadius: 'var(--radius-md)', background: 'var(--ink-dark)', border: 'none',
                }}>
                  重置密码
                </Button>
              </Form.Item>
            </>
          )}
        </Form>

        <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid var(--ink-lightest)' }}>
          <Link to="/login" style={{ color: 'var(--indigo)', fontSize: 14 }}>← 返回登录</Link>
        </div>
      </div>
    </div>
  );
}
