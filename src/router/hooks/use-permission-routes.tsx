import { Suspense,lazy,useMemo } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Tag } from 'antd'
import { isEmpty } from 'ramda'
import {BellOutlined} from '@ant-design/icons'
import { CircleLoading } from '@/components/loading'
import { useUserPermission } from '@/redux/modules/userSlice'

// 权限实体类型
import type {Permission} from'@/types/entity'
import type {AppRouteObject} from '@/types/router'
import { BasicStatus, PermissionType } from '@/types/enum'

import dashboard from '../routes/modules/dashboard'
import wafRule from '../routes/modules/waf-rule'
import wafSite from '../routes/modules/waf-site'
import wafStrategy from '../routes/modules/waf-strategy'
import wafWhiteList from '../routes/modules/waf-white-list'
import wafAttack from '../routes/modules/waf-attack'


// 页面组件入口路径以及动态加载配置
const ENTRY_PATH = '/src/pages'

// 使用glob动态导入所有页面组件
const PAGES = import.meta.glob('/src/pages/**/*.tsx')

// 动态加载页面组件
const loadComponentFromPath = (path: string) => PAGES[`${ENTRY_PATH}${path}`];

/**
 * // 从当前权限遍历至根权限，构建完整的路由路径
 * @param {Permission} permission - current permission (当前权限)
 * @param {Permission[]} flattenedPermissions - flattened permission array (扁平化的权限数组)
 * @param {string[]} segments - route segments accumulator (路由片段累加器)
 * @returns {string} normalized complete route path (完整的路由路径)
 */
function buildCompleteRoute(
  permission: Permission,
  flattenedPermissions: Permission[],
  segments: string[] = []
) : string {
  // 将当前权限的路由路径添加到片段数组的开头
  segments.unshift(permission.route)

  // 基本情况: 当前权限没有父级权限，返回完整路径
  if (!permission.parentId) {
    return `/${segments.join('/')}`
  }

  // 递归查找父级权限
  const parent = flattenedPermissions.find(p => p.id === permission.parentId)
  // 如果不存在父级权限，返回完整路径
  if (!parent) {
    return `/${segments.join('/')}`
  }

  // 递归调用，继续查找父级权限
  return buildCompleteRoute(parent, flattenedPermissions, segments)
}

// 组件
function NewFeatureTag() {
  return (
    <Tag color="cyan" className="ml-2!">
      <div className="flex items-center gap-1">
        <BellOutlined />
        <span className="ms-1">NEW</span>
      </div>
    </Tag>
  )
}

/**
 * 创建基础路由对象
 * 
 * 此函数将权限对象转换为标准的路由对象(AppRouteObject)，
 * 用于构建应用的路由结构。
 * 
 * @param permission - 权限对象，包含路由配置信息
 * @param completeRoute - 完整路由路径，用于唯一标识路由
 * @returns 返回符合AppRouteObject规范的路由对象
 */
const createBaseRoute = (permission: Permission, completeRoute: string): AppRouteObject => {
  // 解构权限对象，提取路由配置属性
  const {
    route,      // 路由路径 (必填): 用于匹配URL的路径模式，如 '/user'
    label,      // 显示名称 (可选): 用于导航菜单、面包屑等处的显示文本
    icon,       // 图标 (可选): 用于在导航菜单中显示的图标组件或标识
    order,      // 排序值 (可选): 控制路由在导航菜单中的显示顺序，数值越小排序越靠前
    hide,       // 隐藏菜单 (可选): 为true时不在导航菜单中显示此路由
    hideTab,    // 隐藏标签页 (可选): 为true时不在多标签页系统中显示此路由
    status,     // 状态 (可选): 路由状态，如BasicStatus.DISABLE表示禁用此路由
    frameSrc,   // 内嵌地址 (可选): 如果提供，路由将作为iframe嵌入指定URL内容
    newFeature  // 新功能标记 (可选): 为true时在菜单项旁显示新功能标识
  } = permission;

  // 构建基础路由对象
  const baseRoute: AppRouteObject = {
    path: route, // 路由路径，必须与权限对象中的route一致
    
    // 路由元信息，用于存储各种配置和标记
    meta: {
      label,         // 路由显示名称
      key: completeRoute, // 完整路由路径，作为路由的唯一标识
      hideMenu: !!hide,  // 是否隐藏于导航菜单 (转换为布尔值)
      hideTab: !!hideTab, // 是否隐藏于标签页系统 (转换为布尔值)
      disabled: status === BasicStatus.DISABLE // 是否禁用路由
    }
  };

  // 处理排序配置
  if (order !== undefined) {
    baseRoute.order = order; // 设置路由排序值
  }

  // 补充元数据信息
  if (baseRoute.meta) {
    // 添加图标配置
    if (icon) {
      baseRoute.meta.icon = icon;
    }
    
    // 添加iframe嵌入配置
    if (frameSrc) {
      baseRoute.meta.frameSrc = frameSrc;
    }
    
    // 添加新功能标记
    if (newFeature) {
      baseRoute.meta.suffix = <NewFeatureTag />; // 使用新功能标签组件
    }
  }
  
  return baseRoute;
};
/**
 * 创建目录路由配置
 * 
 * 该函数用于将权限节点转换为目录类型的路由配置，主要特点：
 * 1. 目录路由本身通常不直接渲染内容，而是作为子路由的容器
 * 2. 自动处理重定向到第一个子路由的逻辑
 * 3. 对顶级目录有特殊处理
 * 
 * @param permission - 当前要转换的权限节点对象，包含路由配置信息
 * @param flattenedPermissions - 扁平化的完整权限列表，用于构建完整路由路径
 * @returns 返回符合AppRouteObject规范的目录路由配置对象
 */
