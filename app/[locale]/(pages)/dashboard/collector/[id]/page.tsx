"use client"

import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react"
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { handleApiError } from "@/utils/errorHandler";
import { useParams, useRouter } from "next/navigation";
import { loadDistributors } from "@/services/distributorService";
import Loading from "@/components/Loading";
import InputGroup from "@/components/InputGroup";
import { toast } from "react-toastify";
import CustomSelect from "@/components/CustomSelect";
import { loadCollectorById, updateCollector } from "@/services/collectorService";
import { STATUS } from "@/constants";

export default function EditDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const locale = useLocale();
    const params: any = useParams();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken');
    const [distributors, setDistributors] = useState<any[]>([]);
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
        startTransition(async () => {
            try {
                const data = {
                    distributor_id: formData.distributorId,
                    id: formData.collectorId,
                    code: formData.collectorCode,
                    name: formData.collectorName
                }
                const resp = await updateCollector(data, accessToken);
                if (resp && resp.success) {
                    toast.success(t('success'))
                    router.push(`/${locale}/dashboard/collector`);
                }
            } catch(err: any) {
                handleApiError(err, t);
            }
        })
    }

    const getDistributors = async () => {
        if (!accessToken) return;
        startTransition(async () => {
            try {
                const resp = await loadDistributors({status: STATUS.ACTIVE}, accessToken);
                if (resp) {
                    setDistributors(resp.data);
                }
            } catch(err: any) {
                handleApiError(err, t);
            }
        })
    }

    const getCollectorById = async (id: string) => {
        if (!accessToken) return;
        startTransition(async () => {
            try {
                const resp = await loadCollectorById(id, accessToken);
                if (resp && resp.data) {
                    const data = resp.data;
                    const getDataCollector = {
                        distributorId: data.distributor_id,
                        collectorId: data.id,
                        collectorCode: data.code,
                        collectorName: data.name,
                    }
                    setFormData(getDataCollector);
                }
            } catch(err: any) {
                handleApiError(err, t);
            }
        })
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('update_collector')));
        getDistributors();
        getCollectorById(params.id);
    }, [params.id])
    
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
                                options={distributors.map((distributor: any) => ({
                                    value: distributor.id,
                                    label: `${distributor.code}_${distributor.name}`,
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
            <Loading stateShow={isLoading} />
        </div>
    )
}