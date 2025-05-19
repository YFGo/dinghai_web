
import { useState, useEffect } from 'react'
import { Card, Input, Flex, Button, Breadcrumb, DatePicker, message } from 'antd'
import type { TimeRangePickerProps } from 'antd'
import { CustomTable } from './custom-table'
import {DataType} from './custom-table'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useSafeModal } from '@/hooks/safe-modal'

const { RangePicker } = DatePicker

interface RuleFormValues {
  name: string;
  description: string;
  risk_level: number;
  group_id: string;
  seclang_mod: {
    match_goal: string;
    match_action: string;
    match_content: string;
  };
}

export default function CustomRule() {
  const [data, setData] = useState<DataType[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setData([
        { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', tags: ['nice', 'developer'] },
        { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', tags: ['loser'] },
        { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park', tags: ['cool', 'teacher'] }
      ])
      setLoading(false)
    },1000)
  },[])

  // 删除选中项
  const handleDelete = (keys: React.Key[]) => {
    // 这里可以调用API执行删除
    message.success(`删除了 ${keys.join(', ')}`)
    setData(data.filter(item => !keys.includes(item.key)))
    setSelectedRowKeys([])
  }

  // 自定义弹窗
  const { showModal, renderModal } = useSafeModal({
    defaultTitle: '删除自定义规则',
    width: 600
  })

  // 显示弹窗
  const showConfirm = () => {
    showModal({
      content: <div>确认删除吗？一旦删除无法恢复</div>,
      onOk: close => {
        console.log('执行新增操作')
        close()
      }
    })
  }

  // 预设时间范围
  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] }
  ]

  // 处理时间选择
  const handleTimeChange = (dates: null | (Dayjs | null)[], dateStrings: [string, string]) => {
    console.log('Selected Time: ', dates, dateStrings)
  }

  return (
    <div>
      <Breadcrumb items={[{ title: '自定义规则' }]} separator=">" />
      <Card className="my-2">
        <Flex className="justify-between">
          <div className="flex gap-4">
            <Input className="w-48 h-10" placeholder="规则名称" />
            <RangePicker
              presets={[
                {
                  label: <span aria-label="Current Time to End of Day">Now ~ EOD</span>,
                  value: () => [dayjs(), dayjs().endOf('day')] // 5.8.0+ support function
                },
                ...rangePresets
              ]}
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              onChange={handleTimeChange}
            />
          </div>
          <Button>刷新</Button>
        </Flex>
      </Card>
      <Card>
        <div>
          <Button color="primary" variant="outlined">
            新增自定义规则
          </Button>
          <Button color="primary" variant="outlined" className="mx-3 mb-3">
            一键导出
          </Button>
          <Button color="primary" variant="outlined" onClick={showConfirm} disabled={selectedRowKeys.length === 0}>
            批量删除
          </Button>
        </div>
        <CustomTable data={data} selectedRowKeys={selectedRowKeys} onSelectedRowKeysChange={setSelectedRowKeys} onDelete={handleDelete} loading={loading} />{' '}
      </Card>
      {renderModal()}
    </div>
  )
}
