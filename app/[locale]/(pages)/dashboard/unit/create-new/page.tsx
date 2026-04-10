"use client"

import InputGroup from "@/components/InputGroup";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function CreateNewUnit() {
    const t = useTranslations();

    const listStatus = [
        {code: 0, name: t('active')},
        {code: 1, name: t('deactive')},
    ];

    const [formData, setFormData] = useState({
        unitCode: "",
        unitName: "",
        status: 0
    })

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }


    return (
        <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                    <h2 className="text-white font-bold uppercase tracking-wide">{t('create_new_unit')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputGroup 
                            label={t('unit_code')} 
                            onChange={(e) => handleValueChange("unitCode", e.target.value)}
                            required 
                        />
                        <InputGroup 
                            label={t('unit_name')}
                            onChange={(e) => handleValueChange("unitName", e.target.value)}
                            required 
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">{t('status')}</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleValueChange("status", e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none bg-white transition-all h-8"
                            >
                                <option value="" disabled>{t('select_option')}</option>
                                {listStatus.map((status) => (
                                    <option key={status.code} value={status.code}>{status.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-blue-700 text-white rounded-md text-sm font-bold hover:bg-blue-800 transition shadow-md">
                                Tạo
                        </button>
                    </div>  
                </form>
            </div>
        </div>
    )
}