"use client"

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/lib/redux/store";
import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: ReactNode;
  locale: string;
  messages: any;
}

export default function AppProviders({ children, locale, messages }: Props) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Ho_Chi_Minh">
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </NextIntlClientProvider>
    </Provider>
  );
}