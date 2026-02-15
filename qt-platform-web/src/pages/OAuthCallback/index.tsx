import { useEffect, useState } from 'react';
import { Spin, Result, Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { authApi } from '@/utils/api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) { setError('缺少授权码'); return; }
    handleCallback(code);
  }, []);

  const handleCallback = async (code: string) => {
    try {
      const res: any = await authApi.githubCallback(code);
      dispatch(setCredentials({
        user: res.data.user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      }));
      navigate('/', { replace: true });
    } catch {
      setError('GitHub 登录失败，请重试');
    }
  };

  if (error) {
    return (
      <Result status="error" title="授权失败" subTitle={error}
        extra={<Button type="primary" onClick={() => navigate('/login')}>返回登录</Button>} />
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <Spin size="large" />
      <p style={{ marginTop: 16, color: 'var(--ink-light)' }}>正在处理 GitHub 授权...</p>
    </div>
  );
}
