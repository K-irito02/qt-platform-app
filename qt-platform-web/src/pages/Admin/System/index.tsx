import { useState, useEffect } from 'react';
import { Table, Button, message, Input } from 'antd';
import { adminApi } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';

export default function AdminSystem() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getSystemConfigs();
      setData(res.data);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const handleSave = async (key: string) => {
    try {
      await adminApi.updateSystemConfig(key, editingValue);
      message.success('已保存');
      setEditingKey(null);
      loadData();
    } catch { /* handled */ }
  };

  const columns: ColumnsType<any> = [
    { title: '配置项', dataIndex: 'configKey', width: 220 },
    {
      title: '值', dataIndex: 'configValue',
      render: (v: string, record: any) => {
        if (editingKey === record.configKey) {
          return (
            <Input.TextArea value={editingValue} onChange={(e) => setEditingValue(e.target.value)}
              autoSize={{ minRows: 1, maxRows: 4 }} />
          );
        }
        return <span style={{ wordBreak: 'break-all' }}>{v}</span>;
      },
    },
    { title: '描述', dataIndex: 'description', ellipsis: true, width: 200 },
    {
      title: '操作', width: 140, fixed: 'right',
      render: (_: any, record: any) => {
        if (editingKey === record.configKey) {
          return (
            <>
              <Button size="small" type="primary" onClick={() => handleSave(record.configKey)} style={{ marginRight: 8 }}>保存</Button>
              <Button size="small" onClick={() => setEditingKey(null)}>取消</Button>
            </>
          );
        }
        return (
          <Button size="small" onClick={() => { setEditingKey(record.configKey); setEditingValue(record.configValue); }}>
            编辑
          </Button>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--ink-darkest)', marginBottom: 4 }}>系统配置</h2>
        <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: 0 }}>管理平台全局配置参数</p>
      </div>
      <Table columns={columns} dataSource={data} rowKey="configKey" loading={loading} pagination={false}
        scroll={{ x: 800 }} />
    </div>
  );
}
