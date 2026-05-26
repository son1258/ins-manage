"use client";

import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";

interface Props {
    label?: string;
    value?: any;
    picker?: "date" | "month" | "year";
    onChange?: (dateString: any) => void;
    required?: boolean;
    readOnly?: boolean;
    className?: string;
    placeholder?: string;
    defaultValue?: any;
    conditionDate?: any;
    format?: any;
    isError?: boolean;
}

export default function DatePickerCustom({
    label,
    value,
    picker,
    onChange,
    required = false,
    readOnly = false,
    className = "",
    placeholder = "",
    defaultValue = "",
    conditionDate = "",
    format = "",
    isError = false
}: Props) {

    const handleDateChange = (date: any) => {
        if (!date) {
            onChange?.(null);
            return;
        }
        onChange?.(date.format("YYYY-MM-DD"));
    };
    const parsedValue = value && dayjs(value, "YYYY-MM-DD", true).isValid() ? dayjs(value) : null;

    return (
        <ConfigProvider
            locale={locale}
            theme={{
                token: {
                    colorError: "#ef4444",
                    colorErrorHover: "#dc2626",
                    colorErrorBg: "#fef2f2",
                },
                components: {
                    DatePicker: {
                        colorBorder: "#d1d5db",
                        hoverBorderColor: "#d1d5db",
                        activeBorderColor: "#d1d5db",
                        boxShadow: "none",
                        activeShadow: "none",

                        borderRadius: 4,
                        colorBgContainer: readOnly ? "#e5e7eb" : (isError ? "#fef2f2" : "#ffffff"),
                    },
                }
            }}
        >
            <div className={`flex flex-col gap-1 ${className}`}>
                {label && (
                    <label className="text-sm font-medium text-gray-700 mb-1.5">
                        {required && <span className="text-red-500 mr-1">*</span>}
                        {label}
                    </label>
                )}

                <DatePicker
                    picker={picker}
                    status={isError ? "error" : undefined}
                    value={parsedValue}
                    onChange={handleDateChange}
                    disabled={readOnly}
                    placeholder={placeholder}
                    format={format || "DD-MM-YYYY"}
                    className={`w-full h-8 custom-date-picker`}
                    disabledDate={conditionDate}
                    defaultPickerValue={defaultValue}
                    showNow={false}
                    allowClear
                />
            </div>
        </ConfigProvider>
    );
}