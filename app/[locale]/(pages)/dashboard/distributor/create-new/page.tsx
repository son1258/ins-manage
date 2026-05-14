"use client"

import InputGroup from "@/components/InputGroup";
import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import CustomSelect from "@/components/CustomSelect";
import { useProviderList } from "@/hooks/useProvider";
import { useCreateDistributorMutation } from "@/hooks/useDistributor";
import { useRouter } from "next/navigation";
import { useProductList } from "@/hooks/useCommonHook";

export default function CreateNewDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken') || "";
    const [formData, setFormData] = useState({
        providerId: "",
        distributorCode: "",
        distributorName: "",
        productIds: [],
        catalogIds: []
    });

    const [errors, setErrors] = useState<any>({
        distributorCode: false,
        distributorName: false,
    });

    const {data: productsRes, isLoading: isLoadProducts, isError: errLoadProducts} = useProductList(accessToken);
    const {data: providersResp, isLoading: isLoadProviders, isError: errLoadProvider} = useProviderList(accessToken);
    const products = errLoadProducts ? [] : productsRes?.data;
    const providers = errLoadProvider ? [] : providersResp?.data;
    const createDistributor = useCreateDistributorMutation(accessToken);

    const handleValueChange = (nameField: string, value: any) => {
        if (nameField === "productIds") {
            const selectedProducts = products.filter((item: any) =>
                value.includes(item.id)
            );
            setFormData(prev => ({
                ...prev,
                productIds: value,
                catalogIds: selectedProducts.map((item: any) => item.category?.id).filter(Boolean)
            }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isInvalid = !formData.providerId || !formData.distributorCode || !formData.distributorName || formData.productIds.length === 0 || formData.catalogIds.length === 0;
        if (isInvalid) {
            toast.error(t('err_field_required'));
            return;
        }
        createDistributor.mutate({
            provider_id: formData.providerId,
            code: formData.distributorCode,
            name: formData.distributorName,
            list_categories: formData.catalogIds,
            list_products: formData.productIds
        }, {
            onSuccess: (resp) => {
                if (resp?.success) {
                    toast.success(t('success'));
                    router.back();
                }
            },
        })
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('add_distributor')));
    },[t])

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
                                options={providers && providers.map((provider: any) => ({
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
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('type')}<span className="text-red-500 mr-1">*</span></label>
                            <CustomSelect
                                mode="multiple"
                                placeholder={t('select_option')}
                                value={formData.productIds || undefined} 
                                onChange={(value) => handleValueChange("productIds", value)}
                                options={products && products.map((collector: any) => ({
                                    value: collector.id,
                                    label: collector.name,
                                }))}
                            />
                        </div>
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
            <Loading stateShow={isLoadProducts || isLoadProviders || createDistributor.isPending} />
        </div>
    )
}