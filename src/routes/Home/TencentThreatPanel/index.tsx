/*
 * TencentThreatPanel - 腾讯威胁面板展示组件
 * @date: 2023-08-15
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import React, { useState } from "react";
import intl from "@/utils/intl";
import { unique } from "@/utils/utils";
import {
  EuiCard,
  EuiPanel,
  EuiHorizontalRule,
  EuiRange,
  EuiNotificationBadge,
  EuiSkeletonText,
} from "@elastic/eui";

import style from "./index.module.scss";

interface ttData {
  location?: string;
  result?: string;
  tags?: string[];
  threat_level?: number;
  threat_types?: string[];
}
interface Iipdata {
  tt_data?: ttData;
  tt_msg?: string;
  vt_data?: object;
  vt_msg?: string;
  sp_data?: object;
  sp_msg?: string;
  geo_data?: object;
  geo_msg?: string;
}
interface Iprops {
  ipData: Iipdata;
  loading: boolean;
}

const customColorsLevels = [
  {
    min: 0,
    max: 1,
    color: "#a2cb9f",
  },
  {
    min: 1,
    max: 2,
    color: "#a1cbea",
  },
  {
    min: 2,
    max: 3,
    color: "#f2cc8f",
  },
  {
    min: 3,
    max: 4,
    color: "#e07a5f",
  },
  {
    min: 4,
    max: 5,
    color: "#b1130a",
  },
];
const levelPx = ["0", "83.5%", "64%", "45.5%", "26.5%", "3.5%"];
const threat_levelArray = ["未知", "严重", "高危", "中危", "低危", "未见异常"];
const noData = intl.get("eui.common.view.nodata");

const TencentThreatPanel = (props: Iprops) => {
  // 解构props
  const {
    ipData: { tt_data: ttData = {}, tt_msg: ttMsg = "" },
    loading = false,
  } = props || {};
  const {
    threat_level: threatLevel = 0,
    tags = [],
    threat_types: threatType = [],
    result = "",
    location = "",
  } = ttData || {};
  const isNoData = JSON.stringify(ttData) === "{}";

  const [customColorsValue, setCustomColorsValue] = useState<number>(0);

  React.useEffect(() => {
    // threatLevel && setLoading(false);
    setCustomColorsValue(threatLevel === 0 ? 0 : Math.abs(threatLevel - 5.5));
  }, [threatLevel]);

  // 情报判定tag的渲染
  const renderTag = () => {
    if (
      !(result === "black" || result === "white" || result === "suspicious")
    ) {
      return <div>{result}</div>;
    }
    let backgroundColor = undefined;
    let color = undefined;
    switch (result) {
      case "black": {
        backgroundColor = "#b1130a";
        color = "#fff";
        break;
      }
      case "white": {
        backgroundColor = "#a2cb9f";
        break;
      }
      case "suspicious": {
        backgroundColor = "#f2cc8f";
        break;
      }
    }
    return (
      <EuiNotificationBadge
        style={{
          backgroundColor,
          color,
          padding: "0 5px",
          lineHeight: "30px",
          height: "30px",
          borderRadius: "5px",
        }}
      >
        {result}
      </EuiNotificationBadge>
    );
  };

  // 渲染威胁等级
  const renderShowLevel = () => {
    if (!!loading) {
      return <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>;
    }
    return (
      <div style={{ width: "350px" }}>
        <EuiNotificationBadge
          style={{
            backgroundColor:
              threatLevel === 0
                ? "#D3DAE6"
                : customColorsLevels[Math.abs(threatLevel - 5)].color,
            color: "#fff",
            lineHeight: "30px",
            height: "30px",
            marginLeft: levelPx[threatLevel],
          }}
        >
          {threatLevel !== 0 ? threat_levelArray[threatLevel] : undefined}
        </EuiNotificationBadge>
        <EuiRange
          value={customColorsValue}
          min={0}
          max={5}
          levels={customColorsLevels}
          step={0.001}
          style={{ cursor: "default" }}
        />
      </div>
    );
  };

  return (
    <EuiPanel
      hasShadow={false}
      className={style["tencent-threat-panel-container"]}
    >
      {ttMsg ? (
        <EuiCard
          title={intl.get("eui.home.tabs.queryStatus")}
          textAlign="left"
          titleSize="xs"
          style={{ color: "#BD271E" }}
        >
          <EuiHorizontalRule />
          <EuiNotificationBadge
            style={{
              lineHeight: "30px",
              height: "30px",
              color: "#fec514",
              border: "1px solid #eee",
              backgroundColor: "#fff",
            }}
          >
            <>{ttMsg}</>
            <EuiSkeletonText
              isLoading={ttMsg ? false : true}
              lines={1}
            ></EuiSkeletonText>
          </EuiNotificationBadge>
        </EuiCard>
      ) : (
        <>
          <EuiCard
            title={intl.get("eui.home.tabs.geoLocation")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            {!loading && location}
            {isNoData && noData}
            <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>
          </EuiCard>
          <EuiCard
            title={intl.get("eui.home.tabs.reportJugde")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            {!loading && renderTag()}
            {isNoData && noData}
            <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>
          </EuiCard>
          <EuiCard
            title={intl.get("eui.home.tabs.threatTag")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            {!loading &&
              unique(tags).map((item, index) => {
                return (
                  <EuiNotificationBadge
                    key={`${item}${index}`}
                    style={{
                      backgroundColor: "#D3DAE6",
                      color: "#111",
                      lineHeight: "30px",
                      height: "30px",
                      border: "1px solid #eee",
                      marginRight: "10px",
                    }}
                  >
                    {item}
                  </EuiNotificationBadge>
                );
              })}
            {isNoData && noData}
            <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>
          </EuiCard>
          <EuiCard
            title={intl.get("eui.home.tabs.threatType")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            {!loading &&
              unique(threatType)?.map((item, index) => {
                return (
                  <EuiNotificationBadge
                    key={`${item}${index}`}
                    style={{
                      backgroundColor: "#D3DAE6",
                      color: "#111",
                      lineHeight: "30px",
                      height: "30px",
                      border: "1px solid #eee",
                      marginRight: "10px",
                    }}
                  >
                    {item}
                  </EuiNotificationBadge>
                );
              })}
            {isNoData && noData}
            <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>
          </EuiCard>
          <EuiCard
            title={intl.get("eui.home.tabs.threatLevel")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            {!loading && !isNoData && renderShowLevel()}
            {isNoData && noData}
            <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>
          </EuiCard>
        </>
      )}
    </EuiPanel>
  );
};

export default TencentThreatPanel;
