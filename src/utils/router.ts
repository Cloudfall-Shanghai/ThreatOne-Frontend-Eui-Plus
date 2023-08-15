/*
 * router.ts - 路由功能
 * @date: 2023-08-15
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */

import { getLocalToken } from "@/utils/request";

// 刷新当前页面
export function refresh() {
  window.location.reload();
}

// 跳转当前项目的某个路由页面
export function routerToPage(str: string) {
  const { origin } = window.location;
  window.location.href = `${origin}${str}`;
}

// 转登录页路由
export function routerToFirstPage() {
  const { origin } = window.location;
  window.location.href = `${origin}`;
}

// 检查token，转首页路由
export function routerToHomePage() {
  if (getLocalToken()) {
    const { origin } = window.location;
    window.location.href = `${origin}/home`;
  }
}
