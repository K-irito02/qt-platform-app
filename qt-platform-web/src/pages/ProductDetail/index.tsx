import { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, Tag, Tabs, Rate, Space, Spin, List, Avatar, Form, Input, message, Empty } from 'antd';
import { DownloadOutlined, EyeOutlined, LikeOutlined, LikeFilled, GithubOutlined, LinkOutlined, StarFilled, ClockCircleOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { productApi, commentApi } from '@/utils/api';

const { Paragraph, Text } = Typography;

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [product, setProduct] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [commentTotal, setCommentTotal] = useState(0);
  const [commentPage, setCommentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { if (slug) loadProduct(); }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res: any = await productApi.getBySlug(slug!);
      setProduct(res.data);
      if (res.data?.id) {
        loadVersions(res.data.id);
        loadComments(res.data.id, 1);
      }
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const loadVersions = async (productId: number) => {
    try {
      const res: any = await productApi.getVersions(productId);
      setVersions(res.data || []);
    } catch { /* handled */ }
  };

  const loadComments = async (productId: number, page: number) => {
    setCommentLoading(true);
    try {
      const res: any = await commentApi.getProductComments(productId, { page, size: 10 });
      setComments(res.data.records || []);
      setCommentTotal(res.data.total || 0);
      setCommentPage(page);
    } catch { /* handled */ } finally { setCommentLoading(false); }
  };

  const handleComment = async (values: any) => {
    if (!product) return;
    setSubmitting(true);
    try {
      await commentApi.create(product.id, { content: values.content, rating: values.rating });
      message.success('评论已提交，等待审核');
      form.resetFields();
      loadComments(product.id, 1);
    } catch { /* handled */ } finally { setSubmitting(false); }
  };

  const handleLike = async (commentId: number, liked: boolean) => {
    try {
      if (liked) await commentApi.unlike(commentId);
      else await commentApi.like(commentId);
      loadComments(product.id, commentPage);
    } catch { /* handled */ }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '-';
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  };

  const formatCount = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n || 0);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <Spin size="large" />
      <div style={{ marginTop: 16, color: 'var(--ink-light)', fontFamily: 'var(--font-serif)', fontSize: 14, letterSpacing: '0.1em' }}>
        墨迹渲染中...
      </div>
    </div>
  );
  if (!product) return <Empty description={<span style={{ fontFamily: 'var(--font-serif)' }}>产品不存在</span>} />;

  const latestVersion = versions.find((v: any) => v.isLatest) || versions[0];

  const tabItems = [
    {
      key: 'overview',
      label: '概述',
      children: (
        <div style={{ padding: '8px 0' }}>
          <Paragraph style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--ink-dark)' }}>
            {product.description || '暂无详细描述'}
          </Paragraph>

          {(product.homepageUrl || product.sourceUrl) && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--ink-lightest)' }}>
              <Space size={16}>
                {product.homepageUrl && (
                  <a href={product.homepageUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--indigo)' }}>
                    <LinkOutlined /> 官方网站
                  </a>
                )}
                {product.sourceUrl && (
                  <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-dark)' }}>
                    <GithubOutlined /> 源代码
                  </a>
                )}
              </Space>
            </div>
          )}

          {product.tags?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {product.tags.map((tag: string) => (
                <Tag key={tag} style={{ background: 'var(--paper-warm)', borderColor: 'var(--ink-lightest)', color: 'var(--ink-medium)', marginBottom: 4 }}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'versions',
      label: `版本 (${versions.length})`,
      children: (
        <List
          dataSource={versions}
          locale={{ emptyText: <span style={{ fontFamily: 'var(--font-serif)' }}>暂无版本</span> }}
          renderItem={(v: any) => (
            <List.Item
              actions={[
                <Button type="primary" size="small" icon={<DownloadOutlined />}
                  href={`/api/v1/downloads/${product.id}/${v.id}`}
                  style={{ background: 'var(--ink-dark)', border: 'none', borderRadius: 'var(--radius-sm)' }}>
                  下载 ({formatSize(v.fileSize)})
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong style={{ fontFamily: 'var(--font-serif)' }}>{v.versionNumber}</Text>
                    <Tag style={{ background: 'var(--paper-warm)', borderColor: 'var(--ink-lightest)' }}>{v.platform}</Tag>
                    {v.architecture && <Tag style={{ background: 'transparent', borderColor: 'var(--ink-lightest)' }}>{v.architecture}</Tag>}
                    {v.isLatest && <Tag color="green">最新</Tag>}
                    {v.isMandatory && <Tag color="red">强制</Tag>}
                  </Space>
                }
                description={<span style={{ color: 'var(--ink-medium)' }}>{v.releaseNotes || '无更新说明'}</span>}
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'comments',
      label: `${t('product.comments')} (${commentTotal})`,
      children: (
        <div>
          {isAuthenticated && (
            <div className="paper-card" style={{ padding: '20px 24px', marginBottom: 20 }}>
              <Form form={form} onFinish={handleComment}>
                <Form.Item name="rating" label={<span style={{ fontFamily: 'var(--font-serif)' }}>评分</span>}>
                  <Rate />
                </Form.Item>
                <Form.Item name="content" rules={[{ required: true, message: '请输入评论' }]}>
                  <Input.TextArea rows={3} placeholder="写下你的评论..." maxLength={2000} showCount style={{ borderRadius: 'var(--radius-md)' }} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" loading={submitting} style={{
                    background: 'var(--ink-dark)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 500,
                  }}>
                    提交评论
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
          {!isAuthenticated && (
            <div className="paper-card" style={{ padding: '16px 24px', marginBottom: 20, textAlign: 'center' }}>
              <Link to="/login" style={{ color: 'var(--cinnabar)', fontFamily: 'var(--font-serif)' }}>登录后发表评论</Link>
            </div>
          )}
          <List
            loading={commentLoading}
            dataSource={comments}
            locale={{ emptyText: <span style={{ fontFamily: 'var(--font-serif)' }}>暂无评论</span> }}
            pagination={commentTotal > 10 ? {
              current: commentPage, total: commentTotal, pageSize: 10,
              onChange: (p) => loadComments(product.id, p),
            } : false}
            renderItem={(c: any) => (
              <List.Item
                actions={[
                  isAuthenticated ? (
                    <Button type="text" size="small"
                      icon={c.liked ? <LikeFilled style={{ color: 'var(--cinnabar)' }} /> : <LikeOutlined />}
                      onClick={() => handleLike(c.id, c.liked)}>
                      {c.likeCount || 0}
                    </Button>
                  ) : <Text type="secondary"><LikeOutlined /> {c.likeCount || 0}</Text>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: 'var(--ink-lighter)', fontFamily: 'var(--font-serif)' }}>
                      {(c.nickname || c.username || '?')[0]}
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong>{c.nickname || c.username || `用户${c.userId}`}</Text>
                      {c.rating && <Rate disabled defaultValue={c.rating} style={{ fontSize: 13 }} />}
                    </Space>
                  }
                  description={
                    <div>
                      <Paragraph style={{ marginBottom: 4, color: 'var(--ink-dark)' }}>{c.content}</Paragraph>
                      <Text style={{ fontSize: 12, color: 'var(--ink-lighter)' }}>
                        <ClockCircleOutlined /> {c.createdAt?.substring(0, 19).replace('T', ' ')}
                      </Text>
                      {c.replies?.length > 0 && (
                        <div style={{ marginTop: 10, paddingLeft: 16, borderLeft: '2px solid var(--ink-lightest)' }}>
                          {c.replies.map((r: any) => (
                            <div key={r.id} style={{ marginBottom: 8 }}>
                              <Text strong style={{ color: 'var(--cinnabar)', fontSize: 13 }}>{r.nickname || `用户${r.userId}`}</Text>
                              <Text style={{ color: 'var(--ink-dark)', fontSize: 13 }}>: {r.content}</Text>
                              <br />
                              <Text style={{ fontSize: 11, color: 'var(--ink-lighter)' }}>{r.createdAt?.substring(0, 19).replace('T', ' ')}</Text>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <Row gutter={[32, 24]}>
        {/* 左侧主内容 */}
        <Col xs={24} md={16}>
          {/* 产品头部 */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
            {product.iconUrl ? (
              <img src={product.iconUrl} alt={product.name} style={{
                width: 80, height: 80, borderRadius: 16, objectFit: 'cover',
                border: '1px solid var(--ink-lightest)', flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 80, height: 80, borderRadius: 16, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--paper-warm), var(--paper-cream))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, color: 'var(--ink-lighter)', fontFamily: 'var(--font-serif)',
                border: '1px solid var(--ink-lightest)', fontWeight: 600,
              }}>
                {(product.name || 'Q')[0]}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700,
                color: 'var(--ink-darkest)', marginBottom: 8, letterSpacing: '0.04em',
              }}>
                {product.name}
              </h1>
              <Space wrap>
                {product.categoryName && (
                  <Tag style={{ background: 'var(--paper-warm)', borderColor: 'var(--ink-lightest)', color: 'var(--ink-medium)' }}>
                    {product.categoryName}
                  </Tag>
                )}
                {product.license && (
                  <Tag style={{ background: 'transparent', borderColor: 'var(--indigo)', color: 'var(--indigo)' }}>
                    {product.license}
                  </Tag>
                )}
                {product.isFeatured && <Tag color="gold">精选</Tag>}
              </Space>
            </div>
          </div>

          <div className="paper-card" style={{ padding: '4px 24px 16px' }}>
            <Tabs items={tabItems} defaultActiveKey="overview" />
          </div>
        </Col>

        {/* 右侧信息栏 */}
        <Col xs={24} md={8}>
          {/* 下载卡片 */}
          <div className="paper-card" style={{ padding: '24px', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginBottom: 16, color: 'var(--ink-darkest)' }}>
              <DownloadOutlined /> 下载
            </h3>
            {latestVersion ? (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'var(--ink-light)' }}>版本</Text>
                    <Text strong>{latestVersion.versionNumber}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'var(--ink-light)' }}>平台</Text>
                    <Text>{latestVersion.platform} {latestVersion.architecture && `(${latestVersion.architecture})`}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'var(--ink-light)' }}>大小</Text>
                    <Text>{formatSize(latestVersion.fileSize)}</Text>
                  </div>
                </div>
                <Button type="primary" size="large" block icon={<DownloadOutlined />}
                  href={`/api/v1/downloads/${product.id}/${latestVersion.id}`}
                  style={{
                    height: 48, fontWeight: 600, fontSize: 15,
                    background: 'var(--ink-dark)', border: 'none', borderRadius: 'var(--radius-md)',
                  }}>
                  {t('product.download')}
                </Button>
              </div>
            ) : (
              <Text style={{ color: 'var(--ink-light)' }}>暂无可下载版本</Text>
            )}
          </div>

          {/* 信息卡片 */}
          <div className="paper-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginBottom: 16, color: 'var(--ink-darkest)' }}>
              产品信息
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'var(--ink-light)' }}><DownloadOutlined /> 下载量</Text>
                <Text strong>{formatCount(product.downloadCount)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'var(--ink-light)' }}><StarFilled style={{ color: 'var(--gamboge)' }} /> 评分</Text>
                {product.ratingAverage > 0 ? (
                  <Space size={4}>
                    <Rate disabled defaultValue={product.ratingAverage} style={{ fontSize: 13 }} />
                    <Text style={{ color: 'var(--ink-light)', fontSize: 12 }}>({product.ratingCount})</Text>
                  </Space>
                ) : <Text style={{ color: 'var(--ink-lighter)' }}>暂无</Text>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'var(--ink-light)' }}><EyeOutlined /> 浏览量</Text>
                <Text>{formatCount(product.viewCount)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'var(--ink-light)' }}><ClockCircleOutlined /> 发布时间</Text>
                <Text>{product.publishedAt?.substring(0, 10) || '-'}</Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
