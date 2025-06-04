
import { useState } from 'react'

import {  Space, Table, Button, message, Popconfirm } from 'antd'
import type { TableProps, PopconfirmProps } from 'antd'
import type { RuleGroupResponse,RuleGroupInfo } from '@/api/services/rule'

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

interface RuleTableProps {
  data: RuleGroupResponse[]
  onEdit: (record: RuleGroupResponse) => void
  onDelete: (info: RuleGroupInfo[]) => void
  onViewDetail: (ruleId: number) => void
  loading: boolean
}


export function RuleTable({ onViewDetail, data, onEdit, onDelete, loading }: RuleTableProps) {
  // 选中的行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  
  // 确认删除
  const confirmDelete = (info: RuleGroupInfo) => {
    onDelete([info])
  }

  // 取消删除
  const cancelDelete: PopconfirmProps['onCancel'] = e => {
    console.log(e)
    // message.error('取消删除')
  }

  // 查看规则组详情
  const onGroupDetail = (id: number) => {
    onViewDetail(id)
  }

  // 选中行变化
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  // 行选择配置
  const rowSelection: TableRowSelection<RuleGroupResponse> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: '选择奇数行',
        onSelect: changeableRowKeys => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
          setSelectedRowKeys(newSelectedRowKeys)
        }
      },
      {
        key: 'even',
        text: '选择偶数行',
        onSelect: changeableRowKeys => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
          setSelectedRowKeys(newSelectedRowKeys)
        }
      }
    ]
  }

  // 表格列配置
  const columns: TableProps<RuleGroupResponse>['columns'] = [
    {
      title: '规则组ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '规则组名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: '规则组描述',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '是否内置规则组',
      dataIndex: 'is_buildin',
      key: 'is_buildin'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RuleGroupResponse) => (
        <Space size="middle">
          <Button onClick={() => onGroupDetail(record.id)}>查看详情</Button>
          <Button onClick={() => onEdit(record)}>编辑</Button>
          <Popconfirm title="确定要删除吗？" description={`确定要删除 ${record.name} 吗？`} onConfirm={() => confirmDelete({ id: record.id, is_buildin: record.is_buildin })} onCancel={cancelDelete} okText="Yes" cancelText="No">
            {' '}
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return <Table<RuleGroupResponse> rowSelection={rowSelection} columns={columns} dataSource={data} loading={loading} rowKey="id" />
}

