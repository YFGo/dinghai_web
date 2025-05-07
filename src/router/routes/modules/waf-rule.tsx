import { Suspense, lazy } from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import type { AppRouteObject } from '@/types/router'
import { SafetyOutlined } from '@ant-design/icons'

const BuiltInRule = lazy(() => import('@/pages/rule/builtIn-rule'))
const CustomRule = lazy(() => import('@/pages/rule/custom-rule'))
const RuleGroup = lazy(() => import('@/pages/rule/rule-group'))

const wafRule: AppRouteObject = {
  order: 2,
  path: '/rule', // 父路由路径
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: '规则管理',
    icon: <SafetyOutlined />,
    key: '/rule',
    disabled: false,
    suffix: '' // 添加后缀
  },
  children: [
    {
      index: false,
      element: <Navigate to="builtInRule" replace />
    },
    {
      path: 'builtInRule',
      element: <BuiltInRule />,
      meta: {
        label: '内置规则',
        key: '/rule/builtInRule',
        disabled: false,
        suffix: ''
      }
    },
    {
      path: 'customRule',
      element: <CustomRule />,
      meta: {
        label: '自定义规则',
        key: '/rule/customRule',
        disabled: false,
        suffix: ''
      }
    },
    {
      path: 'ruleGroup',
      element: <RuleGroup />,
      meta: {
        label: '规则组',
        key: '/rule/ruleGroup',
        disabled: false,
        suffix: ''
      }
    }
  ]
}

export default wafRule
