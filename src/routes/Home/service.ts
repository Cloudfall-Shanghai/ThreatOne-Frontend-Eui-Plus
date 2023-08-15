/*
 * service - 首页组件接口请求
 * @date: 2023-08-14
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */

import request from "@/utils/request";

// 请求IP接口
interface ipParam {
  ip: string;
}
export function queryIp(param: ipParam, handleError?: (a: Error) => any) {
  return request(
    `/query/ip/${param?.ip ?? ""}/`,
    {
      method: "GET",
    },
    handleError
  );
}