const createCatalogueRoute = (permission: Permission, flattenedPermissions: Permission[]): AppRouteObject => {
  // 创建基础路由结构：将权限对象转换为基本路由对象
  const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

  // 目录路由默认隐藏标签页（通常目录路由本身不需要显示在标签页系统中）
  if (baseRoute.meta) {
    baseRoute.meta.hideTab = true;
  }

  // 解构权限对象，获取父级ID和子权限列表（默认为空数组）
  const { parentId, children = [] } = permission;

  // 处理顶级目录路由的特殊情况（没有父级ID的路由视为顶级路由）
  if (!parentId) {
    // 顶级目录路由使用Suspense和Outlet组件：
    // - Suspense提供加载状态回退
    // - Outlet作为子路由的渲染出口
    baseRoute.element = (
      <Suspense fallback={<CircleLoading />}>
        <Outlet />
      </Suspense>
    );
  }

  // 递归转换所有子权限为路由配置
  baseRoute.children = transformPermissionsToRoutes(children, flattenedPermissions)

  // 如果存在子路由，添加默认重定向逻辑
  if (!isEmpty(children)) {
    baseRoute.children?.unshift({
      path: '', // 空路径表示默认路由
      index: true, // 标记为索引路由（当父路由路径被访问时激活）
      element: <Navigate to={children[0].route} replace /> // 重定向到第一个子路由
    });
  }
  
  return baseRoute;
};

/**
 * 创建菜单路由配置
 * 
 * 该函数用于将权限节点转换为可渲染的菜单路由配置，主要特点：
 * 1. 处理动态组件加载（使用React.lazy实现代码分割）
 * 2. 支持内嵌iframe的特殊处理
 * 3. 自动添加Suspense加载状态处理
 * 
 * @param permission - 当前要转换的权限节点对象，包含路由配置信息
 * @param flattenedPermissions - 扁平化的完整权限列表，用于构建完整路由路径
 * @returns 返回符合AppRouteObject规范的菜单路由配置对象
 */
const createMenuRoute = (permission: Permission, flattenedPermissions: Permission[]): AppRouteObject => {
  // 创建基础路由结构：将权限对象转换为基本路由对象
  // 包含path、meta等基础路由配置
  const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));
  
  // 如果权限配置中指定了组件路径，则设置路由的渲染元素
  if (permission.component) {
    // 使用React.lazy动态加载组件，实现代码分割
    // loadComponentFromPath: 根据组件路径动态导入组件模块
    const Element = lazy(loadComponentFromPath(permission.component) as any);

    // 特殊处理iframe嵌入的情况
    if (permission.frameSrc) {
      // 如果配置了frameSrc，将组件作为iframe容器使用
      // 并将frameSrc作为props传递给组件
      baseRoute.element = <Element src={permission.frameSrc} />;
    } else {
      // 普通组件使用Suspense包装，提供加载状态回退
      baseRoute.element = (
        <Suspense fallback={<CircleLoading />}>
          <Element />
        </Suspense>
      );
    }
  }
  
  return baseRoute;
};

function transformPermissionsToRoutes(permissions: Permission[], flattenedPermissions: Permission[]): AppRouteObject[] {
  return permissions.map(permission => {
    if (permission.type === PermissionType.CATALOGUE) {
      return createCatalogueRoute(permission, flattenedPermissions) // 目录路由
    }
    return createMenuRoute(permission, flattenedPermissions) // 菜单路由
  })
}

/**
 * 将树形结构的权限数组扁平化为一维数组
 * @param permissions - 权限树数组
 * @returns 扁平化后的权限数组
 */
function flattenTrees(permissions: Permission[]): Permission[] {
  const result: Permission[] = [];
  
  function flatten(items: Permission[]) {
    items.forEach(item => {
      result.push(item);
      if (item.children?.length) {
        flatten(item.children);
      }
    });
  }
  
  flatten(permissions);
  return result;
}

/**
 * 从模块中获取路由配置
 * 用于支持基于模块的路由配置方式
 */
function getRoutesFromModules(): AppRouteObject[] {
  // 返回所有模块路由配置数组
  return [dashboard, wafRule, wafSite, wafStrategy, wafWhiteList, wafAttack]
}

const ROUTE_MODE = import.meta.env.VITE_ROUTE_MODE; // 权限路由模式 permission | module

export function usePermissionRoutes() {
  // 获取用户权限列表
  const permissions = useUserPermission();

  return useMemo(() => {
    // 如果是模块路由模式，使用模块方式获取路由
    if (ROUTE_MODE === 'module') {
      return getRoutesFromModules();
    }

    // 如果权限列表为空，返回空数组
    if (!permissions?.length) {
      return [];
    }

    try {
      // 扁平化权限列表：将所有权限节点展平为一维数组，便于后续处理
      const flattenedPermissions = flattenTrees(permissions);
      // 转换权限为路由配置
      return transformPermissionsToRoutes(permissions, flattenedPermissions);
    } catch (error) {
      console.error('转换权限路由出错:', error);
      return [];
    }
  }, [permissions]); // 仅在permissions变化时重新计算
}
