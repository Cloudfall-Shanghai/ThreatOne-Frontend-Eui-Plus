/* eslint-disable eqeqeq */
/*
 * Login - 登录组件
 * @date: 2023-08-11
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import React, { useRef, useState } from "react";
import intl from "@/utils/intl";
import { EuiButton, EuiPageHeader } from "@elastic/eui";
import WrapEuiFieldText from "@/components/WrapEuiFieldText";
import WrapEuiPswText from "@/components/WrapEuiPswText";
import Notification from "@/utils/notification";
import { routerToPage, routerToHomePage } from "@/utils/router";

import { InputRef } from "@/components/WrapEuiFieldText";
import { PswInputRef } from "@/components/WrapEuiPswText";

import { loginToSystem, getLoginUrl, loginToSystemByAd } from "./service";

import style from "./index.module.scss";
import SearchImg from "@/assets/loginImg.svg";
import { MSIcon } from "../../assets/index";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isADLoading, setIsADLoading] = useState<boolean>(false);

  const usernameRef = useRef<InputRef>(null);
  const passwordRef = useRef<PswInputRef>(null);

  // 进入登录页面时检查token，存在即跳转首页
  routerToHomePage();

  // 页面带参跳转进入
  React.useEffect(() => {
    const tid = window.location.search.split("?tid=")[1];
    const msg = window.location.search.split("?msg=")[1];
    if (tid) handleGetADToken(tid);
    if (msg) Notification.warn({ text: <>{decodeURI(msg)}</> });
    if (window.location.search && !tid && !msg)
      Notification.warn({
        text: <>{intl.get("eui.common.notification.invalidAddr")}</>,
      });
  }, []);

  // handleGetADToken：处理页面带参跳转进入
  const handleGetADToken = async (tid: string) => {
    loginToSystemByAd({ tid })
      .then((res) => {
        if (!res?.data) return;
        window.localStorage.setItem(
          "ThreatOne_token",
          `Bearer ${res.data?.access}`
        );
        window.localStorage.setItem("ThreatOne_refToken", res.data?.refresh);
        window.location.href = window.location.origin;
      })
      .catch((error: any) => {
        Notification.warn({ text: <>{error}</> });
      });
  };

  // 表单值改动绑定
  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
    usernameRef?.current?.validation(e.target.value); // 校验用户名
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    passwordRef?.current?.validation(e.target.value); // 校验密码
  };

  // 登录
  const handleLogin = () => {
    usernameRef?.current?.validation(username); // 校验用户名
    passwordRef?.current?.validation(password); // 校验密码
    if (!username || !password) return;
    // 请求出错的钩子
    const handleError = (e: Error) => {
      const { name, message } = e;
      console.log(name,message)
      if (message.includes("TypeError ")) {
        return Notification.error({
          text: <>{intl.get("eui.common.notification.error")}</>,
        });
      }
      if (message.includes("timeout")) {
        return Notification.error({
          text: <>{intl.get("eui.common.notification.timeout")}</>,
        });
      }
      if (message.includes("Network Error")) {
        return Notification.error({
          text: <>{intl.get("eui.common.notification.error")}</>,
        });
      }
      if (name == "400") {
        return Notification.error({
          text: <>{intl.get("eui.common.notification.clientWrong")}</>,
        });
      }
      if (name == "401") {
        return Notification.error({
          text: <>{intl.get("eui.login.notification.nameorpswwrong")}</>,
        });
      }
      if (name == "404") {
        return Notification.error({
          text: <>{intl.get("eui.common.notification.resourceUnavailable")}</>,
        });
      }
    };
    loginToSystem({ username, password }, handleError)?.then(
      (res: { access: any; refresh: string; detail: string }) => {
        if (res?.access) {
          Notification.success({
            text: <>{intl.get("eui.common.notification.successlogin")}</>,
          });
          localStorage.setItem("ThreatOne_token", `Bearer ${res?.access}`);
          localStorage.setItem("ThreatOne_refToken", res?.refresh);
          // 跳转页面
          routerToPage("/home");
        }
        // 如果请求返回了detail信息表示出错
        if (res?.detail) {
          Notification.error({
            text: <>{res?.detail}</>,
          });
        }
      }
    );
  };

  // 跳转MS登录
  const handleMsLogin = () => {
    setIsADLoading(true);
    const { baseUrl, api } = getLoginUrl();
    window.location.href = `${baseUrl}${api.msLogin}?original=${window.location.origin}`;
  };

  return (
    <div className={`row-display ${style["container"]}`}>
      <div className={`row-display ${style["center-form"]}`}>
        <div className={`row-display  ${style["left-box"]}`}>
          <img src={SearchImg} alt="" />
        </div>

        <div className={`col-display  ${style["right-box"]}`}>
          <div className="col-display ">
            <EuiPageHeader
              className={style["box-header"]}
              pageTitle={intl.get("eui.login.view.title")}
            />
            <WrapEuiFieldText
              icon="user"
              placeholder={intl.get("eui.login.name.placeholder")}
              value={username}
              onChange={handleUsernameChange}
              ref={usernameRef}
              rules={[/.+/]}
              rulesError={[intl.get("eui.common.tips.fieldRequired")]}
            />
            <WrapEuiPswText
              placeholder={intl.get("eui.login.password.placeholder")}
              value={password}
              onChange={handlePasswordChange}
              ref={passwordRef}
              rules={[/.+/]}
              rulesError={[intl.get("eui.common.tips.fieldRequired")]}
            />
            <EuiButton color="primary" onClick={handleLogin}>
              {intl.get("eui.common.button.login")}
            </EuiButton>
            <EuiButton
              color="text"
              type="Empyt"
              isLoading={isADLoading}
              onClick={handleMsLogin}
            >
              <div data-function="MSAD" className="row-display">
                <img src={MSIcon} alt="" />
                <span>Microsoft Azure AD 登录</span>
              </div>
            </EuiButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
