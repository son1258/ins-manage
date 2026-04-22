"use client"

import { useEffect, useState } from 'react';
import InputGroup from '@/components/InputGroup';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import Cookies from 'js-cookie';

interface CollectorForm {
    fullname: string;
    status: number;
    code: string;
    unit: any;
}

export default function EditColection() {
    const t = useTranslations();
    const params: any = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken');
    const [isLoading, setIsLoading] = useState(false);

    const listUnits = [
        {code: "BIPV01U", name: "PVI Thành phố Hồ Chí Minh", status: 0},
        {code: "BIPV012", name: "PVI Thành phố Thủ Đức", status: 1},
    ];

    const listStatus = [
        {code: 0, name: t('active')},
        {code: 1, name: t('deactive')},
    ];

    const [formCollector, setFormCollector] = useState<CollectorForm>({
        fullname: "",
        status: 0,
        code: "",
        unit: {}
    })

    const handleValueChange = (nameField: string, value: any) => {
        if (nameField == "unit") {
            const selectedUnit = listUnits.find(unit => unit.code == value);
            value = selectedUnit;
        }
        setFormCollector(prev => ({
            ...prev,
            [nameField]: value
        }))
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('update_collection')));
        // const getDistributor = async () => {
        //     if (!accessToken) return;
        //     try {
        //         setIsLoading(true);
        //         const resp = await loadCollectionById(params.id, accessToken);
        //         if (resp) {
        //             setDistributor(resp.data);
        //         }
        //     } catch(err: any) {
        //         console.log('Error get distributor: ', err);
        //         handleApiError(err, t);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }
    
        // getDistributor();
    }, [params.id])

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
                                        label={t('collection_name')} 
                                        value={formCollector.fullname}
                                        onChange={(e) => handleValueChange("fullname", e.target.value)}
                                        required 
                                    />
                                    <InputGroup 
                                        label={t('collection_code')} 
                                        value={formCollector.code} 
                                        onChange={(e) => handleValueChange("code", e.target.value)}
                                        readOnly 
                                    />
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-semibold text-gray-700">
                                            <span className="text-red-500 mr-1">*</span>{t('unit_payment')}
                                        </label>
                                        <select
                                            value={formCollector.unit.code}
                                            onChange={(e) => handleValueChange("unit", e.target.value)}
                                            className="h-8 border border-gray-300 rounded px-3 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500 transition">
                                            <option value="">{t('select_distributor')}</option>
                                            {listUnits.map((unit) => 
                                                <option key={unit.code} value={unit.code}>{`${unit.name}`}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-600">{t('status')}</label>
                                        <select
                                            value={formCollector.status}
                                            onChange={(e)=>handleValueChange("status", e.target.value)}
                                            className="h-8 border border-gray-300 rounded px-3 text-sm outline-none bg-white transition-all">
                                            <option value="" disabled>{t('select_option')}</option>
                                            {listStatus.map((status) => 
                                                <option key={status.code} value={status.code}>{`${status.name.toUpperCase()}`}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                                        {t('save')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
}