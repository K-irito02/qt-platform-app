import { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Slider, Upload, message, Card } from 'antd';
import { UploadOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { adminApi, fileApi } from '@/utils/api';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSystemConfig } from '@/store/slices/themeSlice';

export default function AdminTheme() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((s) => s.theme.currentTheme);

  useEffect(() => {
    loadThemeConfig();
  }, []);

  const loadThemeConfig = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getGlobalTheme();
      if (res.data.themeConfig) {
        const config = JSON.parse(res.data.themeConfig);
        form.setFieldsValue({
          backgroundType: config.background?.type || 'image',
          backgroundUrl: config.background?.url || '',
          backgroundOpacity: config.background?.opacity || 0.1,
          primaryColor: config.ink?.primaryColor || '#8B0000',
          strokeWidth: config.ink?.strokeWidth || '2px',
          fontFamily: config.ink?.fontFamily || '"Ma Shan Zheng", cursive',
        });
      }
    } catch {
      message.error('加载主题配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const res: any = await fileApi.upload(file, 'theme');
      const url = res.data.url;
      form.setFieldValue('backgroundUrl', url);
      message.success('文件上传成功');
      return url;
    } catch {
      message.error('文件上传失败');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (values: any) => {
    setLoading(true);
    try {
      const themeConfig = {
        background: {
          type: values.backgroundType,
          url: values.backgroundUrl,
          opacity: values.backgroundOpacity,
          overlay: currentTheme.background.overlay,
        },
        ink: {
          primaryColor: values.primaryColor,
          strokeWidth: values.strokeWidth,
          fontFamily: values.fontFamily,
        },
      };
      await adminApi.updateGlobalTheme(JSON.stringify(themeConfig));
      dispatch(setSystemConfig(themeConfig));
      message.success('全局主题配置已保存');
    } catch {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--ink-darkest)', marginBottom: 4 }}>
          主题管理
        </h2>
        <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: 0 }}>
          配置全局默认主题，影响所有未自定义主题的用户
        </p>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={onSave} style={{ maxWidth: 800 }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--ink-dark)', marginBottom: 16 }}>
            背景设置
          </h3>
          
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

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--ink-dark)', marginTop: 32, marginBottom: 16 }}>
            水墨风格设置
          </h3>

          <Form.Item label="主色调" name="primaryColor" initialValue="#8B0000">
            <Input type="color" style={{ width: 120 }} />
          </Form.Item>

          <Form.Item label="笔画宽度" name="strokeWidth" initialValue="2px">
            <Input placeholder="例如: 2px" style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="字体" name="fontFamily" initialValue='"Ma Shan Zheng", cursive'>
            <Input placeholder='例如: "Ma Shan Zheng", cursive' />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                保存配置
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => {
                form.resetFields();
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
            <p style={{ margin: 0, marginBottom: 8 }}><strong>说明：</strong></p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>全局主题配置会作为所有用户的默认主题</li>
              <li>用户可以在个人设置中覆盖全局配置</li>
              <li>配置优先级：用户配置 &gt; 全局配置 &gt; 系统默认</li>
              <li>修改后立即生效，影响所有未自定义主题的用户</li>
            </ul>
          </div>
        </Form>
      </Card>
    </div>
  );
}
