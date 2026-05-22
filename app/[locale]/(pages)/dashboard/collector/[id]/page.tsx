"use client"

import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { handleApiError } from "@/utils/errorHandler";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import InputGroup from "@/components/InputGroup";
import { toast } from "react-toastify";
import CustomSelect from "@/components/CustomSelect";
import { useCollectorDetail, useUpdateCollectorMutation } from "@/hooks/useCollector";
import { useProviderList } from "@/hooks/useProvider";

export default function EditDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const params: any = useParams();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken') || "";

    const [formData, setFormData] = useState({
        providerId: "",
        collectorId: "",
        collectorCode: "",
        collectorName: "",
    });

    const [errors, setErrors] = useState<any>({
        collectorCode: false,
        collectorName: false
    });

    const { data: providersRes, isLoading: isLoadProviders, isError: errLoadProviders } = useProviderList(accessToken);
    const {data: collectorResp, isLoading: isLoadCollector, isError: errCollectorDetail} = useCollectorDetail(params.id, accessToken);
    const providers = errLoadProviders ? [] : providersRes?.data.map((item: any) => ({
        label: item.name,
        value: item.id
    }));

    const collectorDetail = errCollectorDetail ? [] : collectorResp?.data;
    const updateCollector = useUpdateCollectorMutation(accessToken);

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }));

        if (nameField == "collectorCode" || nameField == "collectorName") {
            setErrors((prev: any) => ({
                ...prev,
                [nameField]: !value
            })) 
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasError = Object.values(errors).some(value => value === true);
        if (hasError) {
            toast.error(t('err_field_required'));
        }
        if (!accessToken || hasError) return;
        updateCollector.mutate({
            provider_id: formData.providerId,
            id: formData.collectorId,
            code: formData.collectorCode,
            name: formData.collectorName
        }, {
            onSuccess: () => {
                toast.success(t('success'));
                router.back();
            },
            onError: (err: any) => {
                handleApiError(err, t)
            }
        })
    }

    useEffect(() => {
        if (collectorDetail) {
            setFormData({
                providerId: collectorDetail.provider.id,
                collectorId: collectorDetail.id,
                collectorCode: collectorDetail.code,
                collectorName: collectorDetail.name,
            })
        }
    },[collectorDetail])

    useEffect(() => {
        dispatch(setActiveTitle(t('update_collector')));
    }, [t])
    
    return (
         <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                    <h2 className="text-white font-bold uppercase tracking-wide">{t('info_distributor')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-gray-700 mb-1">
                                    <span className="text-red-500 mr-1">*</span>{t('agency_name')}
                            </label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.providerId} 
                                onChange={(value) => handleValueChange("providerId", value)}
                                options={providers && providers.map((provider: any) => ({
                                    value: provider.value,
                                    label: provider.label,
                                }))}
                            />
                        </div>
                        <InputGroup 
                            label={t('collector_code')}
                            value={formData.collectorCode}
                            onChange={(e) => handleValueChange("collectorCode", e.target.value)}
                            isError={errors.collectorCode}
                            required
                        />
                        <InputGroup 
                            label={t('collector_name')}
                            value={formData.collectorName}
                            onChange={(e) => handleValueChange("collectorName", e.target.value)}
                            isError={errors.collectorName}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-blue-700 text-white rounded-md text-sm font-bold hover:bg-blue-800 transition shadow-md">
                                {t('update')}
                        </button>
                    </div>  
                </form>
            </div>
            <Loading stateShow={isLoadProviders || isLoadCollector || updateCollector.isPending} />
        </div>
    )
}