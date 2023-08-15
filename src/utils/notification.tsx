/*
 * notification.tsx - 全局提示
 * @date: 2023-08-13
 * @author: Zip <Zepeng.huang@cloudfall.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2023, CloudFall
 */
import React, { useState, useImperativeHandle } from "react";
import { EuiGlobalToastList } from "@elastic/eui";
import { Toast } from "@elastic/eui/src/components/toast/global_toast_list";
import intl from "@/utils/intl";

interface ToastObject {
  id?: string;
  title?: string;
  color?: string;
  iconType?: string;
  text: Element | HTMLElement | React.ReactElement;
}
interface NewToastObject {
  title?: string;
  iconType?: string;
  text: Element | HTMLElement | React.ReactElement;
}
export type NotificationRef = {
  success: (newToast: NewToastObject) => void;
  warn: (newToast: NewToastObject) => void;
  error: (newToast: NewToastObject) => void;
  info: (newToast: NewToastObject) => void;
};
type notificationType = "info" | "warning" | "error" | "success";

let idCount: number = -1;
const WrapNotification = (
  props: any,
  ref: React.ForwardedRef<NotificationRef>
) => {
  const [toasts, setToasts] = useState<Array<ToastObject>>([]);

  const addDefaultFields = (obj: NewToastObject, type: notificationType) => {
    Object.assign(obj, { id: String(idCount) });
    if (obj.title) return;
    switch (type) {
      case "success": {
        Object.assign(obj, {
          title: intl.get("eui.common.notification.success"),
        });
        break;
      }
      case "info": {
        Object.assign(obj, {
          title: intl.get("eui.common.notification.info"),
        });
        break;
      }
      case "error": {
        Object.assign(obj, {
          title: intl.get("eui.common.notification.error"),
        });
        break;
      }
      case "warning": {
        Object.assign(obj, {
          title: intl.get("eui.common.notification.warning"),
        });
        break;
      }
    }
  };

  useImperativeHandle(ref, () => ({
    // 向父组件暴露的方法
    success: (newToast: NewToastObject) => {
      Object.assign(newToast, { color: "success" });
      addDefaultFields(newToast, "success");
      idCount += 1;
      setToasts(toasts.concat([newToast]));
    },
    warn: (newToast: NewToastObject) => {
      Object.assign(newToast, { color: "warning" });
      addDefaultFields(newToast, "warning");
      idCount += 1;
      setToasts(toasts.concat([newToast]));
    },
    error: (newToast: NewToastObject) => {
      Object.assign(newToast, { color: "danger" });
      addDefaultFields(newToast, "error");
      idCount += 1;
      setToasts(toasts.concat([newToast]));
    },
    info: (newToast: NewToastObject) => {
      addDefaultFields(newToast, "info");
      idCount += 1;
      setToasts(toasts.concat([newToast]));
    },
  }));

  // 移除Toast，不移除将出错
  const removeToast = (removedToast: Toast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  return (
    <EuiGlobalToastList
      toasts={toasts as any}
      dismissToast={removeToast}
      toastLifeTimeMs={2500}
    />
  );
};

// 全局notification-ref变量
let refObj: any;
const setRefNode = (refNode: React.RefObject<NotificationRef> | undefined) => {
  if (!refNode) return;
  refObj = refNode;
};
const success = (newToast: NewToastObject) => {
  if (!refObj.current) return;
  refObj.current.success(newToast);
};
const warn = (newToast: NewToastObject) => {
  if (!refObj.current) return;
  refObj.current.warn(newToast);
};
const info = (newToast: NewToastObject) => {
  if (!refObj.current) return;
  refObj.current.info(newToast);
};
const error = (newToast: NewToastObject) => {
  if (!refObj.current) return;
  refObj.current.error(newToast);
};

const exportObj = {
  WrapedNotification: React.forwardRef<NotificationRef, any>(WrapNotification),
  setRefNode,
  success,
  info,
  warn,
  error,
};

export default exportObj;
