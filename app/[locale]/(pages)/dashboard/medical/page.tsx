"use client"

import { faSearch, faSync, faEdit, faPrint, faTrash, faDownload, faFileAlt, faFileImport, faFileExport, faCalendarAlt, faCheck, faCancel, faXmark} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import InputGroup from '@/components/InputGroup';

export default function Medical() {
    const t = useTranslations();
    const locale = useLocale();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const declarations = [
        {code: "bhythgd", name: t('family_health_ins'), acronym: "bhythgd"},
    ]

    const plans = [
        {code: "ON", name: t('renewal')},
        {code: "TM", name: t('new')},
        {code: "GH", name: t('decrease')},
    ]

    const status = [
        {code: "01", name: t('recorded')},
        {code: "02", name: t('pending_payment')},
        {code: "03", name: t('paid')},
        {code: "04", name: t('record_created')},
        {code: "05", name: t('sumitted')},
        {code: "06", name: t('approved_by_social_ins')},
        {code: "07", name: t('returned_by_social_ins')},
        {code: "08", name: t('cancelled_declaration')},
    ]

    const mockData = [
        { id: "8965742", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Minh Tiến", code: "7722528998", method: 0, date: "08/04/2026", payType: 0, amount: "758.160", receipt: 0, status: 1 },
        { id: "8965733", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Đỗ Thanh Thủy", code: "7721214903", method: 0, date: "08/04/2026", payType: 0, amount: "884.520", receipt: 0, status: 1 },
        { id: "8965722", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Bích Duyên", code: "7721380876", method: 0, date: "08/04/2026", payType: 1, amount: "1.263.600", receipt: 0, status: 1 },
        { id: "8965741", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Minh Tiến", code: "7722528998", method: 0, date: "08/04/2026", payType: 0, amount: "758.160", receipt: 0, status: 1 },
        { id: "8965738", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Đỗ Thanh Thủy", code: "7721214903", method: 0, date: "08/04/2026", payType: 0, amount: "884.520", receipt: 0, status: 1 },
        { id: "8965727", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Bích Duyên", code: "7721380876", method: 0, date: "08/04/2026", payType: 0, amount: "1.263.600", receipt: 0, status: 1 },
        { id: "8965742", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Minh Tiến", code: "7722528998", method: 0, date: "08/04/2026", payType: 1, amount: "758.160", receipt: 0, status: 1 },
        { id: "8965733", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Đỗ Thanh Thủy", code: "7721214903", method: 0, date: "08/04/2026", payType: 0, amount: "884.520", receipt: 0, status: 1 },
        { id: "8965722", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Bích Duyên", code: "7721380876", method: 0, date: "08/04/2026", payType: 0, amount: "1.263.600", receipt: 0, status: 1 },
        { id: "8965741", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Minh Tiến", code: "7722528998", method: 0, date: "08/04/2026", payType: 1, amount: "758.160", receipt: 0, status: 1 },
        { id: "8965738", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Đỗ Thanh Thủy", code: "7721214903", method: 1, date: "08/04/2026", payType: 0, amount: "884.520", receipt: 0, status: 1 },
        { id: "8965727", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Bích Duyên", code: "7721380876", method: 2, date: "08/04/2026", payType: 0, amount: "1.263.600", receipt: 0, status: 1 },
        { id: "8965742", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Minh Tiến", code: "7722528998", method: 2, date: "08/04/2026", payType: 1, amount: "758.160", receipt: 0, status: 1 },
        { id: "8965733", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Đỗ Thanh Thủy", code: "7721214903", method: 1, date: "08/04/2026", payType: 0, amount: "884.520", receipt: 0, status: 1 },
        { id: "8965722", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Bích Duyên", code: "7721380876", method: 2, date: "08/04/2026", payType: 0, amount: "1.263.600", receipt: 0, status: 1 },
        { id: "8965741", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Minh Tiến", code: "7722528998", method: 1, date: "08/04/2026", payType: 1, amount: "758.160", receipt: 0, status: 1 },
        { id: "8965738", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Đỗ Thanh Thủy", code: "7721214903", method: 0, date: "08/04/2026", payType: 0, amount: "884.520", receipt: 0, status: 1 },
        { id: "8965727", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Bích Duyên", code: "7721380876", method: 0, date: "08/04/2026", payType: 0, amount: "1.263.600", receipt: 0, status: 1 },
        { id: "8965742", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Minh Tiến", code: "7722528998", method: 0, date: "08/04/2026", payType: 0, amount: "758.160", receipt: 0, status: 1 },
        { id: "8965733", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Đỗ Thanh Thủy", code: "7721214903", method: 0, date: "08/04/2026", payType: 0, amount: "884.520", receipt: 0, status: 1 },
        { id: "8965722", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Bích Duyên", code: "7721380876", method: 0, date: "08/04/2026", payType: 0, amount: "1.263.600", receipt: 0, status: 1 },
        { id: "8965741", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Minh Tiến", code: "7722528998", method: 1, date: "08/04/2026", payType: 0, amount: "758.160", receipt: 0, status: 1 },
        { id: "8965738", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Đỗ Thanh Thủy", code: "7721214903", method: 2, date: "08/04/2026", payType: 0, amount: "884.520", receipt: 0, status: 1 },
        { id: "8965727", staff: "VŨ THỊ NHẬT LINH", type: t('summary_family_health_ins'), name: "Huỳnh Bích Duyên", code: "7721380876", method: 1, date: "08/04/2026", payType: 0, amount: "1.263.600", receipt: 0, status: 1 },
    ];

    const [formData, setFormData] = useState({
        declarationType: "",
        socialCode: "",
        customerName: "",
        status: "",
        plan: "",
        startDate: new Date(),
        endDate: new Date()
    });

    const handleOpenCallendar = () => {
        if (startDateRef.current) {
            startDateRef.current.showPicker();
        }
    };

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }))
    }

    const handleRefresh = () => {
        setFormData({
            declarationType: "",
            socialCode: "",
            customerName: "",
            status: "",
            plan: "",
            startDate: new Date(),
            endDate: new Date()
        });
    }

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentTableData = mockData.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
    }

    return (
        <div className="flex flex-col gap-3 text-black pb-4 w-full">
            <form onSubmit={handleSearch}>
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-[#1e3a5f] uppercase text-sm tracking-wide">
                        {t('search')}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 mb-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('type_declaration')}</label>
                            <select
                                value={formData.declarationType}
                                onChange={(e)=>handleValueChange("declarationType", e.target.value)}
                                className="h-8 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none bg-white transition-all">
                                <option value="" disabled>{t('select_option')}</option>
                                {declarations.map((type) => 
                                    <option key={type.code} value={type.code}>{`${type.name} (${type.acronym.toUpperCase()})`}</option>
                                )}
                            </select>
                        </div>

                        <InputGroup 
                            label={t('social_code')} 
                            value={formData.socialCode}
                            onChange={(e)=>handleValueChange("socialCode", e.target.value)}
                        />

                        <InputGroup 
                            label={t('customer_name')} 
                            value={formData.customerName}
                            onChange={(e)=>handleValueChange("customerName", e.target.value)}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('status')}</label>
                            <select
                                value={formData.status}
                                onChange={(e)=>handleValueChange("status", e.target.value)}
                                className="h-8 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none bg-white transition-all">
                                <option value="" disabled>{t('select_option')}</option>
                                {status.map((state) => 
                                    <option key={state.code} value={state.code}>{state.name}</option>
                                )}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('plan')}</label>
                            <select
                                value={formData.plan}
                                onChange={(e)=>handleValueChange("plan", e.target.value)}
                                className="h-8 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none bg-white transition-all">
                                <option value="" disabled>{t('select_option')}</option>
                                {plans.map((plan) => 
                                    <option key={plan.code} value={plan.code}>{`${plan.name} (${plan.code.toUpperCase()})`}</option>
                                )}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('register_date')}</label>
                            <div
                                onClick={handleOpenCallendar} 
                                className="flex items-center h-8 border border-gray-300 rounded px-3 bg-white focus-within:border-[#1e3a5f] focus-within:ring-1 focus-within:ring-[#1e3a5f]/20 transition-all cursor-pointer">
                                <input
                                    ref={startDateRef}
                                    type="date"
                                    className="native-date-input flex-1"
                                    value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ""}
                                    onChange={(e) => {
                                        const date = e.target.value ? new Date(e.target.value) : null;
                                        handleValueChange("startDate", date);
                                        if (date && endDateRef.current) {
                                            setTimeout(() => endDateRef.current?.showPicker(), 100);
                                        }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <span className="mx-2 text-gray-400 text-xs font-bold">→</span>

                                <input
                                    ref={endDateRef}
                                    type="date"
                                    className="native-date-input flex-1"
                                    value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ""}
                                    min={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ""}
                                    onChange={(e) => handleValueChange("endDate", e.target.value ? new Date(e.target.value) : null)}
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <div className="ml-2 text-gray-400 text-sm">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                </div>
                            </div>
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
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap justify-between items-center bg-white px-4 pt-4 gap-2">
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-gray-800 text-sm">{t('list_health_ins')}</h1>
                            <span className="bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded-full">{mockData.length}</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faFileAlt} />{t('download_file')}
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faFileImport} />{t('import_excel')}
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1e3a5f] text-white rounded text-xs hover:bg-[#2a5285] transition-colors">
                                <FontAwesomeIcon icon={faFileExport} />{t('export_excel')}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow overflow-hidden px-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1e3a5f] text-white whitespace-nowrap">
                                        <th className="px-4 py-3 font-semibold border-r border-white text-center">{t('declaration_code')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('collector')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('application_type')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('participant_name')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('social_code')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('plan')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('register_date')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('commission_type')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white text-right">{t('contribution_amount')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white text-center">{t('temporary_receipt')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white text-left">{t('status')}</th>
                                        <th className="px-4 py-3 font-semibold text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentTableData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-4 py-3 text-blue-600 font-medium text-center">
                                                <Link href={`/${locale}/dashboard/medical/${row.id}`}>
                                                    {row.id}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{row.staff}</td>
                                            <td className="px-4 py-3 text-gray-600">{row.type}</td>
                                            <td className="px-4 py-3 font-medium text-gray-700">{row.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{row.code}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {row.method == 0 ? t('renewal') : row.method == 1 ? t('new') : t('decrease')}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{row.date}</td>
                                            <td className="px-4 py-3 text-gray-600">{row.payType == 0 ? t('commission_type_renewal') : t('commission_type_new')}</td>
                                            <td className="px-4 py-3 text-right text-teal-600 font-bold">{row.amount}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap">
                                                    {row.receipt == 0 ? (
                                                        <span>
                                                            <FontAwesomeIcon icon={faXmark} />{t('not_print_temp_receipt')}
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            <FontAwesomeIcon icon={faCheck} />{t('print_temp_receipt')}
                                                        </span> 
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-teal-400 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">
                                                    {row.status == 0 ? t('not_recorded') : t('recorded') }
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-400 space-x-2 whitespace-nowrap">
                                                <button className="hover:text-blue-600"><FontAwesomeIcon icon={faEdit} /></button>
                                                <button className="hover:text-green-600"><FontAwesomeIcon icon={faDownload} /></button>
                                                <button className="hover:text-red-600"><FontAwesomeIcon icon={faTrash} /></button>
                                                <button className="hover:text-gray-800"><FontAwesomeIcon icon={faPrint} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={mockData.length}
                            pageSize={pageSize}
                            onPageChange={(page) => setCurrentPage(page)}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}