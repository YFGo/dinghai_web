import Icon, { HomeOutlined } from '@ant-design/icons'
import { CircleLoading } from '@/components/loading'
import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
import type { AppRouteObject } from '@/types/router'

const Page403 = lazy(() => import('@/pages/error/Page403'))
const Page404 = lazy(() => import('@/pages/error/Page404'))
const Page500 = lazy(() => import('@/pages/error/Page500'))

const errors: AppRouteObject[] = [
  {
    path: 'error',
    order: 6,
    element: (
      <Suspense fallback={<CircleLoading />}>
        <Outlet />
      </Suspense>
    ),
    meta: {
      label: 'sys.menu.error.index',
      icon:  <Icon component={HomeOutlined as React.ForwardRefExoticComponent<any>} />,
      key: '/error'
    },
    children: [
      {
        path: '403',
        element: <Page403 />,
        meta: {
          label: 'sys.menu.error.403',
          key: '/error/403'
        }
      },
      {
        path: '404',
        element: <Page404 />,
        meta: {
          label: 'sys.menu.error.404',
          key: '/error/404'
        }
      },
      {
        path: '500',
        element: <Page500 />,
        meta: {
          label: 'sys.menu.error.500',
          key: '/error/500'
        }
      }
    ]
  }
]

export default errors
