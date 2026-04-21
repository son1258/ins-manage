"use client"

import { useEffect, useState } from 'react';
import InputGroup from '@/components/InputGroup';
import { useTranslations } from 'next-intl';
import { STATUS } from '@/constants';
import { useDispatch } from 'react-redux';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';

interface CollectorForm {
    fullname: string;
    status: number;
    code: string;
    unit: any;
}

export default function User() {
    const t = useTranslations();
    const dispatch = useDispatch();

    const listStatus = [
        {code: STATUS.ACTIVE, name: t('active')},
        {code: STATUS.DEACTIVE, name: t('deactive')},
    ];

    const [formCollector, setFormCollector] = useState<CollectorForm>({
        fullname: "",
        status: STATUS.ACTIVE,
        code: "",
        unit: {}
    })


    const handleValueChange = (nameField: string, value: any) => {
        setFormCollector(prev => ({
            ...prev,
            [nameField]: value
        }))
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('collector_profile')));
    }, [])


    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">{t('collector_profile')}</h1>
                </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-gray-800">{t('basic_info')}</h3>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup 
                                        label={t('fullname')} 
                                        value={"ADMIN"}
                                        onChange={(e) => handleValueChange("fullname", e.target.value)}
                                        required 
                                    />
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-600 mb-1.5">{t('status')}</label>
                                        <select
                                            value={formCollector.status}
                                            onChange={(e)=>handleValueChange("status", e.target.value)}
                                            className="h-8 border border-gray-300 rounded px-3 text-sm outline-none bg-white transition-all">
                                            <option value="" disabled>{t('select_option')}</option>
                                            {listStatus.map((status) => 
                                                <option key={status.code} value={status.code}>{`${status.name}`}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
}