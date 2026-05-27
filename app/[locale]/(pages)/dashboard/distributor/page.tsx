"use client"

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faEdit, faTrashAlt, faSync, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import InputGroup from '@/components/InputGroup';
import Pagination from '@/components/Pagination';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { PRODUCT_CODE, STATUS } from '@/constants';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import CustomSelect from '@/components/CustomSelect';
import { useProviderList } from '@/hooks/useProvider';
import { useDisableDistributor, useDistributorList, useEnableDistributorMutation } from '@/hooks/useDistributor';
import { toast } from 'react-toastify';
import { handleApiError } from '@/utils/errorHandler';

export default function DistributorManagement() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const accessToken = Cookies.get('accessToken') || "";
    const [openModal, setOpenModal] = useState(false);
    const [selectedDistributorId, setSelectedDistributorId] = useState<any>();

    const listStatus = [
        { code: STATUS.ACTIVE, name: t('active') },
        { code: STATUS.DEACTIVE, name: t('deactive') },
    ]

    const defaultParams = {
        providerCode: "",
        distributorCode: "",
        distributorName: "",
        status: STATUS.ACTIVE,
        limit: 10,
        page: 1
    }

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const status = searchParams.get('status') != null ? Number(searchParams.get('status')) : STATUS.ACTIVE;
    const params = {
        providerCode: searchParams.get('provider_code') || "",
        distributorCode: searchParams.get('distributor_code') || "",
        distributorName: searchParams.get('distributor_name') || "",
        status: status,
        page: page,
        limit: limit
    }
    const [formData, setFormData] = useState(params);
    const { data: providersResp, isLoading: isLoadProviders, isError: errLoadProviders } = useProviderList(accessToken);
    const providers = errLoadProviders ? [] : providersResp?.data;
    const { data: distributorsResp, isLoading: isLoadDistributors, isError: errLoadDistributors } = useDistributorList(params, accessToken);
    const distributors = errLoadDistributors ? [] : distributorsResp?.data;
    const disableMutation = useDisableDistributor(accessToken, t);
    const enableMutation = useEnableDistributorMutation(accessToken);
    const createNew = () => {
        router.push(`/${locale}/dashboard/distributor/create-new`);
    }

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }));
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.set('limit', String(formData.limit));
        params.set('page', '1');
        params.set('status', String(formData.status));
        if (formData.providerCode) {
            params.set('provider_code', formData.providerCode);
        }
        if (formData.distributorCode) {
            params.set('distributor_code', formData.distributorCode);
        }
        if (formData.distributorName) {
            params.set('distributor_name', formData.distributorName);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleRefresh = () => {
        setFormData(defaultParams)
        const newParams = new URLSearchParams();
        newParams.set('limit', String(formData.limit));
        newParams.set('page', '1');
        newParams.set('status', String(STATUS.ACTIVE));
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        handleValueChange('page', page);
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleLimitChange = (limit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('limit', String(limit));
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    }

    const onConfirmDisable = async () => {
        if (selectedDistributorId) {
            await disableMutation.mutateAsync(selectedDistributorId);
            setOpenModal(false);
        }
    }

    const handleSelectDisableDistributor = (id: string) => {
        setOpenModal(!openModal);
        setSelectedDistributorId(id);
    }

    const findProviderName = (providerId: string) => {
        if (providers) {
            const find = providers.find((item: any) => item.id == providerId);
            return find?.name;
        }
    }

    const handleEnableDistributor = (distributor: any) => {
        enableMutation.mutate(
            {
                id: distributor.id,
                status: STATUS.ACTIVE
            },
            {
                onSuccess: () => {
                    toast.success(t('success'))
                },
                onError: (err) => {
                    handleApiError(err, t)
                }
            }
        )
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('distributor')));
    }, [t])

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-base md:text-xl font-bold text-gray-800 uppercase">{t('manage_distributor')}</h2>
                <button
                    onClick={createNew}
                    className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800 transition shadow-sm text-xs md:text-sm">
                    <FontAwesomeIcon icon={faPlus} /> {t('add_distributor')}
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <form onSubmit={handleSearch}>
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 mb-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">
                                    {t('agency_name')}
                                </label>
                                <CustomSelect
                                    placeholder={t('select_option')}
                                    value={formData.providerCode || undefined}
                                    onChange={(value) => handleValueChange("providerCode", value)}
                                    options={providers && providers.map((provider: any) => ({
                                        value: provider.code,
                                        label: `${provider.name} (${provider.code})`,
                                    }))}
                                />
                            </div>

                            <InputGroup
                                label={t('distributor_code')}
                                value={formData.distributorCode}
                                onChange={(e) => handleValueChange("distributorCode", e.target.value)}
                            />
                            <InputGroup
                                label={t('distributor_name')}
                                value={formData.distributorName}
                                onChange={(e) => handleValueChange("distributorName", e.target.value)}
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">
                                    {t('status')}
                                </label>
                                <CustomSelect
                                    placeholder={t('select_option')}
                                    value={formData.status}
                                    onChange={(value) => handleValueChange("status", value)}
                                    options={listStatus.map((status: any) => ({
                                        value: status.code,
                                        label: status.name,
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-2">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="flex items-center text-gray-500 text-xs hover:text-gray-800 transition-colors font-medium cursor-pointer">
                                <FontAwesomeIcon icon={faSync} className="mr-2 w-3 h-3" />
                                {t('refresh')}
                            </button>
                            <button
                                type="submit"
                                className="flex items-center bg-gray-800 border border-gray-800 text-white px-2 py-1 rounded transition-all text-sm font-semibold shadow-sm cursor-pointer">
                                <FontAwesomeIcon icon={faSearch} className="mr-2 w-3 h-3" />
                                {t('search')}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px] text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--global-main-color)] text-white whitespace-nowrap">
                                    <th className="px-4 py-3 border-r border-white text-center w-16">{t('index')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('agency_name')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('distributor_code')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('distributor_name')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('type')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('status')}</th>
                                    <th className="px-4 py-3 text-center">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {distributors && distributors.map((item: any, index: number) => (
                                    <tr key={item.code} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-3 text-center text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-3 text-gray-700">{findProviderName(item.provider_id)}</td>
                                        <td className="px-4 py-3 font-medium text-[var(--global-main-color)]">{item.code}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.name}</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            <div className="flex items-center gap-2 text-xs">
                                                {item.products.map((product: any) => (
                                                    <span
                                                        className={`text-white px-2 py-1 rounded-lg ${product.code === PRODUCT_CODE.BHXH ? 'bg-sky-500' : 'bg-rose-500'}`}
                                                        key={product.id}>
                                                        {product.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${item.status === STATUS.ACTIVE
                                                ? 'bg-teal-400 text-white'
                                                : 'bg-red-500 text-white'
                                                }`}>
                                                {item.status === STATUS.ACTIVE ? t('active').toUpperCase() : t('deactive').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-400 space-x-3 whitespace-nowrap">
                                            {item.status == STATUS.ACTIVE ? (
                                                <>
                                                    <button
                                                        onClick={() => router.push(`/${locale}/dashboard/distributor/${item.id}`)}
                                                        className="hover:text-blue-600 transition-colors">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSelectDisableDistributor(item.id)}
                                                        className="hover:text-red-600 transition-colors">
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEnableDistributor(item)}
                                                    className="hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faArrowsRotate} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={page}
                        totalItems={distributorsResp?.paginate.total || 0}
                        pageSize={limit}
                        onPageChange={(page) => handlePageChange(page)}
                        onPageSizeChange={(limit) => handleLimitChange(limit)}
                    />
                </div>
            </div>
            <Modal
                isOpen={openModal}
                title={t('disable_distributor')}
                onConfirm={onConfirmDisable}
                onClose={() => setOpenModal(false)}
            />
            <Loading stateShow={isLoadProviders || isLoadDistributors} />
        </div>
    );
}