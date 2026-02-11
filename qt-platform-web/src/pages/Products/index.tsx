import { Typography, Input, Select, Space, Empty } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { Search } = Input;

export default function Products() {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={2}>{t('product.allProducts')}</Title>

      <Space style={{ marginBottom: 24 }} wrap>
        <Search placeholder={t('common.search')} style={{ width: 300 }} allowClear />
        <Select defaultValue="all" style={{ width: 150 }} options={[{ value: 'all', label: '全部分类' }]} />
        <Select
          defaultValue="latest"
          style={{ width: 150 }}
          options={[
            { value: 'latest', label: '最新发布' },
            { value: 'downloads', label: '下载最多' },
            { value: 'rating', label: '评分最高' },
          ]}
        />
      </Space>

      <Empty description={t('common.noData')} style={{ marginTop: 64 }} />
    </div>
  );
}
