"use client"

import { Provider } from "react-redux";
import { ReactNode, useState } from "react";
import { store } from "@/lib/redux/store";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleApiError } from "@/utils/errorHandler";

interface Props {
  children: ReactNode;
  locale: string;
  messages: any;
}

export default function AppProviders({ children, locale, messages }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        throwOnError: false,
        refetchOnWindowFocus: false
      },
    },
    queryCache: new QueryCache({
      onError: (error: any, query) => {
        toast.error(locale == 'en' ? "Load data failed!" : "Tải dữ liệu thất bại!")
      }
    })
  }))
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Ho_Chi_Minh">
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </NextIntlClientProvider>
      </QueryClientProvider>
    </Provider>
  );
}