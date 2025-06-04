import { useState } from 'react'
import { Space, Table, Button, Popconfirm } from 'antd'
import type { TableProps, PopconfirmProps } from 'antd'

// 操作按钮类型
export type TableActionButton<T = any> = {
  text: string
  type?: 'default' | 'primary' | 'dashed' | 'text' | 'link'
  danger?: boolean
  onClick?: (record: T) => void
  confirm?: {
    title: string
    description?: string
    onConfirm: (record: T) => void
    onCancel?: PopconfirmProps['onCancel']
  }
  visible?: (record: T) => boolean
}

// 表格列配置
export type TableColumnConfig<T = any> = {
  title: string
  dataIndex: string
  key?: string
  render?: (text: any, record: T, index: number) => React.ReactNode
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  ellipsis?: boolean
} & Record<string, any>

// 表格组件Props
export interface wafTableProps<T extends object = any> {
  data: T[]
  columns: TableColumnConfig<T>[]
  loading?: boolean
  rowKey?: string | ((record: T) => string)
  showRowSelection?: boolean
  rowSelection?: TableProps<T>['rowSelection']
  actionButtons?: TableActionButton<T>[]
  pagination?: TableProps<T>['pagination']
  scroll?: TableProps<T>['scroll']
  onRow?: TableProps<T>['onRow']
  className?: string
  style?: React.CSSProperties
}

// onRow: 自定义行属性或事件处理函数，比如可以添加点击行的事件
// showRowSelection: 是否显示行选择功能（复选框列，默认false）
// rowSelection (propRowSelection): 行选择的配置对象，可以自定义选择行为
// actionButtons: 操作按钮配置数组，会在表格右侧生成操作列（如编辑、删除等按钮）
// pagination: 分页配置（默认false表示不分页），可以设置为true使用默认分页或传入分页配置对象
// scroll: 表格滚动区域的配置，可以设置横向/纵向滚动
// className: 自定义表格容器的类名
// style: 自定义表格容器的内联样式
// T extends object = any: 泛型参数，表示表格数据项的类型，默认是任意对象类型

export function wafTable<T extends object = any>({ data, columns: propColumns, loading = false, rowKey = 'id', showRowSelection = false, rowSelection: propRowSelection, actionButtons = [], pagination = false, scroll, onRow, className, style }: wafTableProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 行选择回调
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const defaultRowSelection: TableProps<T>['rowSelection'] = {
    selectedRowKeys,
    onChange: onSelectChange,
    // 1. Table.SELECTION_ALL: 全选
    // 2. Table.SELECTION_INVERT: 反选
    // 3. Table.SELECTION_NONE: 取消选择
    // 4. { key: 'odd', text: '选择奇数行', onSelect: changeableRowKeys => { ... } }: 选择奇数行
    // 5. { key: 'even', text: '选择偶数行', onSelect: changeableRowKeys => {... } }: 选择偶数行    
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: '选择奇数行',
        onSelect: changeableRowKeys => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 === 0)
          setSelectedRowKeys(newSelectedRowKeys)
        }
      },
      {
        key: 'even',
        text: '选择偶数行',
        onSelect: changeableRowKeys => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 !== 0)
          setSelectedRowKeys(newSelectedRowKeys)
        }
      }
    ]
  }

  // 操作列配置
  // 1. actionButtons: 操作按钮配置数组，会在表格右侧生成操作列（如编辑、删除等按钮）
  // 2. actionColumn: 操作列配置对象，包含标题、渲染函数等
  // 3. actionButtons.map: 遍历操作按钮数组，生成操作列的按钮
  const actionColumn =
    actionButtons.length > 0
      ? {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: actionButtons.length * 100,
          render: (_: any, record: T) => (
            <Space size="middle">
              {actionButtons.map((button, index) => {
                if (button.visible && !button.visible(record)) return null

                if (button.confirm) {
                  return (
                    <Popconfirm key={index} title={button.confirm.title} description={button.confirm.description} onConfirm={() => button.confirm?.onConfirm(record)} onCancel={button.confirm.onCancel} okText="确定" cancelText="取消">
                      <Button type={button.type} danger={button.danger}>
                        {button.text}
                      </Button>
                    </Popconfirm>
                  )
                }

                return (
                  <Button key={index} type={button.type} danger={button.danger} onClick={() => button.onClick?.(record)}>
                    {button.text}
                  </Button>
                )
              })}
            </Space>
          )
        }
      : null

  // 合并列配置
  const columns = [...propColumns]
  if (actionColumn) {
    columns.push(actionColumn as unknown as TableColumnConfig<T>)
  }

  // 行选择配置
  const rowSelection = showRowSelection ? { ...defaultRowSelection, ...propRowSelection } : undefined

  return <Table<T> rowKey={rowKey} columns={columns} dataSource={data} loading={loading} rowSelection={rowSelection} pagination={pagination} scroll={scroll} onRow={onRow} className={className} style={style} />
}

// const TableComponent = wafTable({
//   data,
//   columns,
//   actionButtons,
//   rowKey: 'id',
//   showRowSelection: true,
//   pagination: {
//     pageSize: 10,
//     showSizeChanger: true
//   },
//   scroll: { x: 1000 }
// })

// return (
//   <div style={{ padding: '20px' }}>
//     <h2>用户列表</h2>
//     {TableComponent}
//   </div>
// )