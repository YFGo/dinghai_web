import { useEffect } from 'react'
import { Table, Tooltip, Card, Button } from 'antd'
import type { TableColumnsType } from 'antd'

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
}

interface DetailProps {
  ruleId: string | null
  goBack: () => void
}

export const RuleGroupDetail = ({ ruleId,goBack }: DetailProps) => {
  // 根据 ruleId 获取详情数据的逻辑
  useEffect(() => {
    if (ruleId) {
      // 调用 API 获取详情
    }
  }, [ruleId])

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
      width: 150
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address 1',
      ellipsis: {
        showTitle: false
      },
      render: address => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      )
    },
    {
      title: 'Long Column Long Column Long Column',
      dataIndex: 'address',
      key: 'address 2',
      ellipsis: {
        showTitle: false
      },
      render: address => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      )
    },
    {
      title: 'Long Column Long Column',
      dataIndex: 'address',
      key: 'address 3',
      ellipsis: {
        showTitle: false
      },
      render: address => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      )
    },
    {
      title: 'Long Column',
      dataIndex: 'address',
      key: 'address 4',
      ellipsis: {
        showTitle: false
      },
      render: address => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      )
    }
  ]

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park, New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 2 Lake Park, London No. 2 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park, Sydney No. 1 Lake Park'
    }
  ]

  return (
    <Card title={`规则组详情 ID: ${ruleId}`} extra={<Button onClick={goBack}>返回</Button>}>
      <Table<DataType> columns={columns} dataSource={data} />
    </Card>
  )
}
