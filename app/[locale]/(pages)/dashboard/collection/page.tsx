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
import { handleApiError } from '@/utils/errorHandler';
import { loadDistributors } from '@/services/distributorService';

export default function Collection() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const accessToken = Cookies.get('accessToken');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [distributors, setDistributors] = useState();
    const [collectors, setCollectors] = useState<any[]>([]);

    const listStatus = [
        {code: STATUS.ACTIVE, name: t('active')},
        {code: STATUS.DEACTIVE, name: t('deactive')},
    ];  

    const listDistributors = [
        {code: "ABC01A", name: 'BHXH cơ sở Tân Phú'},
        {code: "ABC02B", name: 'BHXH  cơ sở Nhà Bè'},
        {code: "ABC03C", name: 'BHXH  cơ sở Hóc Môn'},
        {code: "ABC04D", name: 'BHXH cơ sở Tân Nhựt'},
    ]

    const [formData, setFormData] = useState({
        distributorCode: "",
        collectorCode: "",
        collectorName: "",
        status: ""
    })

    const createNew = () => {
        router.push(`/${locale}/dashboard/collection/create-new`)
    }

    const editCollector = (collector: any) => {
        router.push(`/${locale}/dashboard/collector/edit-${collector.collector_code}`)
    }

    const handleValueChange = (nameField: string, value: any) => {
          setFormData(prev => ({
            ...prev,
            [nameField]: value
        }))
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    }

    const handleRefresh = () => {
        router.push(pathname);
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

    useEffect(() => {
        dispatch(setActiveTitle(t('collection')));
        const code = searchParams.get('code') || "";
        const name = searchParams.get('name') || "";
        const status = searchParams.get('status');
        const limit = Number(searchParams.get('limit')) || 10;
        const page = Number(searchParams.get('page')) || 1;

        const dataFromUrl = {
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
                <h2 className="text-base md:text-xl font-bold text-gray-800 uppercase">{t('manage_collection')}</h2>
                <button
                    onClick={createNew} 
                    className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800 transition shadow-sm text-xs md:text-sm">
                    <FontAwesomeIcon icon={faPlus} /> {t('add_collector')}
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <form onSubmit={handleSearch}>
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 mb-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">
                                    {t('distributor_code')}
                                </label>
                                <CustomSelect
                                    placeholder={t('select_option')}
                                    value={formData.distributorCode} 
                                    onChange={(value) => handleValueChange("distributorCode", value)}
                                    options={listDistributors.map((agency: any) => ({
                                        value: agency.code,
                                        label: `${agency.code}_${agency.name}`,
                                    }))}
                                />
                            </div>
                             <InputGroup 
                                label={t('collection_code')}
                                value={formData.collectorCode}
                                onChange={(e)=>handleValueChange("collectorCode", e.target.value)} 
                            />
                             <InputGroup 
                                label={t('collection_name')}
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
                                    <th className="px-4 py-3 border-r border-white">{t('collection_code')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('collection_name')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('distributor_code')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('distributor_name')}</th>
                                    <th className="px-4 py-3 border-r border-white">{t('status')}</th>
                                    <th className="px-4 py-3 text-center">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {collectors.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-3 text-center text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-[var(--global-main-color)]">{item.id}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.username}</td>
                                        <td className="px-4 py-3 font-medium text-[var(--global-main-color)]">{item.code}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                                item.status === STATUS.ACTIVE ? 'bg-teal-400 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                                {item.status === STATUS.ACTIVE ? t('active').toUpperCase() : t('deactive').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-400 space-x-3 whitespace-nowrap">
                                            <button 
                                                onClick={() => editCollector(item)}
                                                className="hover:text-blue-600 transition-colors cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="hover:text-red-600 transition-colors cursor-pointer">
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
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
                        onPageChange={(page) => setCurrentPage(page)}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <Loading stateShow={isLoading} />
        </div>
  );
}