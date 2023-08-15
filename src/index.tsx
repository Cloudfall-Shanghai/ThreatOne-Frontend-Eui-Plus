import React from "react";
import ReactDOM from "react-dom/client";
import { EuiProvider } from "@elastic/eui";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "@/config/router";
import notificationObj from "@/utils/notification";
import { NotificationRef } from "@/utils/notification";

import "./index.css";
import "@elastic/eui/dist/eui_theme_light.css";

const { WrapedNotification, setRefNode } = notificationObj;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const EuiContainer = () => {
  const refNode = React.useRef<NotificationRef>(null);
  setRefNode(refNode); // 存储全局ref
  return (
    <>
      <RouterProvider router={router} />
      <WrapedNotification ref={refNode} />
    </>
  );
};

root.render(
  <React.StrictMode>
    <EuiProvider>
      <EuiContainer />
    </EuiProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
