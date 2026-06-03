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
import { useDistributorDetail, useUpdateDistributorMutation } from "@/hooks/useDistributor";
import CustomSelect from "@/components/CustomSelect";
import { useProductList } from "@/hooks/useCommonHook";

export default function EditDistributor() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const params: any = useParams();
    const router = useRouter();
    const accessToken = Cookies.get('accessToken') || "";
    const [formData, setFormData] = useState({
        distributorId: "",
        distributorCode: "",
        distributorName: "",
        productIds: [],
        catalogIds: []
    });

    const [errors, setErrors] = useState<any>({
        distributorCode: false,
        distributorName: false
    });

    const {data: productsRes, isLoading: isLoadProducts, isError: errLoadProducts} = useProductList(accessToken);
    const {data: distributorDetailRes, isLoading: isLoadDistributorDetail, isError: errLoadDistributor} = useDistributorDetail(params.id, accessToken);
    const products = errLoadProducts ? [] : productsRes?.data;
    const distributorDetail = errLoadDistributor ? [] : distributorDetailRes?.data;
    const updateDistributor = useUpdateDistributorMutation(accessToken);

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
        const hasError = Object.values(errors).some(value => value === true);
        if (!accessToken || hasError) return;
        updateDistributor.mutate({
            id: formData.distributorId,
            code: formData.distributorCode,
            name: formData.distributorName,
            list_products: formData.productIds,
            list_categories: formData.catalogIds
        }, {
            onSuccess: () => {
                toast.success(t('success'));
                router.back();
            },
            onError: (err: any) => {
                handleApiError(err, t)
            }
        });
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('update_distributor')));
    }, [t])

    useEffect(() => {
        if (distributorDetail) {
            const listProductIds = distributorDetail?.products.map((item: any) => item.id) || [];
            const listCatalogIds = distributorDetail?.products.map((item: any) => item.category.id) || [];

            setFormData({
                distributorId: distributorDetail.id,
                distributorCode: distributorDetail.code,
                distributorName: distributorDetail.name,
                productIds: listProductIds,
                catalogIds: listCatalogIds
            })
        }
    },[distributorDetail])
    
    return (
         <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-900 p-4">
                    <h2 className="text-white font-bold uppercase tracking-wide">{t('info_distributor')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputGroup 
                            label={t('distributor_code')}
                            value={formData.distributorCode}
                            onChange={(e) => handleValueChange("distributorCode", e.target.value)}
                            isError={errors.distributorCode}
                            readOnly
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
                            <label className="text-sm mb-1 font-medium text-gray-600"><span className="text-red-500 mr-1">*</span>{t('type')}</label>
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
                                {t('update')}
                        </button>
                    </div>  
                </form>
            </div>
            <Loading stateShow={isLoadDistributorDetail || isLoadProducts || updateDistributor.isPending} />
        </div>
    )
}