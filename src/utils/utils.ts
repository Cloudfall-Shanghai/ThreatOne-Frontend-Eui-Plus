/*
 * utils.ts - 全局工具函数
 * @date: 2023-08-15
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */


// 数组去重：unique
type uniqueType = string | boolean | number | undefined | null;
export function unique(arr: Array<uniqueType> | undefined) {
  return Array.from(new Set(arr));
}
