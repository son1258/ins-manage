"use client"

import CustomSelect from '@/components/CustomSelect';
import InputGroup from '@/components/InputGroup';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useCreateCollectorMutation } from '@/hooks/useCollector';
import { useProviderList } from '@/hooks/useProvider';
import { handleApiError } from '@/utils/errorHandler';

export default function CreateCollector() {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useDispatch();
    const accessToken = Cookies.get('accessToken') || "";

    const [formData, setFormData] = useState({
        providerId: "",
        code: "",
        name: "",
    });

    const [errors, setErrors] = useState<any>({
        providerId: false,
        code: false,
        name: false,
    })
    const { data: providersRes, isLoading: isLoadProviders, isError: errLoadProviders } = useProviderList(accessToken);
    const providers = errLoadProviders ? [] : providersRes?.data
    const createMutation = useCreateCollectorMutation(accessToken);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isInvalid = !formData.providerId || !formData.code.trim() || !formData.name.trim();
        if (isInvalid) {
            toast.error(t('err_field_required'));
            return;
        }
        createMutation.mutate({
            provider_id: formData.providerId,
            code: formData.code,
            name: formData.name
        }, {
            onSuccess: (resp) => {
                if (resp?.success) {
                    toast.success(t('success'));
                    router.back();
                }
            },
            onError: (err) => {
                handleApiError(err, t);
            }
        })
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('add_collector')));
    },[t])

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
                                <span className="text-red-500 mr-1">*</span>{t('agency_name')}
                            </label>
                           <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.providerId || undefined} 
                                onChange={(value) => handleValueChange("providerId", value)}
                                options={providers && providers.map((provider: any) => ({
                                    value: provider.id,
                                    label: provider.name,
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
            <Loading stateShow={isLoadProviders} />
        </div>
    );
}