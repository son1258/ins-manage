"use client"

import InputGroup from "@/components/InputGroup";
import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { callApi } from "@/services/callApi";
import Loading from "@/components/Loading";
import { handleApiError } from "@/utils/errorHandler";
import { createDistributor } from "@/services/distributorService";

export default function CreateNewDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const accessToken = Cookies.get('accessToken');
    const [isLoading, setIsloading] = useState(false);

    const [formData, setFormData] = useState({
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

    const resetForm = () => {
        setFormData({
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
            setIsloading(true);
            const data = {
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
            setIsloading(false);
        }
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('add_distributor')))
    },[])

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                    <h2 className="text-white font-bold uppercase tracking-wide">{t('create_new_distributor')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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