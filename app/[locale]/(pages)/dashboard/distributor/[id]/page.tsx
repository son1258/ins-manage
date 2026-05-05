"use client"

import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react"
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { handleApiError } from "@/utils/errorHandler";
import { useParams, useRouter } from "next/navigation";
import { loadDistributorById, updateDistributor } from "@/services/distributorService";
import Loading from "@/components/Loading";
import InputGroup from "@/components/InputGroup";
import { toast } from "react-toastify";

export default function EditDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const locale = useLocale();
    const params: any = useParams();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken');
    const [isLoading, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        distributorId: "",
        distributorCode: "",
        distributorName: ""
    });

    const [errors, setErrors] = useState<any>({
        distributorCode: false,
        distributorName: false
    });

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }));

        setErrors((prev: any) => ({
            ...prev,
            [nameField]: !value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasError = Object.values(errors).some(value => value === true);
        if (!accessToken || hasError) return;
        startTransition(async () => {
            try {
                const data = {
                    id: formData.distributorId,
                    code: formData.distributorCode,
                    name: formData.distributorName
                }
                const resp = await updateDistributor(data, accessToken);
                if (resp && resp.success) {
                    toast.success(t('success'))
                    router.push(`/${locale}/dashboard/distributor`);
                }
            } catch(err: any) {
                console.log('Error update distributor: ', err);
                handleApiError(err, t);
            }
        })
    }

    const getDistributorById = async () => {
        if (!accessToken) return;
        startTransition(async () => {
            try {
                const resp = await loadDistributorById(params.id, accessToken);
                if (resp && resp.data) {
                    const data = {
                        distributorId: resp.data.id,
                        distributorCode: resp.data.code,
                        distributorName: resp.data.name
                    }
                    setFormData(data);
                }
            } catch(err: any) {
                handleApiError(err, t);
            } 
        })
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('update_distributor')));
        getDistributorById();
    }, [params.id])
    
    return (
         <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                    <h2 className="text-white font-bold uppercase tracking-wide">{t('info_distributor')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup 
                            label={t('distributor_code')}
                            value={formData.distributorCode}
                            onChange={(e) => handleValueChange("distributorCode", e.target.value)}
                            isError={errors.distributorCode}
                        />
                        <InputGroup 
                            label={t('distributor_name')}
                            value={formData.distributorName}
                            onChange={(e) => handleValueChange("distributorName", e.target.value)}
                            isError={errors.distributorName}
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