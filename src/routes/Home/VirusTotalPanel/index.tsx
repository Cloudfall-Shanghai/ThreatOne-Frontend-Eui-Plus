/*
 * VirusTotalPanel - VirusTotal展示组件
 * @date: 2023-08-15
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import intl from "@/utils/intl";
import {
  EuiCard,
  EuiPanel,
  EuiHorizontalRule,
  EuiNotificationBadge,
  EuiSkeletonText,
} from "@elastic/eui";

import styles from "./index.module.scss";

interface vtData {
  country?: string;
  last_analysis_results?: {
    total_results?: { [key: string]: string };
  };
  last_analysis_stats?: {
    malicius_results_count?: number;
    total_results_count?: number;
  };
  url?: string;
}
interface Iipdata {
  tt_data?: object;
  tt_msg?: string;
  vt_data?: vtData;
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
// const noData = intl.get("eui.common.view.nodata");

const VirusTotalPanel = (props: Iprops) => {
  // 解构props
  const {
    ipData: { vt_data: vtData = {}, vt_msg: vtMsg = "" },
    loading = false,
  } = props || {};
  const {
    country = "",
    last_analysis_results: lastAnalysisResult = {},
    last_analysis_stats: lastAnalysisStatus = {},
    url = "",
  } = vtData || {};
  const { total_results: totalResults = {} } = lastAnalysisResult || {};
  const {
    malicius_results_count: maliciusResultsCount,
    total_results_count: totalResultsCount,
  } = lastAnalysisStatus || {};
  // const isNoData = JSON.stringify(vtData) === "{}";

  // 数据处理
  const getData = () => {
    let CleanList: { labtab: string; lab: string }[] = [];
    let UnratedList: { labtab: string; lab: string }[] = [];
    let WarningList: { labtab: string; lab: string }[] = [];

    let DataList = {
      CleanList: CleanList,
      UnratedList: UnratedList,
      WarningList: WarningList,
    };

    for (let key in totalResults) {
      if (totalResults[key] === "clean") {
        CleanList.push({ labtab: totalResults[key], lab: key });
      } else if (totalResults[key] === "unrated") {
        UnratedList.push({ labtab: totalResults[key], lab: key });
      } else if (
        totalResults[key] !== "unrated" &&
        totalResults[key] !== "clean"
      ) {
        WarningList.push({ labtab: totalResults[key], lab: key });
      }
    }
    return DataList;
  };

  return (
    <EuiPanel
      hasShadow={false}
      className={styles["tencent-threat-panel-container"]}
    >
      {vtMsg ? (
        <EuiPanel>
          <EuiCard
            title={intl.get("eui.home.panel.queryStatus")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px", display: "none", color: "#BD271E" }}
          >
            {vtMsg}
            <EuiSkeletonText
              isLoading={vtMsg ? false : true}
              lines={1}
            ></EuiSkeletonText>
          </EuiCard>
        </EuiPanel>
      ) : (
        <>
          <EuiCard
            title={intl.get("eui.common.view.basicMsg")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px", position: "relative" }}
          >
            <EuiHorizontalRule />
            <EuiSkeletonText isLoading={loading} lines={1}>
              {!loading ? (
                <>
                  <div style={{ marginBottom: "8px" }}>
                    <span>{intl.get("eui.home.text.checkproportion")}:</span>
                    <span>
                      <span>
                        <span style={{ color: "#b1130a" }}>
                          {maliciusResultsCount}
                        </span>
                        <span>{totalResultsCount ? " / " : ""}</span>
                        <span>{totalResultsCount}</span>
                      </span>
                    </span>
                  </div>
                  <div>
                    <span>{intl.get("eui.home.tabs.geoLocation")}:</span>
                    <span>{country}</span>
                  </div>
                </>
              ) : (
                <div></div>
              )}
              <a
                href={url}
                target="blank"
                style={{ display: loading ? "none" : "block" }}
                className={styles.more}
              >
                {intl.get("eui.common.button.more")}
              </a>
            </EuiSkeletonText>
          </EuiCard>
          <EuiCard
            title={intl.get("eui.home.tabs.checkedProject")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            <EuiSkeletonText isLoading={loading} lines={1}>
              <div className={styles.vtBox}>
                {getData().WarningList.map((item, index) => {
                  return (
                    <div className={styles.vtBoxItem} key={index}>
                      <span className="waringLab">{item.lab}</span>
                      <EuiNotificationBadge
                        className={styles.tag}
                        style={{ backgroundColor: "#b1130a", color: "#fff" }}
                      >
                        {item.labtab}
                      </EuiNotificationBadge>
                    </div>
                  );
                })}
              </div>
            </EuiSkeletonText>
          </EuiCard>
          <EuiCard
            title={intl.get("eui.home.tabs.securityProject")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            <EuiSkeletonText isLoading={loading} lines={1}>
              <div className={styles.vtBox}>
                {getData().CleanList.map((item, index) => {
                  return (
                    <div className={styles.vtBoxItem} key={index}>
                      <span className={styles.cleanLab}>{item.lab}</span>
                      <EuiNotificationBadge
                        className={styles.tag}
                        style={{ backgroundColor: "#a2cb9f", color: "#fff" }}
                      >
                        {item.labtab}
                      </EuiNotificationBadge>
                    </div>
                  );
                })}
              </div>
            </EuiSkeletonText>
          </EuiCard>
          <EuiCard
            title={intl.get("eui.home.tabs.unknownProject")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />

            <EuiSkeletonText isLoading={loading} lines={1}>
              <div className={styles.vtBox}>
                {getData().UnratedList.map((item, index) => {
                  return (
                    <div className={styles.vtBoxItem} key={index}>
                      <span className="unratedLab">{item.lab}</span>
                      <EuiNotificationBadge
                        className={styles.tag}
                        style={{ backgroundColor: "#D3DAE6", color: "#111" }}
                      >
                        {item.labtab}
                      </EuiNotificationBadge>
                    </div>
                  );
                })}
              </div>
            </EuiSkeletonText>
          </EuiCard>
        </>
      )}
    </EuiPanel>
  );
};

export default VirusTotalPanel;
