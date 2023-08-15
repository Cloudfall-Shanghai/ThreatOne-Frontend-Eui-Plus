/*
 * WrapEuiFieldText - 封装文本输入框
 * @date: 2023-08-13
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import React, { useState, useImperativeHandle } from "react";
import { EuiFieldText, EuiTextColor } from "@elastic/eui";
import intl from "@/utils/intl";

import styles from "./index.module.scss";

interface CompType {
  icon?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => any;
  onKeyUp?: (e: any) => any;
  style?: React.CSSProperties;
  rules?: RegExp[]; // 正则校验规则
  rulesError?: string[]; // 正则校验失败时展示的提示文本
  defaultError?: ""; // 默认的错误校验文本
  fullWidth?: boolean;
}
export type InputRef = {
  validation: (textValue: string) => boolean;
};

const WrapEuiFieldText = (
  props: CompType,
  ref: React.ForwardedRef<InputRef>
) => {
  const {
    icon = "",
    placeholder = "",
    value = "",
    onChange = () => {},
    onKeyUp = () => {},
    style = {},
    rules = [/.*/],
    rulesError = [""],
    defaultError = intl.get("eui.common.valid.default"),
    fullWidth = false,
  } = props;

  const [errorMsg, setErrorMsg] = useState<string>("");

  useImperativeHandle(ref, () => ({
    // 向父组件暴露一个校验方法
    validation: (textValue) => {
      let flag = false;
      (rules || []).some((reg: RegExp, index: number) => {
        if (reg.test(textValue)) return false; // 通过校验则继续执行
        // 如果没通过校验,返回true中断some遍历
        flag = true;
        setErrorMsg(rulesError[index] || defaultError); // 设置校验文本
        return true;
      });
      // 全部通过校验，则置空校验信息
      if (!flag) setErrorMsg("");
      return !flag;
    },
  }));

  return (
    <div className={styles["wrap-eui-input-text"]}>
      <EuiFieldText
        icon={icon}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={style}
        fullWidth={fullWidth}
        onKeyUp={onKeyUp}
      />
      {errorMsg && (
        <EuiTextColor color="danger" className={styles["error-msg"]}>
          {errorMsg}
        </EuiTextColor>
      )}
    </div>
  );
};

export default React.forwardRef<InputRef, CompType>(WrapEuiFieldText);
