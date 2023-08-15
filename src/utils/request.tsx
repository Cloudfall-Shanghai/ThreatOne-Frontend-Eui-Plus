/*
 * request.ts - 请求功能
 * @date: 2023-08-13
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import Notification from "@/utils/notification";
import intl from "@/utils/intl";

interface reqOption {
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  query?: object;
  body?: object | string;
  responseType?: string;
}

interface responseObject {
  json: () => any;
  text: () => any;
  blob: () => any;
  status: number;
  statusText?: string;
}

// 获取存储于本地的token
const getLocalToken = () => localStorage.getItem("ThreatOne_token");

// 清空token
const removeLocalToken = () => {
  localStorage.removeItem("ThreatOne_token");
  localStorage.removeItem("ThreatOne_refToken");
};

export function getBaseUrl() {
  return process.env.NODE_ENV === "development"
    ? "http://192.168.90.216:8001/api"
    : "https://threat1-backend.cloudfall.cn:8001/api";
}

export default function request(
  url: string,
  options: reqOption,
  handleError?: (e: Error) => any
) {
  const headers = {
    // Pragma: "no-cache",
    // "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    Connection: "keep-alive",
  };
  // 添加Authorization
  if (getLocalToken()) {
    Object.assign(headers, { Authorization: getLocalToken() });
  }
  const defaultOptions = {
    // credentials: "include",
    headers,
  };

  const newOptions = { ...defaultOptions, ...options };
  let newUrl = url;
  // 避免请求非http/https协议的接口
  if (!url.startsWith("http")) {
    const urlPreset = getBaseUrl();
    newUrl = `${urlPreset}${newUrl}`;
  }
  const { method, query, body } = options;

  // 非GET的请求需要处理body
  if (
    method === "POST" ||
    method === "PUT" ||
    method === "DELETE" ||
    method === "PATCH"
  ) {
    if (!(newOptions.body instanceof FormData)) {
      // 如果body数据不是表单数据，则请求头数据需要进行改动
      // 同时请求体也要序列化
      Object.assign(newOptions, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          ...newOptions.headers,
        },
        body: JSON.stringify(body),
      });
    } else {
      // 如果body数据是表单数据，则无需处理ContentType
      Object.assign(newOptions, {
        headers: {
          Accept: "application/json",
          ...newOptions.headers,
        },
      });
    }
  }

  // 针对GET，处理url头查询参数
  if (query && method === "GET") {
    // 遍历query，处理query里非空的字段
    const keyArr = Object.keys(query);
    keyArr.forEach((key) => {
      // 如果传入了值是null或undefined的键值对，删除
      // @ts-ignore: 忽略ts编译报错
      if (query[key] == null) {
        Reflect.deleteProperty(query, key);
        return;
      }
    });
    // 将query序列化后拼接到url上
    const keyArrs = Object.keys(query);
    keyArr.forEach((key, index) => {
      if (index === 0) newUrl += "?";
      // @ts-ignore: 忽略ts编译报错
      newUrl += `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
      if (index !== keyArrs.length - 1) newUrl += "&";
    });
  }

  // 将返回的promise直接返回
  let fetchChain = fetch(newUrl, newOptions as RequestInit)
    .then(checkStatus)
    .then((response) => {
      if (response.status === 204) {
        return {};
      }
      if (newOptions.responseType === "blob") {
        return response.blob();
      }
      return newOptions.responseType === "text"
        ? response.text()
        : response.json();
    })
    .catch((e) => {
      const { name: status } = e;
      if (handleError) handleError(e); // 执行捕获返回错误钩子
      // 监听到 网络请求错误
      if (status === "TypeError") {
        Notification.error({
          text: <>{intl.get("eui.common.notification.requestError")}</>,
        });
        return;
      }
      // 后端正常的报错：服务器出错
      if (status === 501) {
        Notification.error({
          text: <>{intl.get("eui.common.notification.serviceError")}</>,
        });
      }
    });

  return fetchChain;
}

// 请求状态检查
function checkStatus(response: responseObject) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // 出错则封装值，抛出
  const errortext = response.statusText;
  const error = new Error(errortext);
  Object.assign(error, {
    name: response.status,
    response: response,
  });
  throw error;
}

export { getLocalToken, removeLocalToken };
