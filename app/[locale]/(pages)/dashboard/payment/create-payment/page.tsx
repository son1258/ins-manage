"use client"

import { faSearch, faSync, faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import Pagination from '@/components/Pagination';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { useDispatch } from 'react-redux';
import { setSelectedIds, setTotalAmount } from '@/lib/redux/slices/paymentSlice';
import InputGroup from '@/components/InputGroup';
import CustomSelect from '@/components/CustomSelect';
import { PLANS } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import DateRangePicker from '@/components/DateRangePicker';

export default function CreatePaymentRequest() {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [listDeclarationCode, setListDeclarationCode] = useState<string[]>([]);
    const [selectedDeclaration, setSelectedDeclaration] = useState();

    const declarations = [
        {code: "bhxh", name: t('social_ins'), acronym: "bhxh"},
        {code: "bhythgd", name: t('family_health_ins'), acronym: "bhythgd"},
    ]

    const plans = {
        bhxh: [
            {code: PLANS.NEXT_PAYMENT, name: t('next_payment')},
            {code: PLANS.NEW, name: t('new')},
            {code: PLANS.DECREASE, name: t('decrease')},
            {code: PLANS.REPAY, name: t('repay')},
            {code: PLANS.MAKE_UP_PAYMENT, name: t('make_up_payment')},
        ],
        bhythgd: [
            {code: PLANS.RENEWAL, name: t('renewal')},
            {code: PLANS.NEW, name: t('new')},
            {code: PLANS.DECREASE, name: t('decrease')},
        ]
    }

    const mockData = [
        { id: "8965742", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", name: "Huỳnh Minh Tiến", code: "7722528998", method: "Đóng tiếp", date: "08/04/2026", payType: "TL tái tục", amount: "758.160", receipt: "Chưa in", status: "Đã ghi nhận" },
        { id: "8965733", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", name: "Đỗ Thanh Thủy", code: "7721214903", method: "Đóng tiếp", date: "08/04/2026", payType: "TL tái tục", amount: "884.520", receipt: "Chưa in", status: "Đã ghi nhận" },
        { id: "8965722", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", name: "Huỳnh Bích Duyên", code: "7721380876", method: "Đóng tiếp", date: "08/04/2026", payType: "TL tái tục", amount: "1.263.600", receipt: "Chưa in", status: "Đã ghi nhận" },
        { id: "8965741", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", name: "Huỳnh Minh Tiến", code: "7722528998", method: "Đóng tiếp", date: "08/04/2026", payType: "TL tái tục", amount: "758.160", receipt: "Chưa in", status: "Đã ghi nhận" },
        { id: "8965738", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", name: "Đỗ Thanh Thủy", code: "7721214903", method: "Đóng tiếp", date: "08/04/2026", payType: "TL tái tục", amount: "884.520", receipt: "Chưa in", status: "Đã ghi nhận" },
        { id: "8965727", staff: "VŨ THỊ NHẬT LINH", type: "BHYTHGD", name: "Huỳnh Bích Duyên", code: "7721380876", method: "Đóng tiếp", date: "08/04/2026", payType: "TL tái tục", amount: "1.263.600", receipt: "Chưa in", status: "Đã ghi nhận" },
    ];

    const [formData, setFormData] = useState({
        declarationType: "",
        socialCode: "",
        customerName: "",
        status: "",
        plan: "",
        fromDate: "",
        toDate: ""
    });

    const handleValueChange = (nameField: string, value: any) => {
        if (nameField == 'declarationType') {
            setSelectedDeclaration(value);
        }
        setFormData(prev => ({
            ...prev,
            [nameField]: value
        }))
    }

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

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIdsOnPage = currentTableData.map(item => item.id);
            setListDeclarationCode(allIdsOnPage);
        } else {
            setListDeclarationCode([]);
        }
    }

    const handleSelectRow = (id: any) => {
        setListDeclarationCode(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    }

    useEffect(() => {
        dispatch(setActiveTitle(t("create_payment_request")));
    }, [dispatch]);

    useEffect(() => {
        dispatch(setSelectedIds(listDeclarationCode));
        const total = mockData
            .filter(item => listDeclarationCode.includes(item.id))
            .reduce((sum, item) => {
                const num = parseInt(item.amount.replace(/\./g, ''));
                return sum + num;
            }, 0);

        dispatch(setTotalAmount(total));
    }, [listDeclarationCode, dispatch]);

    return (
        <div className="flex flex-col gap-3 text-black">
            <form onSubmit={handleSearch}>
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-[#1e3a5f] uppercase text-sm tracking-wide">
                        {t('search')}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 mb-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('type_declaration')}</label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.declarationType || undefined} 
                                onChange={(value) => handleValueChange("declarationType", value)}
                                options={declarations.map((type) => ({
                                    value: type.code,
                                    label: `${type.name} (${type.acronym.toUpperCase()})`,
                                }))}
                            />
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
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('plan')}</label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.declarationType || undefined} 
                                onChange={(value) => handleValueChange("declarationType", value)}
                                options={(selectedDeclaration == 'bhxh' ? plans.bhxh : plans.bhythgd).map((plan) => ({
                                    value: plan.code,
                                    label: plan.name,
                                }))}
                                disabled={formData.declarationType == ""}
                                className={`${formData.declarationType == "" ? 'bg-gray-300' : ' bg-white'}`}
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
                    <div className="flex flex-wrap justify-between items-center bg-white px-4 pt-4">
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-gray-800 text-sm">{t('record_list')}</h1>
                            <span className="bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded-full">{mockData.length}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow overflow-hidden px-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1e3a5f] text-white whitespace-nowrap">
                                        <th className="flex items-center gap-2 px-4 py-3 font-semibold border-r border-white">
                                            <input 
                                                type="checkbox" 
                                                onChange={handleSelectAll}
                                                checked={currentTableData.length > 0 && listDeclarationCode.length === currentTableData.length}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                            {t('declaration_code')}
                                        </th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('application_type')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('collector')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('participant_name')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('social_code')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('plan')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white">{t('document_date')}</th>
                                        <th className="px-4 py-3 font-semibold border-r border-white text-right">{t('contribution_amount')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentTableData.map((row, idx) => {
                                        const isSelected = listDeclarationCode.includes(row.id);
                                        return (
                                            <tr 
                                                key={idx} 
                                                className={`transition-colors ${isSelected ? 'bg-gray-200' : 'hover:bg-blue-50/30 bg-white'}`}
                                            >
                                                <td className="flex items-center gap-2 px-4 py-3 text-blue-600 font-medium text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isSelected}
                                                        onChange={() => handleSelectRow(row.id)}
                                                        className="w-4 h-4 cursor-pointer"
                                                    />
                                                    {row.id}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{row.type}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.staff}</td>
                                                <td className="px-4 py-3 font-medium text-gray-700">{row.name}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.code}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.method}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.date}</td>
                                                <td className="px-4 py-3 text-right text-teal-600 font-bold">{row.amount}</td>
                                            </tr>
                                        )
                                    })}
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