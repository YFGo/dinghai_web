import { AppRouteObject } from "@/types/router";
import { useCallback } from "react";
import type { GetProp, MenuProps } from 'antd'

// 定义菜单项类型，继承自 MenuProps 中的 items 属性类型
type MenuItem = GetProp<MenuProps, 'items'>[number]


  /**
   * 将路由配置转换为菜单结构
   * @param items 路由配置数组
   * @returns 菜单结构数组
   * @example
   * const menuList = useRouteToMenuFn(routes)
   */
export function useRouteToMenuFn() {
  const routeToMenuFn = useCallback((items: AppRouteObject[]): MenuItem[]=> {
    return items.filter((item)=> !item.meta?.hideMenu).map((item)=> {
      const {meta,children} = item;
      // 如果没有meta属性，返回空对象
      if(!meta) return {} as MenuItem;

      // 构造菜单项对象，只包含必要的属性
      const menuItem: Partial<MenuItem> = {
        key: meta.key,
        disabled: meta.disabled,
        // 菜单的显示名称，通常是一个React元素，用于渲染菜单的文本或图标。
        label: (
          <>
            {meta.label}
            {meta.suffix}
          </>
        ),
        // 菜单的图标，通常是一个React元素，用于显示菜单的图标。
        ...(meta.icon && {icon: meta.icon}),
        // 菜单的子菜单，用于嵌套菜单。
        ...(children && {children: routeToMenuFn(children)})
      };
      return menuItem as MenuItem;
    })
  },[])
  return routeToMenuFn;
}
