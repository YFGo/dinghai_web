import { useEffect } from 'react'
// import { Tabs } from 'antd'
// import type { TabsProps } from 'antd'
// import { CircleLoading } from '@/components/loading'
import { Card, Table, Tag, Input, Flex, Button, message } from 'antd'
import type { TableProps } from 'antd'
import { getBuiltInRules } from '@/api/index'


interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

export default function BuiltInRule() {
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
    }
  ]

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ]

  const BuiltInRules = async () => {
    try {
      const res = await getBuiltInRules()
      console.log(res)
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取内置规则失败')
    }
  }

  useEffect(() => {
     BuiltInRules()
  }, [])

  return (
    <div>
      <Card className="my-2">
        <Flex className="justify-between">
          <div className="flex gap-4">
            <Input className="w-48 h-10" placeholder="规则名称" />
            <Input className="w-48 h-10" placeholder="Basic usage" />
            <Input className="w-48 h-10" placeholder="Basic usage" />
            <Input className="w-48 h-10" placeholder="Basic usage" />
            <Input className="w-48 h-10" placeholder="Basic usage" />
          </div>
          <Button>刷新</Button>
        </Flex>
      </Card>
      <Card>
        <Table<DataType> columns={columns} dataSource={data} />{' '}
      </Card>
    </div>
  )
}
