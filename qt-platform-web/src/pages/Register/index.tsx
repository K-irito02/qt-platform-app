import { useState } from 'react';
import { Form, Input, Button, Space, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/utils/api';
import bambooSvg from '@/assets/ink/bamboo-corner.svg';

/**
 * 注册页 - 空寂意境
 * 扇面构图：整版留白70%，竹枝装饰，极简印章按钮
 */
export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();

  const sendCode = async () => {
    const email = form.getFieldValue('email');
    if (!email) { message.warning('请先输入邮箱'); return; }
    setCodeSending(true);
    try {
      await authApi.sendCode({ email, type: 'REGISTER' });
      message.success('验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
      }, 1000);
    } catch { /* handled */ } finally { setCodeSending(false); }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authApi.register({
        username: values.username,
        email: values.email,
        password: values.password,
        verificationCode: values.code,
        nickname: values.username,
      });
      message.success('注册成功，请登录');
      navigate('/login');
    } catch { /* handled */ } finally { setLoading(false); }
  };

  // 砚台输入框样式
  const inkstoneInputStyle = {
    background: 'linear-gradient(180deg, var(--paper-warm) 0%, var(--paper-cream) 100%)',
    border: 'none',
    borderBottom: '2px solid var(--ink-lightest)',
    padding: '14px 16px',
    fontSize: 15,
  };

  return (
    <div className="ink-layout-fan" style={{
      minHeight: '100vh',
      background: 'var(--paper-white)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ===== 背景层：淡墨山水 + 竹枝 ===== */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {/* 远山云气 - 左上角 */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '5%',
          width: '30%',
          height: '20%',
          background: 'radial-gradient(ellipse at 20% 30%, rgba(26, 26, 46, 0.025) 0%, transparent 60%)',
        }} />
        
        {/* 竹枝装饰 - 右下角 */}
        <img 
          src={bambooSvg} 
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '300px',
            height: 'auto',
            opacity: 0.5,
          }}
        />

        {/* 云气渐变 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to top, rgba(26, 26, 46, 0.015) 0%, transparent 100%)',
        }} />
      </div>

      {/* ===== 画心层：注册表单 ===== */}
      <div 
        className="ink-reveal"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 400,
          padding: '0 24px',
        }}
      >
        {/* 引首 - 竖排标题（左上方） */}
        <div style={{
          position: 'absolute',
          top: -60,
          left: -50,
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontFamily: 'var(--font-serif)',
          fontSize: 14,
          letterSpacing: '0.5em',
          color: 'var(--ink-lighter)',
          opacity: 0.6,
        }}>
          新客临门
        </div>

        {/* 表单容器 - 宣纸质感 */}
        <div style={{
          background: 'rgba(250, 249, 247, 0.88)',
          backdropFilter: 'blur(20px)',
          padding: '52px 40px 44px',
          position: 'relative',
        }}>
          {/* 朱砂印章 */}
          <div style={{
            position: 'absolute',
            top: -26,
            left: '50%',
            transform: 'translateX(-50%) rotate(5deg)',
            width: 52,
            height: 52,
            border: '2.5px solid var(--cinnabar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--cinnabar)',
            background: 'var(--paper-white)',
            boxShadow: '0 4px 20px rgba(192, 57, 43, 0.15)',
          }}>
            注
          </div>

          {/* 标题 */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--ink-darkest)',
            textAlign: 'center',
            letterSpacing: '0.15em',
            marginBottom: 8,
            marginTop: 12,
          }}>
            {t('auth.registerTitle') || '创建账号'}
          </h1>
          <p style={{
            textAlign: 'center',
            color: 'var(--ink-light)',
            fontSize: 14,
            marginBottom: 36,
            letterSpacing: '0.05em',
          }}>
            {t('auth.registerSubtitle') || '加入平台，探索更多可能'}
          </p>

          {/* 表单 */}
          <Form form={form} name="register" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item 
              name="username" 
              style={{ marginBottom: 20 }}
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, max: 50, message: '用户名长度 3-50 个字符' },
                { pattern: /^[a-zA-Z0-9_-]+$/, message: '仅允许字母、数字、下划线和连字符' },
              ]}
            >
              <Input 
                placeholder={t('auth.username') || '用户名'} 
                size="large"
                style={inkstoneInputStyle} 
              />
            </Form.Item>
            <Form.Item 
              name="email" 
              style={{ marginBottom: 20 }}
              rules={[{ required: true, type: 'email', message: '请输入有效的邮箱' }]}
            >
              <Input 
                placeholder={t('auth.email') || '邮箱地址'} 
                size="large"
                style={inkstoneInputStyle} 
              />
            </Form.Item>
            <Form.Item 
              name="code" 
              style={{ marginBottom: 20 }}
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  placeholder={t('auth.verificationCode') || '验证码'} 
                  size="large"
                  style={{ 
                    ...inkstoneInputStyle, 
                    flex: 1,
                  }} 
                />
                <Button 
                  onClick={sendCode} 
                  loading={codeSending} 
                  disabled={countdown > 0} 
                  size="large"
                  style={{ 
                    height: 'auto',
                    padding: '12px 16px',
                    border: '1px solid var(--ink-lightest)',
                    borderLeft: 'none',
                    background: 'var(--paper-warm)',
                    color: countdown > 0 ? 'var(--ink-lighter)' : 'var(--ink-dark)',
                    fontWeight: 500,
                  }}
                >
                  {countdown > 0 ? `${countdown}s` : t('auth.sendCode') || '发送验证码'}
                </Button>
              </Space.Compact>
            </Form.Item>
            <Form.Item 
              name="password" 
              style={{ marginBottom: 20 }}
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码至少 8 个字符' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: '需包含大小写字母和数字' },
              ]}
            >
              <Input.Password 
                placeholder={t('auth.password') || '密码'} 
                size="large"
                style={inkstoneInputStyle} 
              />
            </Form.Item>
            <Form.Item 
              name="confirmPassword" 
              dependencies={['password']} 
              style={{ marginBottom: 28 }}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password 
                placeholder={t('auth.confirmPassword') || '确认密码'} 
                size="large"
                style={inkstoneInputStyle} 
              />
            </Form.Item>

            {/* 印章按钮 */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading} 
                style={{
                  height: 50,
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: '0.2em',
                  background: 'var(--ink-darkest)',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(26, 26, 46, 0.2)',
                }}
              >
                {t('common.register') || '注 册'}
              </Button>
            </Form.Item>
          </Form>

          {/* 登录提示 */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid rgba(26, 26, 46, 0.06)',
          }}>
            <span style={{ color: 'var(--ink-light)', fontSize: 14 }}>
              {t('auth.hasAccount') || '已有账号？'}
            </span>
            <Link 
              to="/login" 
              style={{ 
                marginLeft: 8,
                fontWeight: 600, 
                color: 'var(--cinnabar)', 
                fontSize: 14,
                letterSpacing: '0.05em',
              }}
            >
              {t('auth.loginNow') || '立即登录'}
            </Link>
          </div>
        </div>

        {/* 落款 */}
        <div style={{
          textAlign: 'right',
          marginTop: 20,
          paddingRight: 8,
          fontFamily: 'var(--font-serif)',
          fontSize: 12,
          color: 'var(--ink-lighter)',
          fontStyle: 'italic',
          letterSpacing: '0.1em',
        }}>
          Qt 产品发布平台
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            marginLeft: 8,
            border: '1px solid var(--cinnabar)',
            color: 'var(--cinnabar)',
            fontSize: 9,
            fontWeight: 700,
            transform: 'rotate(-3deg)',
            opacity: 0.7,
          }}>
            印
          </span>
        </div>
      </div>

      {/* 闲章 - 左下角 */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        width: 36,
        height: 36,
        border: '1.5px solid var(--cinnabar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-serif)',
        fontSize: 12,
        color: 'var(--cinnabar)',
        transform: 'rotate(-5deg)',
        opacity: 0.5,
      }}>
        新
      </div>
    </div>
  );
}
