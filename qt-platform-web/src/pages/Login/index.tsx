import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { authApi } from '@/utils/api';
import boatSvg from '@/assets/ink/boat.svg';

/**
 * 登录页 - 空寂意境
 * 扇面构图：整版留白70%，一叶扁舟，极简印章按钮
 */
export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res: any = await authApi.login(values);
      dispatch(setCredentials({
        user: res.data.user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      }));
      message.success('登录成功');
      navigate('/');
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const res: any = await authApi.getGithubUrl();
      window.location.href = res.data.url;
    } catch {
      message.error('获取 GitHub 授权地址失败');
    }
  };

  return (
    <div className="ink-layout-fan" style={{
      minHeight: '100vh',
      background: 'var(--paper-white)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ===== 背景层：淡墨山水 + 扁舟 ===== */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {/* 远山云气 - 右上角 */}
        <div style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '35%',
          height: '25%',
          background: 'radial-gradient(ellipse at 80% 30%, rgba(26, 26, 46, 0.03) 0%, transparent 60%)',
        }} />
        
        {/* 淡墨山影 - 左下角 */}
        <div style={{
          position: 'absolute',
          bottom: '8%',
          left: '3%',
          width: '40%',
          height: '30%',
          background: 'radial-gradient(ellipse at 20% 80%, rgba(26, 26, 46, 0.025) 0%, transparent 50%)',
        }} />

        {/* 一叶扁舟 */}
        <img 
          src={boatSvg} 
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '8%',
            width: '280px',
            opacity: 0.6,
            filter: 'grayscale(20%)',
          }}
        />

        {/* 水波纹 */}
        <svg 
          style={{
            position: 'absolute',
            bottom: '5%',
            left: 0,
            width: '100%',
            height: '60px',
            opacity: 0.15,
          }}
          viewBox="0 0 1200 60" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0 40 Q100 30 200 40 Q300 50 400 40 Q500 30 600 40 Q700 50 800 40 Q900 30 1000 40 Q1100 50 1200 40" 
            fill="none" 
            stroke="var(--ink-lighter)" 
            strokeWidth="0.5"
          />
          <path 
            d="M0 50 Q150 45 300 50 Q450 55 600 50 Q750 45 900 50 Q1050 55 1200 50" 
            fill="none" 
            stroke="var(--ink-lighter)" 
            strokeWidth="0.3"
          />
        </svg>
      </div>

      {/* ===== 画心层：登录表单 ===== */}
      <div 
        className="ink-reveal"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 380,
          padding: '0 24px',
        }}
      >
        {/* 引首 - 竖排标题（右上方） */}
        <div style={{
          position: 'absolute',
          top: -80,
          right: -60,
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontFamily: 'var(--font-serif)',
          fontSize: 14,
          letterSpacing: '0.5em',
          color: 'var(--ink-lighter)',
          opacity: 0.6,
        }}>
          登临此境
        </div>

        {/* 表单容器 - 宣纸质感 */}
        <div style={{
          background: 'rgba(250, 249, 247, 0.85)',
          backdropFilter: 'blur(20px)',
          padding: '56px 44px 48px',
          position: 'relative',
        }}>
          {/* 朱砂印章 */}
          <div style={{
            position: 'absolute',
            top: -28,
            left: '50%',
            transform: 'translateX(-50%) rotate(-8deg)',
            width: 56,
            height: 56,
            border: '2.5px solid var(--cinnabar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--cinnabar)',
            background: 'var(--paper-white)',
            boxShadow: '0 4px 20px rgba(192, 57, 43, 0.15)',
          }}>
            登
          </div>

          {/* 标题 */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--ink-darkest)',
            textAlign: 'center',
            letterSpacing: '0.15em',
            marginBottom: 8,
            marginTop: 16,
          }}>
            {t('auth.loginTitle') || '欢迎回来'}
          </h1>
          <p style={{
            textAlign: 'center',
            color: 'var(--ink-light)',
            fontSize: 14,
            marginBottom: 40,
            letterSpacing: '0.05em',
          }}>
            {t('auth.loginSubtitle') || '登录以继续使用平台服务'}
          </p>

          {/* 表单 - 砚台输入框 */}
          <Form form={form} name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: t('auth.emailRequired') || '请输入有效的邮箱地址' }]}
              style={{ marginBottom: 24 }}
            >
              <Input
                placeholder={t('auth.email') || '邮箱地址'}
                size="large"
                style={{
                  background: 'linear-gradient(180deg, var(--paper-warm) 0%, var(--paper-cream) 100%)',
                  border: 'none',
                  borderBottom: '2px solid var(--ink-lightest)',
                  padding: '14px 16px',
                  fontSize: 15,
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('auth.passwordRequired') || '请输入密码' }]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                placeholder={t('auth.password') || '密码'}
                size="large"
                style={{
                  background: 'linear-gradient(180deg, var(--paper-warm) 0%, var(--paper-cream) 100%)',
                  border: 'none',
                  borderBottom: '2px solid var(--ink-lightest)',
                  padding: '14px 16px',
                  fontSize: 15,
                }}
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginBottom: 32 }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  fontSize: 13, 
                  color: 'var(--ink-light)',
                  fontStyle: 'italic',
                }}
              >
                {t('auth.forgotPassword') || '忘记密码？'}
              </Link>
            </div>

            {/* 印章按钮 */}
            <Form.Item style={{ marginBottom: 20 }}>
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
                {t('common.login') || '登 录'}
              </Button>
            </Form.Item>
          </Form>

          {/* 分割线 - 墨迹风格 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            margin: '28px 0',
          }}>
            <div style={{
              flex: 1,
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--ink-lightest))',
            }} />
            <span style={{ 
              color: 'var(--ink-lighter)', 
              fontSize: 12,
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.1em',
            }}>
              或
            </span>
            <div style={{
              flex: 1,
              height: 1,
              background: 'linear-gradient(90deg, var(--ink-lightest), transparent)',
            }} />
          </div>

          {/* GitHub 登录 */}
          <Button
            icon={<GithubOutlined />}
            block
            size="large"
            onClick={handleGithubLogin}
            style={{
              height: 46,
              border: '1px solid var(--ink-lightest)',
              color: 'var(--ink-dark)',
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            GitHub {t('common.login') || '登录'}
          </Button>

          {/* 注册提示 */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid rgba(26, 26, 46, 0.06)',
          }}>
            <span style={{ color: 'var(--ink-light)', fontSize: 14 }}>
              {t('auth.noAccount') || '还没有账号？'}
            </span>
            <Link 
              to="/register" 
              style={{ 
                marginLeft: 8,
                fontWeight: 600, 
                color: 'var(--cinnabar)', 
                fontSize: 14,
                letterSpacing: '0.05em',
              }}
            >
              {t('auth.registerNow') || '立即注册'}
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

        {/* 测试账号提示 */}
        {import.meta.env.DEV && (
          <div style={{
            marginTop: 24,
            padding: '16px 20px',
            background: 'rgba(245, 241, 235, 0.8)',
            border: '1px dashed var(--ink-lightest)',
            fontSize: 12,
            color: 'var(--ink-light)',
          }}>
            <div style={{ 
              fontWeight: 600, 
              marginBottom: 10, 
              color: 'var(--ink-dark)', 
              fontSize: 13,
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.08em',
            }}>
              测试账号（仅开发环境）
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span>管理员：admin@qtplatform.com</span>
              <Button type="link" size="small" style={{ fontSize: 11, padding: 0, height: 'auto', color: 'var(--cinnabar)' }}
                onClick={() => form.setFieldsValue({ email: 'admin@qtplatform.com', password: 'Admin@123456' })}>
                填入
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span>普通用户：zhangsan@example.com</span>
              <Button type="link" size="small" style={{ fontSize: 11, padding: 0, height: 'auto', color: 'var(--cinnabar)' }}
                onClick={() => form.setFieldsValue({ email: 'zhangsan@example.com', password: 'Test@123456' })}>
                填入
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>VIP用户：wangwu@example.com</span>
              <Button type="link" size="small" style={{ fontSize: 11, padding: 0, height: 'auto', color: 'var(--cinnabar)' }}
                onClick={() => form.setFieldsValue({ email: 'wangwu@example.com', password: 'Test@123456' })}>
                填入
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 闲章 - 右下角 */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 40,
        width: 36,
        height: 36,
        border: '1.5px solid var(--cinnabar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-serif)',
        fontSize: 12,
        color: 'var(--cinnabar)',
        transform: 'rotate(5deg)',
        opacity: 0.5,
      }}>
        墨
      </div>
    </div>
  );
}
