"use client"

import CustomSelect from '@/components/CustomSelect';
import InputGroup from '@/components/InputGroup';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';
import { loadDistributors } from '@/services/distributorService';
import { handleApiError } from '@/utils/errorHandler';
import { toast } from 'react-toastify';
import { loadCollectors } from '@/services/collectorService';
import { createNewUser } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';

export default function CreateCollector() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken');
    const [isLoading, startTransition] = useTransition();
    const [distributors, setDistributors] = useState<any[]>([]);
    const [collectors, setCollectors] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullname: "",
        email: "",
        distributorId: "",
        collectorIds: []
    });

    const [errors, setErrors] = useState<any>({
        username: false,
        password: false,
        fullname: false,
        email: false,
        distributorId: false,
        collectorIds: false
    })

    const handleValueChange = (nameField: string, value: any) => {
        if (nameField == "distributorId") {
            setCollectors([]);
            setFormData(prev => ({
                ...prev,
                collectorIds: []
            }))
            getCollectorFromDistributorId(value);
        }
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
                const data = {
                    status: STATUS.ACTIVE
                }
                const resp = await loadDistributors(data, accessToken);
                if (resp && resp.data) {
                    setDistributors(resp.data);
                }
            } catch(err: any) {
                handleApiError(err, t);
            }
        })
    }

    const getCollectorFromDistributorId = async (id: string) => {
        if (!accessToken) return;
        startTransition(async () => {
            try {
                const data = {
                    distributorId: id,
                    status: STATUS.ACTIVE
                }
                const resp = await loadCollectors(data, accessToken);
                if (resp && resp.data) {
                    setCollectors(resp.data);
                }
            } catch(err: any) {
                handleApiError(err, t);
            }
        })
    }

    const resetForm = () => {
        setFormData({
            username: "",
            password: "",
            fullname: "",
            email: "",
            distributorId: "",
            collectorIds: []
        });

        setErrors({
            username: false,
            password: false,
            fullname: false,
            email: false,
            distributorId: false,
            collectorIds: false
        }); 
    }


 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEmpty = Object.entries(formData).some(([key, value]) => {
            if (key === "collectorIds") return value.length === 0;
            if (typeof value === "string") return value.trim() === "";
            return !value;
        });
        if (isEmpty) {
            toast.error(t('err_field_required'));
        }
        if (!accessToken || isEmpty) return;
        startTransition(async () => {
            try {
                const data = {
                    username: formData.username,
                    fullname: formData.fullname,
                    password: formData.password,
                    email: formData.email,
                    distributor_id: formData.distributorId,
                    collector_ids: formData.collectorIds
                }
                const resp = await createNewUser(data, accessToken);
                if (resp && resp.success) {
                    toast.success(t('success'));
                    resetForm();
                    router.back();
                }
            } catch (err: any) {
                handleApiError(err, t);
            }
        })
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('add_new_user')));
        getDistributors();
    },[])

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-[90%] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                <h2 className="text-white font-bold uppercase tracking-wide">{t('info_user')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-1.5 mt-1 md:col-span-1">
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
                        <div className="flex flex-col gap-1.5 mt-1 md:col-span-3">
                            <label className="text-sm text-gray-700">
                                <span className="text-red-500 mr-1">*</span>{t('collector')}
                            </label>
                           <CustomSelect
                                mode="multiple"
                                placeholder={t('select_option')}
                                value={formData.collectorIds || undefined} 
                                onChange={(value) => handleValueChange("collectorIds", value)}
                                options={collectors.map((collector: any) => ({
                                    value: collector.id,
                                    label: `${collector.code}_${collector.name}`,
                                }))}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <InputGroup 
                            label={t('username')} 
                            onChange={(e) => handleValueChange("username", e.target.value)}
                            value={formData.username}
                            isError={errors.username}
                            required 
                        />
                        <InputGroup 
                            label={t('password')} 
                            onChange={(e) => handleValueChange("password", e.target.value)}
                            value={formData.password}
                            isError={errors.password}
                            type={'password'}
                            required 
                        />
                        <InputGroup 
                            label={t('fullname')} 
                            onChange={(e) => handleValueChange("fullname", e.target.value)}
                            value={formData.fullname}
                            isError={errors.fullname}
                            required 
                        />
                        <InputGroup 
                            label={'Email'}
                            onChange={(e) => handleValueChange("email", e.target.value)}
                            value={formData.email}
                            isError={errors.email}
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