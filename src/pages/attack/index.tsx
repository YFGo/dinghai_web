import { useState } from 'react'
import { Segmented } from 'antd'
import { AttackDetail } from './attack-detail'
import { AttackTable } from './attack-table'

export default function AttackSafe() {
  const [currentView, setCurrentView] = useState<string>('攻击事件')
  const handleViewChange = (value: string) => {
    setCurrentView(value)
  }

  return (
    <div>
      <Segmented defaultValue="攻击事件" options={['攻击事件', '攻击日志']} onChange={handleViewChange} style={{ marginBottom: 24 }} />
      {currentView === '攻击事件' ? <AttackTable /> : <AttackDetail />}
    </div>
  )
}
