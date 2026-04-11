"use client"

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faEdit, faTrashAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import InputGroup from '@/components/InputGroup';

export default function Collector() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const listCollectors = [
        {id: 1, collector_code: "CBIP0001", collector_name: "Nguyễn Ngọc An", code: "BIPV01U", name: "PVI Thành phố Hồ Chí Minh", status: 0},
        {id: 2, collector_code: "CBIP0002", collector_name: "Nguyễn Kim Tú", code: "BIPV012", name: "PVI Thành phố Thủ Đức", status: 1},
    ];

    const listStatus = [
        {code: 0, name: t('active')},
        {code: 1, name: t('deactive')},
    ];

    const [formData, setFormData] = useState({
        unitName: "",
        unitCode: "",
        collectorCode: "",
        collectorName: "",
        status: ""
    })

    const createNew = () => {
        router.push(`/${locale}/dashboard/collector/create-new`)
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
        setFormData({
            unitName: "",
            unitCode: "",
            collectorCode: "",
            collectorName: "",
            status: ""
        })
    } 

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
                        <h2 className="text-lg font-semibold mb-4 text-[#1e3a5f] uppercase text-sm tracking-wide">
                            {t('search')}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 mb-6">
                            <InputGroup 
                                label={t('unit_code')}
                                value={formData.unitCode}
                                onChange={(e)=>handleValueChange("unitCode", e.target.value)} 
                            />
                             <InputGroup 
                                label={t('unit_name')}
                                value={formData.unitName}
                                onChange={(e)=>handleValueChange("unitName", e.target.value)} 
                            />
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
                                <label className="text-xs font-medium text-gray-600">{t('status')}</label>
                                <select
                                    value={formData.status}
                                    onChange={(e)=>handleValueChange("declarationType", e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none bg-white transition-all h-8">
                                    <option value="" disabled>{t('select_option')}</option>
                                    {listStatus.map((status) => 
                                        <option key={status.code} value={status.code}>{`${status.name}`}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-2">
                            <button
                                type="button"
                                onClick={handleRefresh} 
                                className="flex items-center text-gray-500 text-xs hover:text-[#f37021] transition-colors font-medium cursor-pointer">
                                <FontAwesomeIcon icon={faSync} className="mr-2 w-3 h-3" />
                                {t('refresh')}
                            </button>
                            <button
                                type="submit" 
                                className="flex items-center bg-[#1e3a5f] border border-[#1e3a5f] text-white px-2 py-1 rounded hover:bg-[#152944] transition-all text-sm font-semibold shadow-sm cursor-pointer">
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
                                <tr className="bg-[#1e3a5f] text-white whitespace-nowrap">
                                    <th className="px-4 py-3 font-semibold border-r border-white text-center w-16">
                                        {t('index')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold border-r border-white">
                                        {t('collector_code')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold border-r border-white">
                                        {t('collector_name')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold border-r border-white">
                                        {t('unit_code')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold border-r border-white">
                                        {t('unit_name')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold border-r border-white">
                                        {t('status')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-center">
                                        {t('action')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {listCollectors.map((item, index) => (
                                    <tr key={item.code} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-3 text-center text-gray-600">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-blue-600">
                                            {item.collector_code}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {item.collector_name}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-blue-600">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                                item.status === 1 
                                                ? 'bg-teal-400 text-white' 
                                                : 'bg-red-500 text-white'
                                            }`}>
                                                {item.status === 1 ? t('active').toUpperCase() : t('deactive').toUpperCase()}
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
                </div>
            </div>
        </div>
  );
}