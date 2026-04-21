"use client";

import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import { useTranslations } from "next-intl";

const { RangePicker } = DatePicker;

interface Props {
    label?: string;
    fromDate?: any;
    toDate?: any;
    onChange?: (field: "fromDate" | "toDate", value: any) => void;
    required?: boolean;
    readOnly?: boolean;
    className?: string;
}

export default function DateRangePickerAntd ({
    label,
    fromDate,
    toDate,
    onChange,
    required = false,
    readOnly = false,
    className = "",
}: Props) {
    const t = useTranslations();
    const value: [any, any] = [
        fromDate ? dayjs(fromDate) : null,
        toDate ? dayjs(toDate) : null,
    ];

    const handleRangeChange = (dates: any) => {
        if (!dates) {
            onChange?.("fromDate", null);
            onChange?.("toDate", null);
            return;
        }
        onChange?.("fromDate", dates[0].format("YYYY-MM-DD"));
        onChange?.("toDate", dates[1].format("YYYY-MM-DD"));
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
                    value={value}
                    onChange={handleRangeChange}
                    disabled={readOnly}
                    format="DD/MM/YYYY"
                    className="w-full h-8 custom-range-picker" 
                />
            </div>
        </ConfigProvider>
    );
};