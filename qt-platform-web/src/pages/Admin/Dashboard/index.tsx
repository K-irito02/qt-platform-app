import { useState, useEffect } from 'react';
import { Row, Col, Statistic, Spin } from 'antd';
import { UserOutlined, AppstoreOutlined, CommentOutlined, DownloadOutlined, RiseOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { adminApi } from '@/utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res: any = await adminApi.getDashboardStats();
      setStats(res.data);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <Spin size="large" />
      <div style={{ marginTop: 12, color: 'var(--ink-light)', fontFamily: 'var(--font-serif)' }}>数据加载中...</div>
    </div>
  );

  const statCards = [
    { title: '用户总数', value: stats?.totalUsers || 0, icon: <UserOutlined />, color: 'var(--indigo)' },
    { title: '产品总数', value: stats?.totalProducts || 0, icon: <AppstoreOutlined />, color: 'var(--celadon)' },
    { title: '总下载量', value: stats?.totalDownloads || 0, icon: <DownloadOutlined />, color: 'var(--gamboge)' },
    { title: '总评论数', value: stats?.totalComments || 0, icon: <CommentOutlined />, color: 'var(--cinnabar)' },
    { title: '今日新增用户', value: stats?.newUsersToday || 0, icon: <RiseOutlined />, color: 'var(--indigo)' },
    { title: '今日下载量', value: stats?.downloadsToday || 0, icon: <CloudDownloadOutlined />, color: 'var(--celadon)' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ink-darkest)', marginBottom: 4 }}>
          仪表盘
        </h2>
        <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: 0 }}>平台运营数据概览</p>
      </div>

      <Row gutter={[16, 16]}>
        {statCards.map((card, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <div className="paper-card" style={{
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `color-mix(in srgb, ${card.color} 12%, transparent)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: card.color,
              }}>
                {card.icon}
              </div>
              <Statistic title={<span style={{ color: 'var(--ink-light)', fontSize: 13 }}>{card.title}</span>} value={card.value} />
            </div>
          </Col>
        ))}
      </Row>

      {stats?.downloadTrend && (
        <div className="paper-card" style={{ padding: '24px', marginTop: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--ink-darkest)', marginBottom: 16 }}>
            近 7 日下载趋势
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {stats.downloadTrend.map((d: any, i: number) => {
              const max = Math.max(...stats.downloadTrend.map((t: any) => t.count));
              const h = max > 0 ? (d.count / max) * 100 : 0;
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-light)', marginBottom: 4 }}>{d.count}</div>
                  <div style={{
                    height: h,
                    background: 'linear-gradient(to top, var(--ink-lighter), var(--ink-lightest))',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease',
                    minHeight: 4,
                  }} />
                  <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 4 }}>{d.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
