"use client"

import CustomSelect from '@/components/CustomSelect';
import InputGroup from '@/components/InputGroup';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function CreateCollection() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const listUnits = [
        {code: "BIPV01U", name: "BHXH-G Thành phố Hồ Chí Minh", status: 0},
        {code: "BIPV012", name: "BHXH-G Thành phố Thủ Đức", status: 1},
    ];

    const listDistributors = [
        {code: "ABC01A", name: 'BHXH cơ sở Tân Phú'},
        {code: "ABC02B", name: 'BHXH  cơ sở Nhà Bè'},
        {code: "ABC03C", name: 'BHXH  cơ sở Hóc Môn'},
        {code: "ABC04D", name: 'BHXH cơ sở Tân Nhựt'},
    ]

    const [formData, setFormData] = useState({
        distributorCode: "",
        username: "",
        password: "",
        status: 1,
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
            <div className="max-w-[90%] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                <h2 className="text-white font-bold uppercase tracking-wide">{t('create_new_collector')}</h2>
                </div>
                
                <form className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5 mt-1">
                            <label className="text-sm text-gray-700">
                                <span className="text-red-500 mr-1">*</span>{t('distributor_ins')}
                            </label>
                           <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.distributorCode || undefined} 
                                onChange={(value) => handleValueChange("agencyCode", value)}
                                options={listDistributors.map((distributor: any) => ({
                                    value: distributor.code,
                                    label: `${distributor.code}_${distributor.name}`,
                                }))}
                            />
                        </div>
                        <InputGroup 
                            label={t('collector_code')} 
                            onChange={(e) => handleValueChange("collectorCode", e.target.value)}
                            value={formData.collectorCode}
                            required 
                        />
                        <InputGroup 
                            label={"Tên điểm thu"}
                            onChange={(e) => handleValueChange("username", e.target.value)}
                            value={formData.username}
                            required 
                        />
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