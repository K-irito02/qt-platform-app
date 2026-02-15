import { useState, useEffect } from 'react';
import { Table, Space, Button, message, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { categoryApi, adminApi } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';

export default function AdminCategories() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await categoryApi.getAll();
      setData(flattenCategories(res.data));
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const flattenCategories = (cats: any[], depth = 0): any[] => {
    const result: any[] = [];
    for (const cat of cats) {
      result.push({ ...cat, depth });
      if (cat.children?.length) {
        result.push(...flattenCategories(cat.children, depth + 1));
      }
    }
    return result;
  };

  const openCreate = () => { setEditing(null); form.resetFields(); setModalVisible(true); };
  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name, nameEn: record.nameEn, slug: record.slug, sortOrder: record.sortOrder, icon: record.icon });
    setModalVisible(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await adminApi.updateCategory(editing.id, values);
        message.success('已更新');
      } else {
        await adminApi.createCategory(values);
        message.success('已创建');
      }
      setModalVisible(false);
      loadData();
    } catch { /* handled */ }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除该分类？',
      okType: 'danger',
      onOk: async () => {
        try {
          await adminApi.deleteCategory(id);
          message.success('已删除');
          loadData();
        } catch { /* handled */ }
      },
    });
  };

  const columns: ColumnsType<any> = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: '名称', dataIndex: 'name',
      render: (v: string, r: any) => <span style={{ paddingLeft: r.depth * 20 }}>{r.icon ? `${r.icon} ` : ''}{v}</span>,
    },
    { title: '英文名', dataIndex: 'nameEn', ellipsis: true },
    { title: 'Slug', dataIndex: 'slug', width: 140 },
    { title: '排序', dataIndex: 'sortOrder', width: 70 },
    {
      title: '操作', width: 150, fixed: 'right',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button size="small" onClick={() => openEdit(record)}>编辑</Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--ink-darkest)', marginBottom: 4 }}>分类管理</h2>
          <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: 0 }}>管理产品分类体系</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: 'var(--ink-dark)', border: 'none', borderRadius: 'var(--radius-md)' }}>新建分类</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} scroll={{ x: 700 }} />

      <Modal title={editing ? '编辑分类' : '新建分类'} open={modalVisible}
        onOk={handleSave} onCancel={() => setModalVisible(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="英文名" name="nameEn"><Input /></Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true, message: '请输入标识' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="图标" name="icon"><Input placeholder="emoji 或图标名" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
