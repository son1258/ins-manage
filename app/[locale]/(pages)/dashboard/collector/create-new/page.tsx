"use client"

import InputGroup from '@/components/InputGroup';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface CollectorProps {
    collectorCode: string,
    username: string,
    password: string,
    status: number,
    distributor: any
}

export default function CreateCollector() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const listUnits = [
        {code: "BIPV01U", name: "PVI Thành phố Hồ Chí Minh", status: 0},
        {code: "BIPV012", name: "PVI Thành phố Thủ Đức", status: 1},
    ];

    const [formData, setFormData] = useState<CollectorProps>({
        collectorCode: "",
        username: "",
        password: "",
        status: 1,
        distributor: {}
    });

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }))
    }



    useEffect(() => {
        dispatch(setActiveTitle(t('add_collector')))
    },[])

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                <h2 className="text-white font-bold uppercase tracking-wide">{t('create_new_collector')}</h2>
                </div>
                
                <form className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup 
                            label={t('collector_code')} 
                            onChange={(e) => handleValueChange("collectorCode", e.target.value)}
                            value={formData.collectorCode}
                            required 
                        />
                        <InputGroup 
                            label={t('username')}
                            onChange={(e) => handleValueChange("username", e.target.value)}
                            value={formData.username}
                            required 
                        />
                        <InputGroup 
                            label={t('password')}
                            onChange={(e) => handleValueChange("password", e.target.value)}
                            value={formData.password}
                            type="password" 
                            required 
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold text-gray-700">
                                <span className="text-red-500 mr-1">*</span>{t('unit_payment')}
                            </label>
                            <select
                                value={formData.unit.code}
                                onChange={(e) => handleValueChange("unit", e.target.value)}
                                className="h-8 border border-gray-300 rounded px-3 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500 transition">
                                <option value="">{t('select_unit')}</option>
                                {listUnits.map((unit) => 
                                    <option key={unit.code} value={unit.code}>{`${unit.name}`}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end gap-3">
                        <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded-md text-sm font-bold hover:bg-blue-800 transition shadow-md">
                            {t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}