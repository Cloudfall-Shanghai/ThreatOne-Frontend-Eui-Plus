/*
 * service - 登录组件接口请求
 * @date: 2023-08-13
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */

import request, { getBaseUrl } from "@/utils/request";

const loginUrl = "/token/obtain/";
const msLoginUrl = "/msad-login/";

// 获取登录的url，本页面较为特殊
export function getLoginUrl() {
  return {
    baseUrl: getBaseUrl(), // baseUrl只在request.js里集中管理
    api: {
      login: loginUrl,
      msLogin: msLoginUrl,
    },
  };
}

// 请求登录接口
interface loginParam {
  username: string;
  password: string;
}
export function loginToSystem(
  param: loginParam,
  handleError?: (a: Error) => any
) {
  return request(
    loginUrl,
    {
      method: "POST",
      body: { ...(param ?? {}) },
    },
    handleError
  );
}

// 微软AD登入接口
interface loginParamAd {
  tid: string;
}
export function loginToSystemByAd(params: loginParamAd) {
  return request(loginUrl, {
    method: "GET",
    query: { ...params },
  });
}
