import { useState, useEffect } from 'react';
import { Table, Space, Tag, Button, message, Modal, Select } from 'antd';
import { adminApi } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';

export default function AdminComments() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  useEffect(() => { loadData(); }, [page, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.listComments({ page, size: 20, status: statusFilter });
      setData(res.data.records);
      setTotal(res.data.total);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const handleAudit = (id: number, status: string) => {
    Modal.confirm({
      title: `确认${status === 'PUBLISHED' ? '通过' : '拒绝'}该评论？`,
      onOk: async () => {
        try {
          await adminApi.auditComment(id, status);
          message.success('操作成功');
          loadData();
        } catch { /* handled */ }
      },
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除该评论？',
      okType: 'danger',
      onOk: async () => {
        try {
          await adminApi.deleteComment(id);
          message.success('已删除');
          loadData();
        } catch { /* handled */ }
      },
    });
  };

  const columns: ColumnsType<any> = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '评分', dataIndex: 'rating', width: 70, render: (v: number) => v ? `${v} ★` : '-' },
    { title: '产品ID', dataIndex: 'productId', width: 80 },
    { title: '用户ID', dataIndex: 'userId', width: 80 },
    {
      title: '状态', dataIndex: 'status', width: 100,
      render: (s: string) => (
        <Tag color={s === 'PUBLISHED' ? 'green' : s === 'PENDING' ? 'orange' : 'red'}>{s}</Tag>
      ),
    },
    { title: '时间', dataIndex: 'createdAt', width: 170, render: (v: string) => v?.substring(0, 19).replace('T', ' ') },
    {
      title: '操作', width: 180, fixed: 'right',
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === 'PENDING' && (
            <>
              <Button size="small" type="primary" onClick={() => handleAudit(record.id, 'PUBLISHED')}>通过</Button>
              <Button size="small" danger onClick={() => handleAudit(record.id, 'REJECTED')}>拒绝</Button>
            </>
          )}
          <Button size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--ink-darkest)', marginBottom: 4 }}>评论管理</h2>
        <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: 0 }}>审核和管理用户评论</p>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Select placeholder="状态" allowClear style={{ width: 130 }}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          options={[
            { value: 'PENDING', label: '待审核' },
            { value: 'PUBLISHED', label: '已发布' },
            { value: 'REJECTED', label: '已拒绝' },
          ]} />
      </Space>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        scroll={{ x: 900 }}
        pagination={{ current: page, total, pageSize: 20, onChange: setPage, showTotal: (t) => `共 ${t} 条` }} />
    </div>
  );
}
