import React from 'react';

interface Props {
    label: any, 
    value?: any, 
    required?: boolean, 
    type?: string, 
    placeholder?: string, 
    readOnly?: boolean,
    isError?: boolean,
    className?: any, 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup = ({ 
    label, 
    value, 
    required = false, 
    type = "text", 
    placeholder = "", 
    readOnly = false,
    isError = false,
    className = "",
    onChange 
} : Props) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
            </label>
            <input
                type={type}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`border rounded px-2 py-1.5 text-sm text-black outline-none transition-all h-8
                    ${isError 
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white'
                    }
                    ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}
                `}
            />
        </div>
    );
};

export default InputGroup;