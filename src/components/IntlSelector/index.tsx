/*
 * IntlSelector - 封装多语言选择器
 * @date: 2023-08-15
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import intl, { language } from "@/utils/intl";

import style from "./index.module.scss";

const IntlSelector = () => {
  // 检查当前编码
  // 获取全部列表
  const supportIntlList = intl.getSupportIntlList();
  // 获取当前多语言
  const currentCode = intl.getCurrentCode();

  const handleIntlChange = (code: language) => {
    if (currentCode === code) return;
    intl.setLang(code);
  };

  const renderList = () => {
    return supportIntlList.map((item: string) => {
      return (
        <span
          style={{
            cursor: item !== currentCode ? "pointer" : "default",
            // textDecoration: item !== currentCode ? "underline" : "default",
          }}
          onClick={() => {
            handleIntlChange(item as language);
          }}
          key={item}
        >
          {intl.get(`eui.common.view.${item}`)}
        </span>
      );
    });
  };

  return <span className={style["intl-box"]}>{renderList()}</span>;
};

export default IntlSelector;
