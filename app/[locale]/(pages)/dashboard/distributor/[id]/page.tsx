"use client"

import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { handleApiError } from "@/utils/errorHandler";
import { useParams, useRouter } from "next/navigation";
import { loadDistributorById, updateDistributor } from "@/services/distributorService";
import Loading from "@/components/Loading";
import InputGroup from "@/components/InputGroup";
import { STATUS } from "@/constants";
import { toast } from "react-toastify";

export default function EditDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const params: any = useParams();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken');
    const listStatus = [
        {code: STATUS.ACTIVE, name: t('active')},
        {code: STATUS.DEACTIVE, name: t('deactive')},
    ]; 
    const [distributor, setDistributor] = useState({
        id: "",
        name: "",
        status: STATUS.ACTIVE
    });
    const [errors, setErrors] = useState<any>({
        name: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleValueChange = (nameField: string, value: any) => {
        setDistributor(prev => ({
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
        if (!accessToken) return;
        try {
            setIsLoading(true);
            const data = {
                id: params.id,
                name: distributor.name,
                status: distributor.status
            }
            const resp = await updateDistributor(data, accessToken);
            if (resp && resp.success) {
                setDistributor(resp.data);
                toast.success(t('success'))
                router.back();
            }
        } catch(err: any) {
            console.log('Error get distributor: ', err);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('update_distributor')));
        const getDistributor = async () => {
            if (!accessToken) return;
            try {
                setIsLoading(true);
                const resp = await loadDistributorById(params.id, accessToken);
                if (resp) {
                    setDistributor(resp.data);
                }
            } catch(err: any) {
                console.log('Error get distributor: ', err);
                handleApiError(err, t);
            } finally {
                setIsLoading(false);
            }
        }

        getDistributor();
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
                            label={t('distributor_name')}
                            value={distributor.name}
                            onChange={(e) => handleValueChange("name", e.target.value)}
                            isError={errors.name}
                            required 
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">
                                {t('status')}
                            </label>
                            <select
                                value={distributor.status}
                                onChange={(e) => handleValueChange("status", e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none bg-white transition-all h-8"
                            >
                                <option value="" disabled>{t('select_option')}</option>
                                {listStatus.map((status) => (
                                    <option key={status.code} value={status.code}>{status.name}</option>
                                ))}
                            </select>
                        </div>
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