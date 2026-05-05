"use client"

import CustomSelect from '@/components/CustomSelect';
import InputGroup from '@/components/InputGroup';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';
import { loadDistributors } from '@/services/distributorService';
import { handleApiError } from '@/utils/errorHandler';
import { toast } from 'react-toastify';
import { createCollector } from '@/services/collectorService';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';

export default function CreateCollector() {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useDispatch();
    const accessToken = Cookies.get('accessToken');
    const [isLoading, startTransition] = useTransition();
    const [distributors, setDistributors] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        distributorId: "",
        code: "",
        name: "",
    });

    const [errors, setErrors] = useState<any>({
        distributorId: false,
        code: false,
        name: false,
    })

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }));
        
        setErrors((prev: any) => ({
            ...prev,
            [nameField]: !value
        }));
    }

    const getDistributors = async () => {
        if (!accessToken) return;
        startTransition(async () => {
            try {
                const resp = await loadDistributors({status: STATUS.ACTIVE}, accessToken);
                if (resp && resp.data) {
                    setDistributors(resp.data);
                }
            } catch(err) {
                handleApiError(err, t);
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                const data = {
                    distributor_id: formData.distributorId,
                    code: formData.code,
                    name: formData.name
                }
                if (!accessToken) return;
                const resp = await createCollector(data, accessToken);
                if (resp && resp.success) {
                    toast.success(t('success'));
                    router.back();
                }
            } catch (err) {
                handleApiError(err, t);
            }
        })
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('add_collector')));
        getDistributors();
    },[])

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-[90%] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                <h2 className="text-white font-bold uppercase tracking-wide">{t('create_new_collector')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5 mt-1">
                            <label className="text-sm text-gray-700">
                                <span className="text-red-500 mr-1">*</span>{t('distributor_ins')}
                            </label>
                           <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.distributorId || undefined} 
                                onChange={(value) => handleValueChange("distributorId", value)}
                                options={distributors.map((distributor: any) => ({
                                    value: distributor.id,
                                    label: `${distributor.code}_${distributor.name}`,
                                }))}
                            />
                        </div>
                        <InputGroup 
                            label={t('collector_code')} 
                            onChange={(e) => handleValueChange("code", e.target.value)}
                            value={formData.code}
                            isError={errors.code}
                            required 
                        />
                        <InputGroup 
                            label={t('collector_name')}
                            onChange={(e) => handleValueChange("name", e.target.value)}
                            value={formData.name}
                            isError={errors.name}
                            required 
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded-md text-sm font-bold hover:bg-blue-800 transition shadow-md">
                            {t('create')}
                        </button>
                    </div>
                </form>
            </div>
            <Loading stateShow={isLoading} />
        </div>
    );
}