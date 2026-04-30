"use client"

import { faSearch, faSync, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import InputGroup from '@/components/InputGroup';
import { useDispatch } from 'react-redux';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { handleApiError } from '@/utils/errorHandler';
import { loadOrders } from '@/services/orderService';
import Loading from '@/components/Loading';
import { DECLARATION_STATUS, PAYMENT_STATUS, PLANS, SERVICE_CODE, STATUS } from '@/constants';
import CustomSelect from '@/components/CustomSelect';
import dayjs from 'dayjs';
import DateRangePicker from '@/components/DateRangePicker';
import { formatVND } from '@/utils/common';

export default function Declarations() {
    const t = useTranslations();
    const locale = useLocale();
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const accessToken = Cookies.get('accessToken');
    const today = dayjs();
    const from = today.subtract(6, "day");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDeclaration, setSelectedDeclaration] = useState(SERVICE_CODE.BHXH);

    const declarations = [
        {code: SERVICE_CODE.BHXH, name: t('social_ins'), acronym: "bhxh"},
        {code: SERVICE_CODE.BHYT, name: t('family_health_ins'), acronym: "bhythgd"},
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

    const status = [
        { code: DECLARATION_STATUS.RECORDED, name: t('recorded') },
        { code: DECLARATION_STATUS.PENDING_PAYMENT, name: t('pending_payment') },
        { code: DECLARATION_STATUS.PAID, name: t('paid') },
        { code: DECLARATION_STATUS.RECORD_CREATED, name: t('record_created') },
        { code: DECLARATION_STATUS.SUBMITTED, name: t('sumitted') },
        { code: DECLARATION_STATUS.APPROVED_BY_SOCIAL_INS, name: t('approved_by_social_ins') },
        { code: DECLARATION_STATUS.RETURNED_BY_SOCIAL_INS, name: t('returned_by_social_ins') },
        { code: DECLARATION_STATUS.CANCELLED_DECLARATION, name: t('cancelled_declaration') },
    ]

    const [formData, setFormData] = useState<any>({
        limit: 10,
        page: 1,
        serviceCode: SERVICE_CODE.BHXH,
        medicalCode: "",
        customerName: "",
        customerPhone: "",
        status: STATUS.ACTIVE,
        plan: "",
        fromDate: from.format("YYYY-MM-DD"),
        toDate: today.format("YYYY-MM-DD"),
        receiptFromDate: "",
        receiptToDate: "",
        fromMonth: "",
        toMonth: ""
    });

    const handleValueChange = (nameField: string, value: any) => {
        if (nameField == 'serviceCode') {
            setSelectedDeclaration(value);
        }

        setFormData((prev: any) => ({
            ...prev,
            [nameField]: value
        }))
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.set('limit', String(formData.limit));
        params.set('page', '1');
        params.set('status', String(formData.status));
        params.set('from_date', String(formData.fromDate));
        params.set('to_date', String(formData.toDate));
        params.set('service_code', String(formData.serviceCode));
        if (formData.medicalCode) {
            params.set('medical_code', formData.medicalCode);
        }
        if (formData.customerName) {
            params.set('customer_name', formData.customerName);
        }
        if (formData.plan) {
            params.set('plan', formData.plan);
        }
        if (formData.customerPhone) {
            params.set('customer_phone', formData.customerPhone);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleRefresh = () => {
        router.push(pathname);
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

    const getDateViaServiceCode = (serviceCode: any, date: any) => {
        if (!date) return "";
        return Number(serviceCode) == SERVICE_CODE.BHXH ? dayjs(date).format("MM-YYYY") : dayjs(date).format("DD-MM-YYYY");                                         
    } 

    const getOrders = async (data: any) => {
        if (!accessToken) return;
        try {
            setIsLoading(true);
            const resp = await loadOrders(data, accessToken);
            if (resp && resp.success) {
                setOrders(resp.data);
                setTotalPage(resp.paginate.total);
            }
        } catch(err: any) {
            console.log('Error get medicals: ', err);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
    }

    const getServiceNameFromCode = (serviceCode: number) => {
        const find = declarations.find((item: any) => item.code == serviceCode);
        return find?.acronym.toUpperCase();
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('list_declaration')));
        const serviceCode = Number(searchParams.get('service_code')) || SERVICE_CODE.BHXH;
        const medicalCodeParams = searchParams.get('medical_code');
        const customerNameParams = searchParams.get('customer_name');
        const customerPhoneParam = searchParams.get('customer_phone');
        const planParams = searchParams.get('plan');
        const fromDateParams = searchParams.get('from_date');
        const toDateParams = searchParams.get('to_date');
        const statusParams = searchParams.get('status');
        const limitParams = Number(searchParams.get('limit')) || 10;
        const pageParams = Number(searchParams.get('page')) || 1;

        const dataFromUrl = {
            limit: limitParams || 10,
            page: pageParams || 1,
            serviceCode: serviceCode || SERVICE_CODE.BHXH,
            medicalCode: medicalCodeParams || "",
            customerName: customerNameParams || "",
            customerPhone: customerPhoneParam || "",
            status: (statusParams !== null && statusParams !== "") ? Number(statusParams) : "",
            plan: planParams || "",
            fromDate: fromDateParams || today.subtract(6, "days").format("YYYY-MM-DD"),
            toDate: toDateParams || today.format("YYYY-MM-DD"),
            receiptFromDate: "",
            receiptToDate: "",
            fromMonth: "",
            toMonth: ""
        }

        setFormData(dataFromUrl);
        setCurrentPage(dataFromUrl.page);
        setPageSize(dataFromUrl.limit);
        getOrders(dataFromUrl);
    },[searchParams])

    return (
        <div className="flex flex-col gap-3 text-black pb-4 w-full">
            <form onSubmit={handleSearch}>
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 mb-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('type_declaration')}</label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.serviceCode || undefined} 
                                onChange={(value) => handleValueChange("serviceCode", value)}
                                options={declarations.map((type) => ({
                                    value: type.code,
                                    label: `${type.name} (${type.acronym.toUpperCase()})`,
                                }))}
                            />
                        </div>

                        <InputGroup 
                            label={t('social_code')} 
                            value={formData.medicalCode}
                            onChange={(e)=>handleValueChange("medicalCode", e.target.value)}
                        />

                        <InputGroup 
                            label={t('customer_name')} 
                            value={formData.customerName}
                            onChange={(e)=>handleValueChange("customerName", e.target.value)}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('status')}</label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.status} 
                                onChange={(value) => handleValueChange("status", value)}
                                options={status.map((type: any) => ({
                                    value: type.code,
                                    label: type.name,
                                }))}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('plan')}</label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.plan || undefined} 
                                onChange={(value) => handleValueChange("plan", value)}
                                options={(selectedDeclaration == SERVICE_CODE.BHXH ? plans.bhxh : plans.bhythgd).map((type: any) => ({
                                    value: type.code,
                                    label: type.name,
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

                        <DateRangePicker
                            label={t('receipt_date')}
                            fromDate={formData.receiptFromDate}
                            toDate={formData.receiptFromDate}
                            fieldFrom="receiptFromDate"
                            fieldTo="receiptToDate"
                            onChange={handleValueChange}
                        />
                        {formData.serviceCode && (
                            <>
                                {selectedDeclaration == SERVICE_CODE.BHXH ? (
                                    <DateRangePicker
                                        picker={"month"}
                                        label={t('from_month')}
                                        fromDate={formData.receiptFromDate}
                                        toDate={formData.receiptFromDate}
                                        onChange={handleValueChange}
                                    />
                                ) : (
                                    <DateRangePicker
                                        label={t('from_date_card_ins')}
                                        fromDate={formData.receiptFromDate}
                                        toDate={formData.receiptFromDate}
                                        onChange={handleValueChange}
                                    />                    
                                )}
                            </>
                        )}
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
                            className="flex items-center bg-gray-800 border border-gray-800 text-white px-2 py-1 rounded ont-medium hover:bg-gray-900 transition-all text-sm shadow-sm cursor-pointer">
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
                            <h1 className="font-bold text-gray-800 text-sm">{t('list_declaration')}</h1>
                            <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full">{orders.length}</span>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-[#2a5285] transition-colors">
                            <FontAwesomeIcon icon={faFileExport} />{t('export_excel')}
                        </button>
                    </div>

                    <div className="bg-white rounded shadow overflow-hidden px-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--global-main-color)] text-white whitespace-nowrap">
                                        <th className="px-4 py-3 border-r border-white text-center">{t('declaration_code')}</th>
                                        <th className="px-4 py-3 border-r border-white">{t('user')}</th>
                                        <th className="px-4 py-3 border-r border-white">{t('voucher_code')}</th>
                                        <th className="px-4 py-3 border-r border-white">{t('plan')}</th>
                                        <th className="px-4 py-3 border-r border-white">{t('participant_name')}</th>
                                        <th className="px-4 py-3 border-r border-white">{t('birthday')}</th>
                                        <th className="px-4 py-3 border-r border-white">{t('social_code')}</th>
                                        <th className="px-4 py-3 border-r border-white">{t('register_date')}</th>
                                        <th className="px-4 py-3 border-r border-white">{t('receipt_date')}</th>
                                        <th className="px-4 py-3 border-r border-white text-left">{t('status')}</th>
                                        <th className="px-4 py-3 border-r border-white text-left">{t('partner_code')}</th>
                                        <th className="px-4 py-3 border-r border-white text-left">{t('partner_payment_status')}</th>
                                        <th className="px-4 py-3 border-r border-white text-left">{t('cancellation_reason')}</th>
                                        <th className="px-4 py-3 border-r border-white text-left">
                                            {(formData.serviceCode == SERVICE_CODE.BHXH) ? t('from_month') : t('from_date_card')}
                                        </th>
                                        {formData.serviceCode != SERVICE_CODE.BHXH ? (
                                            <th className="px-4 py-3 border-r border-white text-left">
                                                {t('house_medical_amount')}
                                            </th>
                                        ) : (
                                            <></>
                                        )}
                                        <th className="px-4 py-3 border-r border-white text-left">
                                            {formData.serviceCode == SERVICE_CODE.BHXH ? t('social_amount') : t('medical_amount')}
                                        </th>
                                        <th className="px-4 py-3 border-r border-white text-right">
                                            {formData.serviceCode == SERVICE_CODE.BHXH ? t('contribution_amount') : t('medical_ins_amount')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders && orders.map((order: any, idx: number) => (
                                        <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-4 py-3 text-[var(--global-main-color)] font-medium text-center">
                                                <Link href={`/${locale}/dashboard/orders/${order.id}`}>
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {order.user.username}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {getServiceNameFromCode(order.service_code)}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-700">
                                                {
                                                    order.ld_pa == PLANS.NEW ? t('new') :
                                                    order.ld_pa == PLANS.RENEWAL ? t('renewal') : t('decrease')
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{order.ld_name}</td>
                                            <td className="px-4 py-3 text-gray-600">{dayjs(order.ld_dob).format("DD-MM-YYYY")}</td>
                                            <td className="px-4 py-3 text-gray-600">{order.ld_maso_bhxh}</td>
                                            <td className="px-4 py-3 text-gray-600">{dayjs(order.created_at).format("DD/MM/YYYY")}</td>
                                            <td className="px-4 py-3 text-gray-600">{order.ngay_bien_lai}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">
                                                    {order.status == PAYMENT_STATUS.RECORDED ? t('recorded') : t('paid') }
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">{order.distributors_order_number}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="bg-green-600 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">
                                                    {t('paid')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-teal-600 font-bold">{order.comment}</td>
                                            <td className="px-4 py-3 text-right text-teal-600 font-bold">
                                                {getDateViaServiceCode(order.service_code, order.start_date)}
                                            </td>
                                            {formData.serviceCode != SERVICE_CODE.BHXH ? (
                                                <td className="px-4 py-3 border-r border-white text-left">100</td>
                                            ) : (<></>)}
                                            <td className="px-4 py-3 text-right text-teal-600 font-bold">{formatVND(order.amount)}</td>
                                            <td className="px-4 py-3 text-right text-teal-600 font-bold">{formatVND(order.base_amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalPage}
                            pageSize={pageSize}
                            onPageChange={(page) => handlePageChange(page)}
                            onPageSizeChange={(limit) => handleLimitChange(limit)}
                        />
                    </div>
                </div>
            </div>
            <Loading stateShow={isLoading}/>
        </div>
    )
}