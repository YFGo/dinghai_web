import { useMemo } from 'react'
import { usePermissionRoutes } from '@/router/hooks'
import { menuFilter } from '@/router/utils'
import { useRouteToMenuFn } from '@/router/hooks'
import { Menu } from 'antd'
import { useMatches } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRouter } from '@/router/hooks/use-router'

const SidebarMenu = () => {
  const { t } = useTranslation()
  const matches = useMatches()
  const router = useRouter()

  const permissionRoutes = usePermissionRoutes()
  const routeToMenuFn = useRouteToMenuFn()

  const menuList = useMemo(() => {
    // 如果没有权限路由，直接返回空数组，否则进行过滤和转换
    return permissionRoutes ? routeToMenuFn(menuFilter(permissionRoutes)) : []
  }, [routeToMenuFn, permissionRoutes])


  const onClick = (e: any) => {
    console.log('click ', e)
    // 使用router.push导航到点击的菜单项对应的路由
    router.push(e.key)
  }

  return <Menu theme="dark" onClick={onClick} mode="inline" selectedKeys={matches.map(match => match.pathname)} items={menuList} />
}

export default SidebarMenu
