import { Typography, Row, Col, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppstoreOutlined, DownloadOutlined, SafetyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <AppstoreOutlined style={{ fontSize: 36, color: '#1890ff' }} />,
      title: '丰富的产品库',
      desc: '浏览和发现各类 Qt 应用程序，覆盖多个平台',
    },
    {
      icon: <DownloadOutlined style={{ fontSize: 36, color: '#52c41a' }} />,
      title: '安全下载',
      desc: '所有软件包经过 SHA-256 校验，确保文件完整性',
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 36, color: '#722ed1' }} />,
      title: '自动更新',
      desc: '支持增量更新和灰度发布，保持软件始终最新',
    },
  ];

  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <Title level={1}>Qt 产品发布平台</Title>
      <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto 32px' }}>
        一站式 Qt 软件产品发布与分发平台，支持多平台、多版本管理与自动更新
      </Paragraph>
      <Button type="primary" size="large" onClick={() => navigate('/products')}>
        {t('product.allProducts')}
      </Button>

      <Row gutter={[32, 32]} style={{ marginTop: 64 }}>
        {features.map((f, i) => (
          <Col xs={24} sm={8} key={i}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <div style={{ marginBottom: 16 }}>{f.icon}</div>
              <Title level={4}>{f.title}</Title>
              <Paragraph style={{ color: '#666' }}>{f.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
