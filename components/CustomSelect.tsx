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
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    className = "",
    mode,
}: Props) {
  return (
    <ConfigProvider
        theme={{
            components: {
            Select: {
                colorBorder: "#d1d5db",  
                hoverBorderColor: "#d1d5db",
                activeBorderColor: "#d1d5db",
                activeOutlineColor: "transparent",
                boxShadow: "none",
                borderRadius: 4,
            },
            },
        }}
    >
        <Select
            mode={mode}
            maxTagCount="responsive"
            value={value}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            className={`h-8 ${className}`}
        />
    </ConfigProvider>
  );
};