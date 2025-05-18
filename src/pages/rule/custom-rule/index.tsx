
import { Card, Input, Flex, Button, Breadcrumb, DatePicker, Form, Select } from 'antd'
import type { TimeRangePickerProps } from 'antd'
import { CustomTable } from './custom-table'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useSafeModal } from '@/hooks/safe-modal'
import { GroupSelect } from './group-select'

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
  const { showModal, renderModal } = useSafeModal({
    defaultTitle: '新增自定义规则',
    width: 600,
  })

  // 表单提交处理函数
const handleSubmit = (values: RuleFormValues, close: () => void) => {
  console.log('提交数据:', values);
  // 这里调用你的API接口
  close();
};

  // 普通弹窗示例
  const showConfirm = () => {
    showModal({
      content: (
        <Form layout="vertical" initialValues={{ risk_level: 1 }} onFinish={values => handleSubmit(values, close)}>
          {/* 基础信息 */}
          <Form.Item label="规则名称" name="name" rules={[{ required: true, message: '请输入规则名称' }]}>
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item label="规则描述" name="description" rules={[{ required: true, message: '请输入规则描述' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>

          {/* 风险等级 */}
          <Form.Item label="风险等级" name="risk_level" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={1}>低风险</Select.Option>
              <Select.Option value={2}>中风险</Select.Option>
              <Select.Option value={3}>高风险</Select.Option>
            </Select>
          </Form.Item>

          {/* 安全组 */}
          <Form.Item label="所属组" name="group_id" rules={[{ required: true, message: '请选择所属组' }]}>
            {/* 假设这是一个自定义组件 */}
            <GroupSelect />
          </Form.Item>

          {/* 匹配模块 */}
          <Card title="匹配配置" size="small" className="mb-4">
            <Form.Item label="匹配目标" name={['seclang_mod', 'match_goal']} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="匹配动作" name={['seclang_mod', 'match_action']} rules={[{ required: true }]}>
              <Select>
                <Select.Option value="block">拦截</Select.Option>
                <Select.Option value="alert">告警</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="匹配内容" name={['seclang_mod', 'match_content']} rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Card>

          {/* 隐藏的提交按钮用于回车提交 */}
          <Form.Item hidden>
            <Button htmlType="submit" />
          </Form.Item>
        </Form>
      ),
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
          <Button color="primary" variant="outlined" onClick={showConfirm}>
            新增自定义规则
          </Button>
          <Button color="primary" variant="outlined" className="mx-3 mb-3">
            批量导出
          </Button>
          <Button color="primary" variant="outlined">
            批量删除
          </Button>
        </div>
        <CustomTable />
      </Card>
      {renderModal()}
    </div>
  )
}
