import React from 'react';

interface Props {
    label: any;
    value?: any;
    required?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    isError?: boolean;
    className?: any;
    prefix?: string;
    suffix?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithAffix = ({
    label,
    value,
    required = false,
    placeholder = "",
    readOnly = false,
    isError = false,
    className = "",
    prefix = "",
    suffix = "",
    onChange
}: Props) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
            </label>
            <div className={`flex items-center border rounded px-2 py-1.5 text-sm h-8 transition-all
                ${isError
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : readOnly
                        ? 'border-gray-300 bg-gray-200 cursor-not-allowed'
                        : 'border-gray-300 bg-white'
                }
            `}>
                {prefix && <span className="text-gray-500 whitespace-nowrap mr-1">{prefix}</span>}
                <input
                    onChange={onChange}
                    value={value ?? ""}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className="outline-none w-full bg-transparent text-black"
                />
                {suffix && <span className="text-gray-500 whitespace-nowrap ml-1">{suffix}</span>}
            </div>
        </div>
    );
};

export default InputWithAffix;