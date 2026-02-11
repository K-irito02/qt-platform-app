import { Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div>
      <Title level={2}>产品详情</Title>
      <Paragraph>产品标识: {slug}</Paragraph>
      <Paragraph type="secondary">产品详情页面将在业务开发阶段实现</Paragraph>
    </div>
  );
}
