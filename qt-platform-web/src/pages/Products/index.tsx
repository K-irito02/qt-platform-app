import { useState, useEffect } from 'react';
import { Typography, Input, Select, Space, Row, Col, Card, Tag, Spin, Empty, Pagination } from 'antd';
import { DownloadOutlined, EyeOutlined, StarFilled, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productApi, categoryApi } from '@/utils/api';

const { Paragraph, Text } = Typography;
const { Search } = Input;

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page')) || 1;
  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : undefined;
  const sort = searchParams.get('sort') || 'latest';
  const keyword = searchParams.get('q') || '';

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadProducts(); }, [page, categoryId, sort, keyword]);

  const loadCategories = async () => {
    try {
      const res: any = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch { /* handled */ }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res: any = await productApi.list({ page, size: 12, categoryId, sort: sort === 'latest' ? undefined : sort, keyword: keyword || undefined });
      setProducts(res.data.records || []);
      setTotal(res.data.total || 0);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k);
    });
    if (updates.page === undefined && !('page' in updates)) params.set('page', '1');
    setSearchParams(params);
  };

  const formatCount = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n || 0);
  };

  const categoryOptions = [
    { value: '', label: t('product.allCategories') || '全部分类' },
    ...categories.map((c: any) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div className="animate-fade-in ink-bg-pattern">
      {/* 页面标题 */}
      <div style={{ marginBottom: 36 }}>
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 8 }}>
          {t('product.allProducts') || '全部产品'}
        </h2>
        <p style={{
          color: 'var(--ink-light)',
          fontSize: 14,
          fontFamily: 'var(--font-sans)',
          margin: 0,
        }}>
          {t('product.browseDesc') || '浏览和发现各类优质 Qt 应用程序'}
        </p>
      </div>

      {/* 筛选栏 — 水墨风格 */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
        padding: '16px 20px',
        background: 'var(--paper-warm)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--ink-lightest)',
        alignItems: 'center',
      }}>
        <Search
          placeholder={t('common.search') || '搜索产品...'}
          defaultValue={keyword}
          style={{ width: 260 }}
          allowClear
          prefix={<SearchOutlined style={{ color: 'var(--ink-lighter)' }} />}
          onSearch={(v) => updateParams({ q: v || undefined, page: '1' })}
        />
        <Select
          value={categoryId ? String(categoryId) : ''}
          style={{ width: 140 }}
          options={categoryOptions}
          onChange={(v) => updateParams({ category: v || undefined, page: '1' })}
        />
        <Select
          value={sort}
          style={{ width: 140 }}
          onChange={(v) => updateParams({ sort: v, page: '1' })}
          options={[
            { value: 'latest', label: t('product.sortLatest') || '最新发布' },
            { value: 'downloads', label: t('product.sortDownloads') || '下载最多' },
            { value: 'rating', label: t('product.sortRating') || '评分最高' },
            { value: 'name', label: t('product.sortName') || '名称排序' },
          ]}
        />
        {total > 0 && (
          <Text style={{ color: 'var(--ink-light)', fontSize: 13, marginLeft: 'auto' }}>
            共 <Text strong>{total}</Text> 个产品
          </Text>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: 'var(--ink-light)', fontFamily: 'var(--font-serif)', fontSize: 14, letterSpacing: '0.1em' }}>
            墨迹渲染中...
          </div>
        </div>
      ) : products.length === 0 ? (
        <Empty
          description={<span style={{ color: 'var(--ink-light)', fontFamily: 'var(--font-serif)' }}>{t('common.noData') || '暂无产品'}</span>}
          style={{ marginTop: 64, marginBottom: 64 }}
        />
      ) : (
        <>
          <Row gutter={[20, 20]}>
            {products.map((p: any, i: number) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/products/${p.slug}`)}
                  className={`animate-fade-in-up stagger-${Math.min(i % 4 + 1, 4)}`}
                  styles={{ body: { padding: '20px 16px' } }}
                  style={{ height: '100%', overflow: 'hidden' }}
                  cover={
                    <div style={{
                      height: 130,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--paper-warm) 0%, var(--paper-cream) 100%)',
                      borderBottom: '1px solid var(--ink-lightest)',
                      position: 'relative',
                    }}>
                      {p.iconUrl ? (
                        <img
                          src={p.iconUrl}
                          alt={p.name}
                          style={{ maxHeight: 80, maxWidth: '70%', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
                        />
                      ) : (
                        <div style={{
                          width: 72,
                          height: 72,
                          borderRadius: 16,
                          background: 'var(--paper-white)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 32,
                          color: 'var(--ink-lighter)',
                          fontFamily: 'var(--font-serif)',
                          border: '1px solid var(--ink-lightest)',
                          fontWeight: 600,
                        }}>
                          {(p.name || 'Q')[0]}
                        </div>
                      )}
                      {p.isFeatured && (
                        <Tag
                          color="gold"
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: 11,
                            margin: 0,
                            border: 'none',
                          }}
                        >
                          精选
                        </Tag>
                      )}
                    </div>
                  }
                >
                  {/* 产品名 */}
                  <Text strong ellipsis style={{
                    display: 'block',
                    fontSize: 15,
                    fontFamily: 'var(--font-serif)',
                    marginBottom: 4,
                    color: 'var(--ink-darkest)',
                  }}>
                    {p.name}
                  </Text>

                  {/* 分类标签 */}
                  {p.categoryName && (
                    <Tag style={{
                      background: 'transparent',
                      borderColor: 'var(--ink-lightest)',
                      color: 'var(--ink-light)',
                      fontSize: 11,
                      marginBottom: 8,
                    }}>
                      {p.categoryName}
                    </Tag>
                  )}

                  {/* 描述 */}
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ color: 'var(--ink-medium)', fontSize: 13, marginBottom: 12, minHeight: 40, lineHeight: 1.6 }}
                  >
                    {p.description || '暂无描述'}
                  </Paragraph>

                  {/* 统计 */}
                  <div style={{ borderTop: '1px solid var(--ink-lightest)', paddingTop: 10 }}>
                    <Space split={<span style={{ color: 'var(--ink-lightest)' }}>·</span>}>
                      <Text style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                        <DownloadOutlined /> {formatCount(p.downloadCount)}
                      </Text>
                      {p.ratingAverage > 0 && (
                        <Text style={{ fontSize: 12, color: 'var(--gamboge)' }}>
                          <StarFilled /> {p.ratingAverage.toFixed(1)}
                        </Text>
                      )}
                      <Text style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                        <EyeOutlined /> {formatCount(p.viewCount)}
                      </Text>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {total > 12 && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Pagination
                current={page}
                total={total}
                pageSize={12}
                onChange={(p) => updateParams({ page: String(p) })}
                showTotal={(t) => <span style={{ color: 'var(--ink-light)', fontFamily: 'var(--font-serif)' }}>共 {t} 个产品</span>}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
