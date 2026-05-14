"use client"

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faEdit, faTrashAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import InputGroup from '@/components/InputGroup';
import Pagination from '@/components/Pagination';
import Loading from '@/components/Loading';
import Cookies from 'js-cookie';
import { STATUS } from '@/constants';
import { useDispatch } from 'react-redux';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import CustomSelect from '@/components/CustomSelect';
import Modal from '@/components/Modal';
import { useCollectorList, useDisableCollector } from '@/hooks/useCollector';
import { useProviderList } from '@/hooks/useProvider';

export default function Collector() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const accessToken = Cookies.get('accessToken') || "";
    const [selectedCollector, setSelectedCollector] = useState<any>();
    const [openModal, setOpenModal] = useState(false);

    const listStatus = [
        {code: STATUS.ACTIVE, name: t('active')},
        {code: STATUS.DEACTIVE, name: t('deactive')},
    ];

    const defaultParams = {
        providerId: '',
        collectorCode: '',
        collectorName: '',
        status: STATUS.ACTIVE,
        page: 1,
        limit: 10
    };

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const status = searchParams.get('status') != null ? Number(searchParams.get('status')) : STATUS.ACTIVE;
    const params = {
        providerId: searchParams.get('provider_id') || '',
        collectorCode: searchParams.get('code') || '',
        collectorName: searchParams.get('name') || '',
        status: status,
        page: page,
        limit: limit
    }
    const [formData, setFormData] = useState(params);
    const {data: providersRes, isLoading: isLoadProviders, isError: errLoadProviders} = useProviderList(accessToken);
    const {data: collectorsRes, isLoading: isLoadCollectors, isError: errLoadCollectors} : any = useCollectorList(params, accessToken);
    const disableMutation = useDisableCollector(accessToken, t);
    const providers = errLoadProviders ? [] : providersRes?.data;
    const collectors = errLoadCollectors ? [] : collectorsRes?.data;

    const createNew = () => {
        router.push(`/${locale}/dashboard/collector/create-new`)
    }

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }))
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const newParams = new URLSearchParams();
        newParams.set('limit', String(formData.limit));
        newParams.set('page', '1');
        newParams.set('status', String(formData.status));
        if (formData.providerId) {
            newParams.set('provider_id', formData.providerId);
        }
        if (formData.collectorCode) {
            newParams.set('code', formData.collectorCode);
        }
        if (formData.collectorName) {
            newParams.set('name', formData.collectorName);
        }
        router.push(`${pathname}?${newParams.toString()}`);
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
        const p = new URLSearchParams(searchParams.toString());
        p.set('page', String(page));
        handleValueChange('page', page);
        router.push(`${pathname}?${p.toString()}`);
    }

    const handleLimitChange = (limit: number) => {
        const p = new URLSearchParams(searchParams.toString());
        p.set('limit', String(limit));
        p.set('page', '1');
        router.push(`${pathname}?${p.toString()}`);
    }

    const handleSelectDisableCollector = (item: any) => {
        setOpenModal(!openModal);
        setSelectedCollector(item);
    }

    const onConfirmDisable = async () => {
        if (selectedCollector) {
                const data = {
                    id: selectedCollector.id,
                    code: selectedCollector.code,
                    name: selectedCollector.name,
                    distributor_id: selectedCollector.distributor_id
                }
            await disableMutation.mutateAsync(data);
            setOpenModal(false);
        }
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('collector')));
    },[t])

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-base md:text-xl font-bold text-gray-800 uppercase">{t('manage_collector')}</h2>
                <button
                    onClick={createNew} 
                    className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800 transition shadow-sm text-xs md:text-sm">
                    <FontAwesomeIcon icon={faPlus} /> {t('add_collector')}
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
                                    value={formData.providerId} 
                                    onChange={(value) => handleValueChange("providerId", value)}
                                    options={providers && providers.map((provider: any) => ({
                                        value: provider.id,
                                        label: `${provider.code}_${provider.name}`,
                                    }))}
                                />
                            </div>
                             <InputGroup 
                                label={t('collector_code')}
                                value={formData.collectorCode}
                                onChange={(e)=>handleValueChange("collectorCode", e.target.value)} 
                            />
                             <InputGroup 
                                label={t('collector_name')}
                                value={formData.collectorName}
                                onChange={(e)=>handleValueChange("collectorName", e.target.value)} 
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium mb-1 text-gray-600">{t('status')}</label>
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
                                    <th className="px-4 py-3 border-r border-white">{t('collector_code')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('collector_name')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('status')}</th>
                                    <th className="px-4 py-3 text-center">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {collectors && collectors.map((collector: any, index: number) => (
                                    <tr key={collector.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-3 text-center text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-3 text-gray-600">{collector.provider.name}</td>
                                        <td className="px-4 py-3 font-medium text-[var(--global-main-color)]">{collector.code}</td>
                                        <td className="px-4 py-3 text-gray-700">{collector.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                                collector.status === STATUS.ACTIVE ? 'bg-teal-400 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                                {collector.status === STATUS.ACTIVE ? t('active').toUpperCase() : t('deactive').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-400 space-x-3 whitespace-nowrap">
                                            <button 
                                                onClick={() => router.push(`/${locale}/dashboard/collector/${collector.id}`)}
                                                className="hover:text-blue-600 transition-colors cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            {collector.status == STATUS.ACTIVE && (
                                                <button 
                                                    onClick={() => handleSelectDisableCollector(collector)}
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
                        currentPage={page}
                        totalItems={collectorsRes?.paginate.total || 0}
                        pageSize={limit}
                        onPageChange={(page) => handlePageChange(page)}
                        onPageSizeChange={(limit) => handleLimitChange(limit)}
                    />
                </div>
            </div>
            <Modal 
                isOpen={openModal} 
                title={t('disable_collector')} 
                onConfirm={onConfirmDisable} 
                onClose={() => setOpenModal(false)} 
            />
            <Loading stateShow={isLoadProviders || isLoadCollectors || disableMutation.isPending} />
        </div>
  );
}