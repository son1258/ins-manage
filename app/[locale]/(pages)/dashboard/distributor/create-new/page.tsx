"use client"

import InputGroup from "@/components/InputGroup";
import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { handleApiError } from "@/utils/errorHandler";
import { createDistributor } from "@/services/distributorService";
import CustomSelect from "@/components/CustomSelect";
import { loadProviders } from "@/services/providerService";

export default function CreateNewDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const accessToken = Cookies.get('accessToken');
    const [isLoading, setIsLoading] = useState(false);
    const [providers, setProviders] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        providerId: "",
        distributorCode: "",
        distributorName: ""
    });

    const [errors, setErrors] = useState<any>({
        distributorCode: false,
        distributorName: false,
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

    const getProviders = async () => {
        if (!accessToken) return;
        try {
            setIsLoading(true);
            const resp = await loadProviders(accessToken);
            if (resp && resp.data) {
                setProviders(resp.data);
            }
        } catch(err: any) {
            console.log('Error get providers: ', err);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
    }

    const resetForm = () => {
        setFormData({
            providerId: "",
            distributorCode: "",
            distributorName: ""
        });

        setErrors({
            distributorCode: false,
            distributorName: false,
        }); 
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const data = {
                provider_id: formData.providerId,
                code: formData.distributorCode,
                name: formData.distributorName
            }
            if (!accessToken) return;
            const resp = await createDistributor(data, accessToken);
            if (resp && resp.success) {
                toast.success(t('success'));
                resetForm();
            }
        } catch (err: any) {
            console.log('Error create distributor:', err.message);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('add_distributor')));
        getProviders();
    },[])

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                    <h2 className="text-white font-bold uppercase tracking-wide">{t('create_new_distributor')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('social_ins_authority')}<span className="text-red-500 mr-1">*</span></label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.providerId || undefined} 
                                onChange={(value) => handleValueChange("providerId", value)}
                                options={providers.map((provider: any) => ({
                                    value: provider.id,
                                    label: `${provider.name} (${provider.code})`,
                                }))}
                            />
                        </div>
                        <InputGroup 
                            label={t('distributor_code')}
                            value={formData.distributorCode}
                            onChange={(e) => handleValueChange("distributorCode", e.target.value)}
                            isError={errors.distributorCode}
                            required 
                        />
                        <InputGroup 
                            label={t('distributor_name')}
                            value={formData.distributorName}
                            onChange={(e) => handleValueChange("distributorName", e.target.value)}
                            isError={errors.distributorName}
                            required 
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-blue-700 text-white rounded-md text-sm font-bold hover:bg-blue-800 transition shadow-md">
                                {t('create')}
                        </button>
                    </div>  
                </form>
            </div>
            <Loading stateShow={isLoading} />
        </div>
    )
}