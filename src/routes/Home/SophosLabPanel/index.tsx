/*
 * SophosLabPanel - 腾讯威胁面板展示组件
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
  EuiToolTip,
  EuiNotificationBadge,
  EuiSkeletonText,
} from "@elastic/eui";

interface spData {
  category?: string[];
  result?: string;
}
interface Iipdata {
  tt_data?: object;
  tt_msg?: string;
  vt_data?: Object;
  vt_msg?: string;
  sp_data?: spData;
  sp_msg?: string;
  geo_data?: object;
  geo_msg?: string;
}
interface Iprops {
  ipData: Iipdata;
  loading: boolean;
}

const IPCATEGORY: { [key: string]: string } = {
  malware: "Known source of malware",
  botnet: "Known FUR, TFX and RIP bot proxy IP",
  spam_mta: "Known spam network",
  phishing: "Known source of phishing",
  enduser_network: "Known dynamic IP",
  generic_mta: "Known mail server",
  clean_mta: "Known whitelisted mail server",
  free_mta: "Known free email service provider",
  bulk_mta: "Known bulk email service provider",
  isp_mta: "Known ISP's outbound mail server",
  biz_mta: "Known corporate email service provider",
  bulk_mta_grey: "Known grey bulk email service provider",
  news_mta: "Known newsletter provider",
  notifications_mta: "Notification alert",
  illegal: "Suspected criminal source",
};
const noData = intl.get("eui.common.view.nodata");

const SophosLabPanel = (props: Iprops) => {
  // 解构props
  const { ipData = {}, loading = false } = props;
  const { sp_data: spData = {}, sp_msg: spMsg = "" } = ipData || {};
  const { result = "" } = spData;
  const isNoData = !result;

  const renderResult = () => {
    if (result !== "black" && result !== "white" && result !== "suspicious") {
      return <></>;
    }
    return (
      <EuiNotificationBadge
        style={{
          backgroundColor:
            result === "black"
              ? "#b1130a"
              : result === "white"
              ? "#a2cb9f"
              : "#f2cc8f",
          color: "#fff",
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

  return (
    <EuiPanel hasShadow={false}>
      {spMsg ? (
        <EuiCard
          title={intl.get("eui.home.tabs.queryStatus")}
          textAlign="left"
          titleSize="xs"
          style={{
            marginBottom: "20px",
            color: "#bd271e",
          }}
        >
          <EuiHorizontalRule />
          {spMsg}
          <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>
        </EuiCard>
      ) : (
        <>
          <EuiCard
            title={intl.get("eui.home.tabs.reportJugde")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            {!loading && renderResult()}
            {isNoData && noData}
            <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>
          </EuiCard>
          <EuiCard
            title={intl.get("eui.home.tabs.ipSort")}
            textAlign="left"
            titleSize="xs"
            style={{ marginBottom: "20px" }}
          >
            <EuiHorizontalRule />
            {!loading &&
              spData?.category?.map((item, index) => {
                return (
                  <EuiToolTip
                    position="top"
                    content={IPCATEGORY[item]}
                    key={`${item}${index}`}
                  >
                    <EuiNotificationBadge
                      key={`${item}${index}`}
                      style={{
                        backgroundColor: "#D3DAE6",
                        color: "#111",
                        padding: "0 5px",
                        lineHeight: "30px",
                        height: "30px",
                        borderRadius: "5px",
                        marginRight: "10px",
                      }}
                    >
                      {item}
                    </EuiNotificationBadge>
                  </EuiToolTip>
                );
              })}
            {isNoData && noData}
            <EuiSkeletonText isLoading={loading} lines={1}></EuiSkeletonText>
          </EuiCard>
        </>
      )}
    </EuiPanel>
  );
};

export default SophosLabPanel;
