import { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, Avatar, message, Descriptions, Tag, Upload, Radio, Slider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EditOutlined, BgColorsOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser, logout } from '@/store/slices/authSlice';
import { setUserConfig } from '@/store/slices/themeSlice';
import { userApi, authApi, fileApi } from '@/utils/api';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [themeForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const currentTheme = useAppSelector((s) => s.theme.currentTheme);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    loadProfile();
    loadThemeConfig();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const res: any = await userApi.getProfile();
      const u = res.data;
      profileForm.setFieldsValue({ nickname: u.nickname, bio: u.bio });
      dispatch(setUser(u));
    } catch { /* handled */ }
  };

  const loadThemeConfig = async () => {
    try {
      const res: any = await userApi.getTheme();
      if (res.data.themeConfig) {
        const config = JSON.parse(res.data.themeConfig);
        themeForm.setFieldsValue({
          backgroundType: config.background?.type || 'image',
          backgroundUrl: config.background?.url || '',
          backgroundOpacity: config.background?.opacity || 0.1,
        });
      }
    } catch { /* handled */ }
  };

  const onProfileSave = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await userApi.updateProfile(values);
      dispatch(setUser(res.data));
      message.success('资料已更新');
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const onPasswordChange = async (values: any) => {
    setLoading(true);
    try {
      await authApi.changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
      message.success('密码已修改，请重新登录');
      dispatch(logout());
      navigate('/login');
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const res: any = await fileApi.upload(file, 'theme');
      const url = res.data.url;
      themeForm.setFieldValue('backgroundUrl', url);
      message.success('文件上传成功');
      return url;
    } catch {
      message.error('文件上传失败');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const onThemeSave = async (values: any) => {
    setLoading(true);
    try {
      const themeConfig = {
        background: {
          type: values.backgroundType,
          url: values.backgroundUrl,
          opacity: values.backgroundOpacity,
          overlay: currentTheme.background.overlay,
        },
        ink: currentTheme.ink,
      };
      await userApi.updateTheme(JSON.stringify(themeConfig));
      dispatch(setUserConfig(themeConfig));
      message.success('外观设置已保存');
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const tabItems = [
    {
      key: 'profile',
      label: <span><EditOutlined /> 个人资料</span>,
      children: (
        <Form form={profileForm} layout="vertical" onFinish={onProfileSave}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <Avatar
              size={88}
              icon={<UserOutlined />}
              src={user?.avatarUrl}
              style={{ backgroundColor: 'var(--ink-lighter)', border: '3px solid var(--paper-warm)' }}
            />
            <div style={{ marginTop: 12, fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--ink-darkest)' }}>
              {user?.nickname || user?.username}
            </div>
            <div style={{ color: 'var(--ink-light)', fontSize: 13, marginTop: 4 }}>
              <MailOutlined /> {user?.email}
            </div>
          </div>
          <Form.Item label="昵称" name="nickname">
            <Input placeholder="昵称" style={{ borderRadius: 'var(--radius-md)' }} />
          </Form.Item>
          <Form.Item label="个人简介" name="bio">
            <Input.TextArea rows={3} placeholder="简单介绍一下自己" style={{ borderRadius: 'var(--radius-md)' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{
              background: 'var(--ink-dark)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 500,
            }}>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'account',
      label: <span><UserOutlined /> 账号信息</span>,
      children: (
        <Descriptions column={1} bordered size="small" style={{ maxWidth: 500 }}>
          <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="角色">
            {user?.roles?.map((r: string) => (
              <Tag key={r} color={r === 'SUPER_ADMIN' ? 'red' : r === 'ADMIN' ? 'orange' : 'blue'}>{r}</Tag>
            ))}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'password',
      label: <span><LockOutlined /> 修改密码</span>,
      children: (
        <Form form={passwordForm} layout="vertical" onFinish={onPasswordChange} style={{ maxWidth: 400 }}>
          <Form.Item label="当前密码" name="oldPassword" rules={[{ required: true, message: '请输入当前密码' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: 'var(--ink-lighter)' }} />} style={{ borderRadius: 'var(--radius-md)' }} />
          </Form.Item>
          <Form.Item label="新密码" name="newPassword" rules={[
            { required: true, message: '请输入新密码' },
            { min: 8, message: '至少 8 个字符' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: '需包含大小写字母和数字' },
          ]}>
            <Input.Password prefix={<LockOutlined style={{ color: 'var(--ink-lighter)' }} />} style={{ borderRadius: 'var(--radius-md)' }} />
          </Form.Item>
          <Form.Item label="确认新密码" name="confirmPassword" dependencies={['newPassword']} rules={[
            { required: true, message: '请确认' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                return Promise.reject(new Error('两次密码不一致'));
              },
            }),
          ]}>
            <Input.Password prefix={<LockOutlined style={{ color: 'var(--ink-lighter)' }} />} style={{ borderRadius: 'var(--radius-md)' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{
              background: 'var(--cinnabar)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 500,
            }}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'appearance',
      label: <span><BgColorsOutlined /> 外观设置</span>,
      children: (
        <Form form={themeForm} layout="vertical" onFinish={onThemeSave} style={{ maxWidth: 600 }}>
          <Form.Item label="背景类型" name="backgroundType" initialValue="image">
            <Radio.Group>
              <Radio value="image">图片</Radio>
              <Radio value="video">视频</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="背景文件" name="backgroundUrl">
            <Input.Group compact>
              <Input style={{ width: 'calc(100% - 100px)' }} placeholder="背景文件URL" />
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleFileUpload(file);
                  return false;
                }}
                accept="image/*,video/*"
              >
                <Button icon={<UploadOutlined />} loading={uploading}>上传</Button>
              </Upload>
            </Input.Group>
          </Form.Item>
          <Form.Item label="背景透明度" name="backgroundOpacity" initialValue={0.1}>
            <Slider min={0} max={1} step={0.05} marks={{ 0: '0%', 0.5: '50%', 1: '100%' }} />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="primary" htmlType="submit" loading={loading} style={{
                background: 'var(--ink-dark)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 500,
              }}>
                保存设置
              </Button>
              <Button onClick={() => {
                themeForm.resetFields();
                loadThemeConfig();
              }}>
                重置
              </Button>
            </div>
          </Form.Item>
          <div style={{ 
            marginTop: 24, 
            padding: 16, 
            background: 'var(--paper-warm)', 
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            color: 'var(--ink-light)'
          }}>
            <p style={{ margin: 0, marginBottom: 8 }}><strong>提示：</strong></p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>支持上传图片（JPG/PNG/WebP/SVG）或视频（MP4/WebM）作为背景</li>
              <li>背景透明度越高，背景越明显</li>
              <li>设置会立即生效，刷新页面后保持</li>
            </ul>
          </div>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }} className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 4 }}>个人中心</h2>
        <p style={{ color: 'var(--ink-light)', fontSize: 14, margin: 0 }}>管理您的个人信息和账号安全</p>
      </div>
      <div className="paper-card" style={{ padding: '28px 32px' }}>
        <Tabs items={tabItems} />
      </div>
    </div>
  );
}
