import { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DownloadOutlined,
  ArrowRightOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { productApi } from '@/utils/api';
import mountainsSvg from '@/assets/ink/mountains.svg';

const { Title, Paragraph, Text } = Typography;

/**
 * 首页 - 册页构图
 * 设计要求：去工业化、水墨交互、大量留白、印章点缀
 */
export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const res: any = await productApi.getFeatured();
      setFeatured((res.data || []).slice(0, 4));
    } catch { /* handled */ }
  };

  // 平台特性 - 使用水墨意象
  const features = [
    {
      glyph: '品',
      title: t('home.featureProducts') || '丰富产品',
      desc: t('home.featureProductsDesc') || '海量 Qt 应用程序，满足多种需求',
    },
    {
      glyph: '安',
      title: t('home.featureSecurity') || '安全可靠',
      desc: t('home.featureSecurityDesc') || '严格代码审核，保障软件质量',
    },
    {
      glyph: '迅',
      title: t('home.featureUpdate') || '快速更新',
      desc: t('home.featureUpdateDesc') || '自动检测更新，一键升级新版',
    },
    {
      glyph: '创',
      title: t('home.featureDev') || '开发者友好',
      desc: t('home.featureDevDesc') || '便捷发布流程，专业技术支持',
    },
  ];

  const formatCount = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n || 0);
  };

  return (
    <div style={{ 
      background: 'var(--paper-white)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ===== 背景层：淡墨山水 ===== */}
      <img 
        src={mountainsSvg} 
        alt=""
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          opacity: 0.7,
        }}
      />

      {/* ===== 英雄区 — 立轴构图 ===== */}
      <section style={{ 
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
      }}>
        {/* 天头留白装饰线 */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--ink-lightest), transparent)',
        }} />

        <div 
          className="ink-reveal"
          style={{ 
            textAlign: 'center',
            maxWidth: 680,
            position: 'relative',
          }}
        >
          {/* 引首 - 右上角竖排 */}
          <div style={{
            position: 'absolute',
            top: -40,
            right: -80,
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
            letterSpacing: '0.6em',
            color: 'var(--ink-lighter)',
            opacity: 0.5,
          }}>
            墨韵悠然
          </div>

          {/* 朱砂印章 */}
          <div style={{
            width: 72,
            height: 72,
            margin: '0 auto 32px',
            border: '3px solid var(--cinnabar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--cinnabar)',
            transform: 'rotate(-5deg)',
            boxShadow: '0 4px 30px rgba(192, 57, 43, 0.15)',
            background: 'var(--paper-white)',
          }}>
            墨
          </div>

          {/* 主标题 - 榜书 */}
          <Title level={1} style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 52,
            marginBottom: 0,
            letterSpacing: '0.15em',
            fontWeight: 700,
            color: 'var(--ink-darkest)',
            lineHeight: 1.3,
          }}>
            {t('home.title') || 'Qt 产品发布平台'}
          </Title>

          {/* 毛笔横划装饰 */}
          <div style={{
            width: 80,
            height: 4,
            background: 'linear-gradient(90deg, var(--cinnabar) 0%, var(--cinnabar) 60%, transparent 100%)',
            margin: '24px auto 28px',
            opacity: 0.8,
          }} />

          {/* 副标题 */}
          <Paragraph style={{
            fontSize: 18,
            color: 'var(--ink-medium)',
            maxWidth: 480,
            margin: '0 auto 16px',
            lineHeight: 2,
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.08em',
          }}>
            {t('home.subtitle') || '一站式 Qt 软件产品发布与分发平台'}
          </Paragraph>
          <Paragraph style={{
            fontSize: 15,
            color: 'var(--ink-light)',
            margin: '0 auto 48px',
            letterSpacing: '0.05em',
          }}>
            {t('home.subtitleLine2') || '支持多平台、多版本管理与自动更新'}
          </Paragraph>

          {/* 印章式按钮 */}
          <Space size={20}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/products')}
              style={{
                height: 54,
                padding: '0 40px',
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: '0.15em',
                background: 'var(--ink-darkest)',
                border: 'none',
                boxShadow: '0 6px 30px rgba(26, 26, 46, 0.25)',
              }}
            >
              {t('home.browseProducts') || '浏览产品'}
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/register')}
              style={{
                height: 54,
                padding: '0 36px',
                fontSize: 17,
                fontWeight: 500,
                letterSpacing: '0.1em',
                border: '2px solid var(--ink-lighter)',
                color: 'var(--ink-dark)',
                background: 'transparent',
              }}
            >
              {t('home.developerJoin') || '开发者入驻'}
            </Button>
          </Space>

          {/* 落款 */}
          <div style={{
            marginTop: 60,
            fontFamily: 'var(--font-serif)',
            fontSize: 13,
            color: 'var(--ink-lighter)',
            letterSpacing: '0.1em',
            fontStyle: 'italic',
          }}>
            — 墨分五色 · 意在笔先 —
          </div>
        </div>

        {/* 地脚留白装饰线 */}
        <div style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '30%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--ink-lightest), transparent)',
        }} />
      </section>

      {/* ===== 平台特性 — 册页构图 ===== */}
      <section style={{
        position: 'relative',
        padding: '100px 24px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(245, 241, 235, 0.5) 50%, transparent 100%)',
      }}>
        {/* 中缝线（册页感） */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 60,
          bottom: 60,
          width: 1,
          background: 'linear-gradient(180deg, transparent, var(--ink-lightest), transparent)',
          opacity: 0.6,
        }} />

        {/* 标题 - 题签 */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 64,
          position: 'relative',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--ink-darkest)',
            letterSpacing: '0.12em',
            marginBottom: 12,
            display: 'inline-block',
            position: 'relative',
          }}>
            {t('home.features') || '平台特性'}
            {/* 题签印章 */}
            <span style={{
              position: 'absolute',
              top: -8,
              right: -40,
              width: 28,
              height: 28,
              border: '1.5px solid var(--cinnabar)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: 11,
              color: 'var(--cinnabar)',
              transform: 'rotate(8deg)',
              opacity: 0.7,
            }}>
              特
            </span>
          </h2>
          <p style={{
            color: 'var(--ink-light)',
            fontSize: 15,
            letterSpacing: '0.06em',
          }}>
            {t('home.featuresDesc') || '为 Qt 开发者提供专业的软件分发服务'}
          </p>
        </div>

        {/* 特性卡片 - 册页散页 */}
        <Row gutter={[40, 40]} style={{ maxWidth: 1100, margin: '0 auto' }}>
          {features.map((f, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <div
                className={`ink-reveal ink-reveal-delay-${i + 1} ink-hover-spread`}
                style={{
                  background: 'var(--paper-white)',
                  padding: '44px 28px 36px',
                  textAlign: 'center',
                  position: 'relative',
                  height: '100%',
                  cursor: 'default',
                  boxShadow: '0 2px 20px rgba(26, 26, 46, 0.04)',
                  transition: 'all 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(26, 26, 46, 0.08)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 20px rgba(26, 26, 46, 0.04)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* 水墨印章图标 */}
                <div style={{
                  width: 56,
                  height: 56,
                  margin: '0 auto 24px',
                  border: '2px solid var(--ink-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--ink-dark)',
                  transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 3}deg)`,
                }}>
                  {f.glyph}
                </div>

                <Title level={4} style={{
                  fontFamily: 'var(--font-serif)',
                  marginBottom: 12,
                  fontSize: 19,
                  letterSpacing: '0.08em',
                  color: 'var(--ink-darkest)',
                }}>
                  {f.title}
                </Title>

                <Paragraph style={{
                  color: 'var(--ink-medium)',
                  marginBottom: 0,
                  fontSize: 14,
                  lineHeight: 1.9,
                  letterSpacing: '0.02em',
                }}>
                  {f.desc}
                </Paragraph>

                {/* 落款小印 */}
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  width: 16,
                  height: 16,
                  border: '1px solid var(--cinnabar)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  color: 'var(--cinnabar)',
                  transform: 'rotate(-5deg)',
                  opacity: 0.5,
                }}>
                  {i + 1}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* ===== 精选产品 ===== */}
      {featured.length > 0 && (
        <section style={{
          position: 'relative',
          padding: '100px 24px',
        }}>
          {/* 标题 */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 64,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 32,
              fontWeight: 600,
              color: 'var(--ink-darkest)',
              letterSpacing: '0.12em',
              marginBottom: 12,
              display: 'inline-block',
              position: 'relative',
            }}>
              {t('home.featuredProducts') || '精选推荐'}
              <span style={{
                position: 'absolute',
                top: -8,
                right: -40,
                width: 28,
                height: 28,
                border: '1.5px solid var(--cinnabar)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontSize: 11,
                color: 'var(--cinnabar)',
                transform: 'rotate(-6deg)',
                opacity: 0.7,
              }}>
                选
              </span>
            </h2>
            <p style={{
              color: 'var(--ink-light)',
              fontSize: 15,
              letterSpacing: '0.06em',
            }}>
              {t('home.featuredDesc') || '精心挑选的优质 Qt 应用程序'}
            </p>
          </div>

          {/* 产品卡片 */}
          <Row gutter={[32, 32]} style={{ maxWidth: 1100, margin: '0 auto' }}>
            {featured.map((p: any, i: number) => (
              <Col xs={24} sm={12} lg={6} key={p.id}>
                <div
                  className={`ink-reveal ink-reveal-delay-${i + 1} ink-hover-spread`}
                  onClick={() => navigate(`/products/${p.slug}`)}
                  style={{
                    background: 'var(--paper-white)',
                    padding: '32px 24px 28px',
                    cursor: 'pointer',
                    height: '100%',
                    position: 'relative',
                    boxShadow: '0 2px 20px rgba(26, 26, 46, 0.04)',
                    transition: 'all 0.4s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(26, 26, 46, 0.1)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 20px rgba(26, 26, 46, 0.04)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {/* 产品图标 */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: 20,
                  }}>
                    {p.iconUrl ? (
                      <img
                        src={p.iconUrl}
                        alt={p.name}
                        style={{
                          width: 72,
                          height: 72,
                          objectFit: 'cover',
                          border: '1px solid var(--ink-lightest)',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 72,
                        height: 72,
                        background: 'linear-gradient(135deg, var(--paper-warm), var(--paper-cream))',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        color: 'var(--ink-light)',
                        border: '1px solid var(--ink-lightest)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 600,
                      }}>
                        {(p.name || 'Q')[0]}
                      </div>
                    )}
                  </div>

                  {/* 产品名 */}
                  <Title level={5} style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    fontFamily: 'var(--font-serif)',
                    fontSize: 17,
                    letterSpacing: '0.05em',
                    color: 'var(--ink-darkest)',
                  }}>
                    {p.name}
                  </Title>

                  {/* 描述 */}
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                      color: 'var(--ink-medium)',
                      fontSize: 13,
                      textAlign: 'center',
                      marginBottom: 16,
                      minHeight: 44,
                      lineHeight: 1.7,
                    }}
                  >
                    {p.description || '暂无描述'}
                  </Paragraph>

                  {/* 统计信息 */}
                  <div style={{
                    textAlign: 'center',
                    paddingTop: 16,
                    borderTop: '1px solid rgba(26, 26, 46, 0.06)',
                  }}>
                    <Space size={16}>
                      <Text style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                        <DownloadOutlined style={{ marginRight: 4 }} />
                        {formatCount(p.downloadCount)}
                      </Text>
                      {p.ratingAverage > 0 && (
                        <Text style={{ fontSize: 12, color: 'var(--gamboge)' }}>
                          <StarFilled style={{ marginRight: 4 }} />
                          {p.ratingAverage.toFixed(1)}
                        </Text>
                      )}
                    </Space>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* 查看全部 */}
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Button
              type="text"
              size="large"
              onClick={() => navigate('/products')}
              style={{
                color: 'var(--ink-dark)',
                fontFamily: 'var(--font-serif)',
                fontSize: 16,
                letterSpacing: '0.08em',
                padding: '12px 32px',
                height: 'auto',
                border: '1px solid var(--ink-lightest)',
              }}
            >
              {t('home.viewAll') || '查看全部产品'} <ArrowRightOutlined style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </section>
      )}

      {/* ===== 底部装饰 ===== */}
      <section style={{
        position: 'relative',
        padding: '60px 24px 80px',
        textAlign: 'center',
      }}>
        {/* 装饰线 */}
        <div style={{
          width: 120,
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--ink-lighter), transparent)',
          margin: '0 auto 32px',
        }} />

        {/* 闲章 */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 14,
            color: 'var(--ink-lighter)',
            letterSpacing: '0.15em',
          }}>
            Qt 产品发布平台
          </span>
          <div style={{
            width: 32,
            height: 32,
            border: '1.5px solid var(--cinnabar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: 14,
            color: 'var(--cinnabar)',
            transform: 'rotate(-5deg)',
            opacity: 0.6,
          }}>
            印
          </div>
        </div>
      </section>
    </div>
  );
}
