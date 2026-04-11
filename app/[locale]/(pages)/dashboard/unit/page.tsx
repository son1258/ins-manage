"use client"

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faEdit, faTrashAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import InputGroup from '@/components/InputGroup';

export default function UnitManagement() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const listUnits = [
        {code: "BIPV01U", name: "PVI Thành phố Hồ Chí Minh", status: 0},
        {code: "BIPV012", name: "PVI Thành phố Thủ Đức", status: 1},
    ];

    const listStatus = [
        {code: 0, name: t('active')},
        {code: 1, name: t('deactive')},
    ];

    const [formData, setFormData] = useState({
        unitName: "",
        unitCode: "",
        status: ""
    })

    const createNew = () => {
        router.push(`/${locale}/dashboard/unit/create-new`)
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
            status: ""
        })
    } 

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 uppercase">{t('manage_unit')}</h2>
                <button
                    onClick={createNew} 
                    className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800 transition shadow-sm text-sm">
                    <FontAwesomeIcon icon={faPlus} /> {t('add_unit')}
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <form onSubmit={handleSearch}>
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 text-[#1e3a5f] uppercase text-sm tracking-wide">
                            {t('search')}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 mb-6">
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

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">
                                    {t('status')}
                                </label>
                                <select
                                    value={formData.status}
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

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                        <th className="p-4 font-semibold text-gray-700 w-16 text-center">{t('index')}</th>
                        <th className="p-4 font-semibold text-gray-700">{t('unit_code')}</th>
                        <th className="p-4 font-semibold text-gray-700">{t('unit_name')}</th>
                        <th className="p-4 font-semibold text-gray-700">{t('status')}</th>
                        <th className="p-4 font-semibold text-gray-700 text-center">{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUnits.map((item, index) => (
                            <tr key={item.code} className="border-b border-gray-100 hover:bg-blue-50 transition">
                                <td className="p-4 text-center">{index + 1}</td>
                                <td className="p-4 font-mono font-bold text-blue-600">{item.code}</td>
                                <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${item.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.status === 1 ? t('active') : t('deactive')}
                                </span>
                                </td>
                                <td className="p-4">
                                <div className="flex justify-center gap-4 text-gray-500">
                                    <button className="hover:text-blue-600"><FontAwesomeIcon icon={faEdit} /></button>
                                    <button className="hover:text-red-600"><FontAwesomeIcon icon={faTrashAlt} /></button>
                                </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
  );
}