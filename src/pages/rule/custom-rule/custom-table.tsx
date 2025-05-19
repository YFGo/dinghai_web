import { Space, Table, Tag, Button, message, Popconfirm } from 'antd'
import type { TableProps, PopconfirmProps } from 'antd'

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

export interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

interface CustomTableProps {
  data: DataType[]
  selectedRowKeys: React.Key[]
  onSelectedRowKeysChange: (selectedRowKeys: React.Key[]) => void
  onDelete?: (selectedRowKeys: React.Key[]) => void
  loading?: boolean
}

export function CustomTable({ data, selectedRowKeys, onSelectedRowKeysChange, onDelete, loading = false }: CustomTableProps) {
  const confirmDelete = () => {
    if (onDelete) {
      onDelete(selectedRowKeys)
    }
  }

  const cancelDelete: PopconfirmProps['onCancel'] = e => {
    console.log(e)
    message.error('取消删除')
  }

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: '选择奇数行',
        onSelect: changeableRowKeys => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 === 0)
          onSelectedRowKeysChange(newSelectedRowKeys)
        }
      },
      {
        key: 'even',
        text: '选择偶数行',
        onSelect: changeableRowKeys => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 !== 0)
          onSelectedRowKeysChange(newSelectedRowKeys)
        }
      }
    ]
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green'
            if (tag === 'loser') {
              color = 'volcano'
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            )
          })}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button>编辑</Button>
          <Popconfirm title="确定要删除吗？" description={`确定要删除 ${record.name} 吗？`} onConfirm={confirmDelete} onCancel={cancelDelete} okText="确定" cancelText="取消" disabled={!selectedRowKeys.includes(record.key)}>
            <Button danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return <Table<DataType> rowSelection={rowSelection} columns={columns} dataSource={data} loading={loading} rowKey="key" />
}
