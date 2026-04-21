"use client";

import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";

const { RangePicker } = DatePicker;

interface Props {
    label?: string;
    fromDate?: any;
    toDate?: any;
    fieldFrom?: any;
    fieldTo?: any;
    onChange?: (field: string, value: any) => void;
    picker?: "date" | "month" | "year"; 
    required?: boolean;
    readOnly?: boolean;
    className?: string;
}

export default function DateRangePicker({
    label,
    fromDate,
    toDate,
    fieldFrom,
    fieldTo,
    onChange,
    picker = "date",
    required = false,
    readOnly = false,
    className = "",
}: Props) {
    const formatMap = {
        date: "YYYY-MM-DD",
        month: "YYYY-MM",
        year: "YYYY",
    };

    const value = [
        fromDate ? dayjs(fromDate) : null,
        toDate ? dayjs(toDate) : null,
    ];

    const handleRangeChange = (dates: any) => {
        if (!dates) {
        onChange?.(fieldFrom, null);
        onChange?.(fieldTo, null);
        return;
        }
        const format = formatMap[picker];
        onChange?.(fieldFrom, dates[0]?.format(format));
        onChange?.(fieldTo, dates[1]?.format(format));
    };

    return (
        <ConfigProvider locale={locale}>
            <div className={`flex flex-col gap-1 ${className}`}>
                {label && (
                    <label className="text-sm font-medium text-gray-700 mb-1.5">
                        {required && <span className="text-red-500 mr-1">*</span>}
                        {label}
                    </label>
                )}

                <RangePicker
                    picker={picker}
                    value={value as any}
                    onChange={handleRangeChange}
                    disabled={readOnly}
                    format="DD/MM/YYYY"
                    className="w-full h-8 custom-range-picker"
                />
            </div>
        </ConfigProvider>
    );
}