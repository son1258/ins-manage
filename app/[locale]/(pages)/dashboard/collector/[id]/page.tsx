"use client"

import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react"
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { handleApiError } from "@/utils/errorHandler";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import InputGroup from "@/components/InputGroup";
import { toast } from "react-toastify";
import CustomSelect from "@/components/CustomSelect";
import { STATUS } from "@/constants";
import { useDistributorList } from "@/hooks/useDistributor";
import { useCollectorDetail, useUpdateCollectorMutation } from "@/hooks/useCollector";

export default function EditDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const locale = useLocale();
    const params: any = useParams();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken') || "";
    const [isLoading, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        distributorId: "",
        collectorId: "",
        collectorCode: "",
        collectorName: "",
    });

    const [errors, setErrors] = useState<any>({
        collectorCode: false,
        collectorName: false
    });

    const {data: distributorsResp, isLoading: isLoadDistributor, isError: errDistributor} = useDistributorList({status: STATUS.ACTIVE}, accessToken)
    const {data: collectorResp, isLoading: isLoadCollector, isError: errCollectorDetail} = useCollectorDetail(params.id, accessToken);
    const distributors = errDistributor ? [] : distributorsResp?.data.map((item: any) => ({
        label: `${item.code}_${item.name}`,
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
            distributor_id: formData.distributorId,
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
                distributorId: collectorDetail.distributor_id,
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
                                    <span className="text-red-500 mr-1">*</span>{t('unit_payment')}
                            </label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.distributorId} 
                                onChange={(value) => handleValueChange("distributorId", value)}
                                options={distributors && distributors.map((distributor: any) => ({
                                    value: distributor.value,
                                    label: distributor.label,
                                }))}
                            />
                        </div>
                        <InputGroup 
                            label={t('collector_code')}
                            value={formData.collectorCode}
                            onChange={(e) => handleValueChange("collectorCode", e.target.value)}
                            isError={errors.collectorCode}
                        />
                        <InputGroup 
                            label={t('collector_name')}
                            value={formData.collectorName}
                            onChange={(e) => handleValueChange("collectorName", e.target.value)}
                            isError={errors.collectorName}
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
            <Loading stateShow={isLoadDistributor || isLoadCollector || updateCollector.isPending} />
        </div>
    )
}