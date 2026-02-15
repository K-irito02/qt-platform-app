import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeOutlined } from '@ant-design/icons';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div className="animate-ink-spread">
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 120,
          fontWeight: 700,
          color: 'var(--ink-lightest)',
          lineHeight: 1,
          marginBottom: 16,
          letterSpacing: '0.1em',
        }}>
          404
        </div>
        <div className="ink-seal" style={{ margin: '0 auto 24px', width: 48, height: 48, fontSize: 18 }} aria-hidden="true">
          迷
        </div>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 22,
          color: 'var(--ink-dark)',
          marginBottom: 12,
          letterSpacing: '0.08em',
        }}>
          墨迹未至此处
        </h2>
        <p style={{
          color: 'var(--ink-light)',
          fontSize: 15,
          marginBottom: 32,
          maxWidth: 360,
          margin: '0 auto 32px',
          lineHeight: 1.7,
        }}>
          抱歉，您访问的页面不存在或已被移除
        </p>
        <Button
          type="primary"
          size="large"
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
          style={{
            height: 44,
            padding: '0 28px',
            background: 'var(--ink-dark)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
          }}
        >
          {t('common.backToHome')}
        </Button>
      </div>
    </div>
  );
}
