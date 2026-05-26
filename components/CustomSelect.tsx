"use client";

import { Select, ConfigProvider } from "antd";

interface Option {
    value: any;
    label: any;
}

interface Props {
    value?: any;
    onChange?: (value: any) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    mode?: "multiple" | "tags";
    isError?: boolean;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    className = "",
    mode,
    isError = false,
}: Props) {
  return (
    <ConfigProvider
        theme={{
            token: {
                colorError: "#ef4444",
                colorErrorHover: "#dc2626",
                colorErrorBg: "#fef2f2",
            },
            components: {
                Select: {
                    colorBorder: "#d1d5db",  
                    hoverBorderColor: "#d1d5db",
                    activeBorderColor: "#d1d5db",
                    activeOutlineColor: "transparent",
                    boxShadow: "none",
                    borderRadius: 4,
                    colorBgContainer: isError ? "#fef2f2" : "#ffffff", 
                },
            },
        }}
    >
        <Select
            showSearch={{
                optionFilterProp: 'label',
                filterSort: (option) => option?.label
            }}
            status={isError ? "error" : undefined}
            mode={mode}
            maxTagCount="responsive"
            value={value}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            className={`custom-multi-select h-8 ${className}`}
        />
    </ConfigProvider>
  );
};