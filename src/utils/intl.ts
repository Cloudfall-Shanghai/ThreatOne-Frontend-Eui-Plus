/*
 * intl.ts - 多语言功能导出
 * @date: 2023-08-11
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import { intlData } from "@/config/intl.data";
import { refresh } from "@/utils/router";

export type language = "zh" | "en";
interface Iprops {
  lang: language;
}
const langList: string[] = ["zh", "en"];

class Intl {
  globalLang: language = "zh";
  // 初始化多语言环境
  constructor(props: Iprops) {
    const { lang } = props;
    // 存在性判定
    if (langList.indexOf(lang) === -1) return;
    this.globalLang = lang;
  }

  // 设置多语言
  setLang(lang: language) {
    if (langList.indexOf(lang) !== -1) localStorage.setItem("intlCode", lang);
    // 刷新页面
    refresh();
  }

  // 获取多语言
  get(codeString: string) {
    if (!codeString) return "";
    // 使用点切割
    const reg = /^(\w+\.\w+)\.(.+)$/;
    const res = reg.exec(codeString);
    if (!res) return "";
    if (!res[1] || !res[2]) return "";
    // 寻找对应的项目
    const moduleCode = intlData.find((item) => item.moduleCode === res[1]);
    if (!moduleCode) return "";
    const obj = (moduleCode?.intlList ?? []).find(
      (item) => item.code === res[2]
    );
    if (!obj) return "";
    return obj[`${this.globalLang}`];
  }

  // 获取多语言列表
  getSupportIntlList() {
    return langList;
  }

  // 获取当前多语言
  getCurrentCode() {
    return this.globalLang;
  }
}

// 获取本地存储的多语言编码
const localIntlCode = localStorage.getItem("intlCode");
const intl = new Intl({ lang: localIntlCode as any });

export default intl;
