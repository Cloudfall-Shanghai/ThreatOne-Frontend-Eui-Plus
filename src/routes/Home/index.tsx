/* eslint-disable eqeqeq */
/*
 * Login - 首页组件
 * @date: 2023-08-14
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import React, { useRef, useState, Fragment } from "react";
import intl from "@/utils/intl";
import Notification from "@/utils/notification";
import {
  EuiPageTemplate,
  EuiTabbedContent,
  EuiSpacer,
  EuiButton,
} from "@elastic/eui";
import WrapEuiFieldText from "@/components/WrapEuiFieldText";
import IntlSelector from "@/components/IntlSelector";
import TencentThreatPanel from "./TencentThreatPanel";
import VirusTotalPanel from "./VirusTotalPanel";
import SophosLabPanel from "./SophosLabPanel";
import { removeLocalToken } from "@/utils/request";
import { routerToFirstPage } from "@/utils/router";

import { InputRef } from "@/components/WrapEuiFieldText";

import { queryIp } from "./service";

import style from "./index.module.scss";
import LogoImg from "@/assets/Logo.jpg";

const { Header, Section, BottomBar } = EuiPageTemplate;
// 定义行内样式
const headerStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  boxShadow: "1px 1px 5px #a3a3a3",
};
const bodyStyle: React.CSSProperties = {
  backgroundColor: "#f0f2f5",
  // overflowY: "auto",
};
const queryFieldStyle: React.CSSProperties = {
  width: "calc(100vw - 374px)",
  maxWidth: "1064px",
  outline: "none",
};
const bottomStyle: React.CSSProperties = {
  textAlign: "center",
  backgroundColor: "#f0f2f5",
  boxShadow: "none",
  color: "#111",
  position: "static",
  marginTop: "-30px",
};

const Home: React.FC = () => {
  const [searchIp, setSearchIp] = useState<string>("");
  const [ipData, setIpData] = useState<Object>({});
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const searchIpRef = useRef<InputRef>(null);

  // 搜索框输入回调
  const handleSearchIpChange = (e: any) => {
    setSearchIp(e.target.value);
    searchIpRef?.current?.validation(e.target.value); // 校验
  };

  // 搜索框ip检查
  const handleCheckIp = (e: any) => {
    if (!(e.key === "Enter" && searchIp)) return;
    handleQueryIp();
  };

  // 查询ip
  const handleQueryIp = () => {
    if (!searchIpRef?.current?.validation(searchIp)) return;
    // 出错处理
    const handleError = (e: any) => {
      const { name } = e;
      // 鉴权失败
      if (name == "401") {
        Notification.error({
          title: intl.get("eui.common.notification.outdate"),
          text: <>{intl.get("eui.common.notification.loginAgain")}</>,
        });
        removeLocalToken(); // 清空token
        // 跳转登录页
        setTimeout(() => {
          routerToFirstPage();
        }, 2000);
        return;
      }
      Notification.error({
        text: <>{intl.get("eui.common.notification.errorQurey")}</>,
      });
      if (e.code === 10402) {
        Notification.error({
          text: <>{intl.get("eui.common.notification.loginAgain")}</>,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("refToken");
        setTimeout(() => {
          window.location.href = window.location.origin;
        }, 3000);
      }
    };
    setBtnLoading(true);
    queryIp({ ip: searchIp }, handleError)
      .then((res) => {
        if (res && Object.keys(res).length !== 0) {
          Notification.success({
            text: <>{intl.get("eui.common.notification.querySuccess")}</>,
          });
          setIpData(res);
        }
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const tabs = [
    {
      id: "ttId",
      name: intl.get("eui.home.tabs.tencentThreat"),
      content: (
        <Fragment>
          <EuiSpacer />
          <TencentThreatPanel ipData={ipData} loading={btnLoading} />
        </Fragment>
      ),
    },
    {
      id: "vtId",
      name: "VirusTotal",
      content: (
        <Fragment>
          <EuiSpacer />
          <VirusTotalPanel ipData={ipData} loading={btnLoading} />
        </Fragment>
      ),
    },
    {
      id: "spId",
      name: "SophosLabs",
      content: (
        <Fragment>
          <EuiSpacer />
          <SophosLabPanel ipData={ipData} loading={btnLoading} />
        </Fragment>
      ),
    },
  ];

  return (
    <div className={`${style["home-container"]}`}>
      <EuiPageTemplate>
        <Header style={headerStyle}>
          <div className={`row-display ${style["header-box"]}`}>
            <div className="row-display">
              <span className={style["header-title"]}>
                {intl.get("eui.login.view.title")}
              </span>
              <span className={style["header-subtitle"]}>
                {intl.get("eui.home.view.title")}
              </span>
            </div>
            <div className="row-display">
              <IntlSelector />
              <img className={style["header-logo"]} src={LogoImg} alt="" />
            </div>
          </div>
        </Header>
        <Section style={bodyStyle} restrictWidth={1400}>
          <div className={`col-display ${style["section-box"]}`}>
            <div className={`row-display ${style["query-bar"]}`}>
              <WrapEuiFieldText
                icon="search"
                placeholder={intl.get("eui.home.search.placeholder")}
                value={searchIp}
                onChange={handleSearchIpChange}
                onKeyUp={handleCheckIp}
                ref={searchIpRef}
                style={queryFieldStyle}
                rules={[
                  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                ]}
                rulesError={[intl.get("eui.home.fielderror.ip")]}
                fullWidth
              />
              <EuiButton
                type="primary"
                isLoading={btnLoading}
                style={{ marginLeft: "10px" }}
                onClick={handleQueryIp}
              >
                {intl.get("eui.common.button.search")}
              </EuiButton>
            </div>

            <div className={`${style["tab-box"]}`}>
              <EuiSpacer />
              <EuiTabbedContent
                size="l"
                tabs={tabs as any}
                initialSelectedTab={tabs[0] as any}
              />
            </div>
          </div>
        </Section>
        <BottomBar style={bottomStyle}>
          {intl.get("eui.common.view.company")}
        </BottomBar>
      </EuiPageTemplate>
    </div>
  );
};

export default Home;
