"use client"

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faEdit, faTrashAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import InputGroup from '@/components/InputGroup';
import Pagination from '@/components/Pagination';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { STATUS } from '@/constants';
import Loading from '@/components/Loading';
import { disableDistributor, loadDistributors } from '@/services/distributorService';
import { handleApiError } from '@/utils/errorHandler';
import Modal from '@/components/Modal';
import { toast } from 'react-toastify';
import CustomSelect from '@/components/CustomSelect';
import { loadProviders } from '@/services/providerService';

export default function DistributorManagement() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const accessToken = Cookies.get('accessToken');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [providers, setProviders] = useState<any[]>([]);
    const [distributors, setDistributors] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState('');

    const listStatus = [
        {code: STATUS.ACTIVE, name: t('active')},
        {code: STATUS.DEACTIVE, name: t('deactive')},
    ]

    const [formData, setFormData] = useState({
        providerCode: "",
        distributorCode: "",
        distributorName: "",
        status: STATUS.ACTIVE,
        limit: 10,
        page: 1
    })

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
        if (formData.distributorCode) {
            params.set('code', formData.distributorCode);
        }
        if (formData.distributorName) {
            params.set('name', formData.distributorName);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleRefresh = () => {
        router.push(pathname);
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

    const getDistributors = async (data: any) => {
        if (!accessToken) return;
        try {
            setIsLoading(true);
            const resp = await loadDistributors(data, accessToken);
            if (resp && resp.data) {
                setDistributors(resp.data);
                setTotalItems(resp.paginate.total);
            }
        } catch(err: any) {
            console.log('Error get distributors: ', err);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
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

    const updateStateDistributor = async () => {
        try {
            if (!accessToken || !selectedId) return;
            setIsLoading(true);
            const resp = await disableDistributor(selectedId, accessToken);
            if (resp && resp.success) {
                setOpenModal(false);
                toast.success(t('success'));
                setSelectedId('');
                await getDistributors(formData);
            }
        } catch(err: any) {
            console.log('Error disable distributor: ', err);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectDisableDistributor = (id: string) => {
        setOpenModal(!openModal);
        setSelectedId(id);
    }  

    useEffect(() => {
        getProviders();
    },[])

    useEffect(() => {
        dispatch(setActiveTitle(t('distributor')));
        const code = searchParams.get('code') || "";
        const name = searchParams.get('name') || "";
        const status = searchParams.get('status');
        const limit = Number(searchParams.get('limit')) || 10;
        const page = Number(searchParams.get('page')) || 1;

        const dataFromUrl = {
            providerCode: "",
            distributorCode: code,
            distributorName: name,
            status: (status !== null && status !== "") ? Number(status) : STATUS.ACTIVE,
            page: page,
            limit: limit
        };

        setFormData(dataFromUrl);
        setPageSize(dataFromUrl.limit);
        setCurrentPage(dataFromUrl.page);
        getDistributors(dataFromUrl);
    },[searchParams])

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
                                    options={providers.map((provider: any) => ({
                                        value: provider.code,
                                        label: `${provider.name} (${provider.code})`,
                                    }))}
                                />
                            </div>

                            <InputGroup 
                                label={t('distributor_code')}
                                value={formData.distributorCode}
                                onChange={(e)=>handleValueChange("distributorCode", e.target.value)} 
                            />
                             <InputGroup 
                                label={t('distributor_name')}
                                value={formData.distributorName}
                                onChange={(e)=>handleValueChange("distributorName", e.target.value)} 
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
                                    <th className="px-4 py-3 border-r border-white">{t('distributor_code')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('distributor_name')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('agency_name')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('status')}</th>
                                    <th className="px-4 py-3 text-center">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {distributors.map((item, index) => (
                                    <tr key={item.code} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-3 text-center text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-[var(--global-main-color)]">{item.code}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.name}</td>
                                        <td className="px-4 py-3 text-gray-700">{}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                                item.status === STATUS.ACTIVE
                                                ? 'bg-teal-400 text-white' 
                                                : 'bg-red-500 text-white'
                                            }`}>
                                                {item.status === STATUS.ACTIVE ? t('active').toUpperCase() : t('deactive').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-400 space-x-3 whitespace-nowrap">
                                            <button
                                                onClick={() => router.push(`/${locale}/dashboard/distributor/${item.id}`)} 
                                                className="hover:text-blue-600 transition-colors">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            {item.status == STATUS.ACTIVE && (
                                                <button 
                                                    onClick={() => handleSelectDisableDistributor(item.id)}
                                                    className="hover:text-red-600 transition-colors">
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={(page) => handlePageChange(page)}
                        onPageSizeChange={(limit) => handleLimitChange(limit)}
                    />
                </div>
            </div>
            <Modal 
                isOpen={openModal} 
                title={t('disable_distributor')} 
                onConfirm={updateStateDistributor} 
                onClose={() => setOpenModal(false)} 
            />
            <Loading stateShow={isLoading} />
        </div>
  );
}