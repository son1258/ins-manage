"use client"

import { faSearch, faSync, faEdit, faPrint, faTrash, faDownload, faFileAlt, faFileImport, faFileExport, faCalendarAlt, faPaperPlane, faCirclePlus, faQrcode, faChevronRight, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import Pagination from '@/components/Pagination';
import { usePathname, useRouter } from 'next/navigation';
import InputGroup from '@/components/InputGroup';
import React from 'react';
import CustomSelect from '@/components/CustomSelect';
import DateRangePicker from '@/components/DateRangePicker';

export default function Payment() {
    const t = useTranslations();
    const router = useRouter();
    const locale = useLocale();
    const pathname = usePathname();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

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
        { 
            id: "8965743", 
            staff: "VŨ THỊ NHẬT LINH", 
            amount: "27.736.020", 
            status: 0, 
            create_date: "21/04/2026", 
            payment_date: "",
            details: [
                { id: "9109764", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "3121123126", name: "Hồ Xuân Cường", price: "315.900", date: "21/04/2026" },
                { id: "9108120", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "7521452516", name: "Đỗ Hữu Thọ", price: "1.263.600", date: "21/04/2026" },
                { id: "9107886", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4822525253", name: "Nguyễn Bùi Nguyên Khoa", price: "884.520", date: "21/04/2026" },
                { id: "9107883", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4825252527", name: "Phạm Thị Bình", price: "1.263.600", date: "21/04/2026" },
                { id: "9107745", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4866422436", name: "Trần Thị Đoan Hương", price: "1.263.600", date: "21/04/2026" },
            ]
        },
        { 
            id: "8965742", 
            staff: "VŨ THỊ NHẬT LINH", 
            amount: "40.141.231", 
            status: 1, 
            create_date: "09/04/2026", 
            payment_date: "09/04/2026",
            details: [
                { id: "9107001", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "123456789", name: "Nguyễn Văn A", price: "758.160", date: "09/04/2026" },
                { id: "9108120", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "7521452516", name: "Đỗ Hữu Thọ", price: "1.263.600", date: "21/04/2026" },
                { id: "9107886", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4822525253", name: "Nguyễn Bùi Nguyên Khoa", price: "884.520", date: "21/04/2026" },
                { id: "9107883", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4825252527", name: "Phạm Thị Bình", price: "1.263.600", date: "21/04/2026" },
                { id: "9107745", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4866422436", name: "Trần Thị Đoan Hương", price: "1.263.600", date: "21/04/2026" },
                { id: "9108120", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "7521452516", name: "Đỗ Hữu Thọ", price: "1.263.600", date: "21/04/2026" },
                { id: "9107886", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4822525253", name: "Nguyễn Bùi Nguyên Khoa", price: "884.520", date: "21/04/2026" },
                { id: "9107883", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4825252527", name: "Phạm Thị Bình", price: "1.263.600", date: "21/04/2026" },
                { id: "9107745", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4866422436", name: "Trần Thị Đoan Hương", price: "1.263.600", date: "21/04/2026" },
                { id: "9108120", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "7521452516", name: "Đỗ Hữu Thọ", price: "1.263.600", date: "21/04/2026" },
                { id: "9107886", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4822525253", name: "Nguyễn Bùi Nguyên Khoa", price: "884.520", date: "21/04/2026" },
                { id: "9107883", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4825252527", name: "Phạm Thị Bình", price: "1.263.600", date: "21/04/2026" },
                { id: "9107745", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", bhxh_code: "4866422436", name: "Trần Thị Đoan Hương", price: "1.263.600", date: "21/04/2026" },
            ]
        }
    ];

    const [formData, setFormData] = useState({
        paymentCode: "",
        status: "",
        fromDate: "",
        toDate: ""
    });

    const handleValueChange = (nameField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }))
    }

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleRefresh = () => {
        router.push(pathname);
    }

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentTableData = mockData.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
    }

    const handlePaymentRequest = () => {
        router.push(`/${locale}/dashboard/payment/create-payment`);
    }

    return (
        <div className="flex flex-col gap-3 text-black">
            <form onSubmit={handleSearch}>
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 mb-6">
                        <InputGroup 
                            label={t('payment_request_id')}
                            value={formData.paymentCode}
                            onChange={(e)=>handleValueChange("paymentCode", e.target.value)}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 text-gray-700 whitespace-nowrap">
                                {t('status')}
                            </label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.status} 
                                onChange={(value) => handleValueChange("status", value)}
                                options={status.map((status: any) => ({
                                    value: status.code,
                                    label: status.name,
                                }))}
                            />
                        </div>
                        
                        <DateRangePicker
                            label={t('register_date')}
                            fromDate={formData.fromDate}
                            toDate={formData.toDate}
                            fieldFrom="fromDate"
                            fieldTo="toDate"
                            onChange={handleValueChange}
                        />
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
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap justify-between items-center bg-white px-4 pt-4">
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-gray-800 text-sm">{t('list_payment_request')}</h1>
                            <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full">{mockData.length}</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faFileAlt} />{t('download_file')}
                            </button>
                            <button 
                                onClick={handlePaymentRequest}
                                className="flex items-center gap-2 bg-gray-800 text-white px-2 py-1 text-xs cursor-pointer">
                                <FontAwesomeIcon icon={faCirclePlus} />{t('create_payment_request')}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow overflow-hidden px-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1e3a5f] text-white whitespace-nowrap">
                                        <th className="px-4 py-3 w-10"></th>
                                        <th className="px-4 py-3 border-r border-white/20 text-center">{t('payment_request_id')}</th>
                                        <th className="px-4 py-3 border-r border-white/20">{t('creator')}</th>
                                        <th className="px-4 py-3 border-r border-white/20">{t('total_amount')}</th>
                                        <th className="px-4 py-3 border-r border-white/20 text-center">{t('status')}</th>
                                        <th className="px-4 py-3 border-r border-white/20">{t('create_date')}</th>
                                        <th className="px-4 py-3 border-r border-white/20">{t('payment_date')}</th>
                                        <th className="px-4 py-3 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {mockData.map((row) => (
                                        <React.Fragment key={row.id}>
                                            <tr 
                                                className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${expandedRow === row.id ? 'bg-blue-50/50' : ''}`}
                                                onClick={() => toggleRow(row.id)}
                                            >
                                                <td className="px-4 py-3 text-center">
                                                    <FontAwesomeIcon 
                                                        icon={expandedRow === row.id ? faChevronDown : faChevronRight} 
                                                        className="text-gray-400 text-xs"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-[#1e3a5f] font-medium text-center">{row.id}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.staff}</td>
                                                <td className="px-4 py-3 text-teal-600 font-bold">{row.amount}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`${row.status === 0 ? "bg-amber-400" : "bg-blue-500"} px-3 py-1 text-white rounded-full text-[11px] whitespace-nowrap`}>
                                                        {row.status === 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{row.create_date}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.payment_date || "-"}</td>
                                                <td className="px-4 py-3 text-center text-gray-400 space-x-3">
                                                    <button className="hover:text-blue-600"><FontAwesomeIcon icon={faQrcode} /></button>
                                                    {row.status === 0 && <button className="hover:text-red-600"><FontAwesomeIcon icon={faTrash} /></button>}
                                                </td>
                                            </tr>

                                            {expandedRow === row.id && (
                                                <tr>
                                                    <td colSpan={8} className="bg-orange-50/30 p-0">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-[12px] border-t border-orange-100">
                                                                <thead>
                                                                    <tr className="text-gray-500 font-semibold border-b border-orange-100">
                                                                        <th className="pl-14 py-2">Mã YCTT</th>
                                                                        <th className="px-4 py-2">Nhân viên thu</th>
                                                                        <th className="px-4 py-2">Loại hồ sơ</th>
                                                                        <th className="px-4 py-2">Mã số BHXH</th>
                                                                        <th className="px-4 py-2">Họ tên</th>
                                                                        <th className="px-4 py-2 text-right">Số tiền</th>
                                                                        <th className="px-4 py-2 text-center">Ngày đăng ký</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {row.details.map((detail) => (
                                                                        <tr key={detail.id} className="border-b border-orange-50 last:border-0">
                                                                            <td className="pl-14 py-2 text-blue-600">{detail.id}</td>
                                                                            <td className="px-4 py-2">{detail.staff}</td>
                                                                            <td className="px-4 py-2">{detail.type}</td>
                                                                            <td className="px-4 py-2 font-mono">{detail.bhxh_code}</td>
                                                                            <td className="px-4 py-2 font-medium">{detail.name}</td>
                                                                            <td className="px-4 py-2 text-right text-teal-600 font-bold">{detail.price}</td>
                                                                            <td className="px-4 py-2 text-center">{detail.date}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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