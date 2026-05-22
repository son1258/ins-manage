"use client"

import { faSearch, faSync, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import InputGroup from '@/components/InputGroup';
import { useDispatch } from 'react-redux';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';
import { PROVIDER_ORDER_STATUS, PAYMENT_STATUS, PLANS, SERVICE_CODE, INTERNAL_STATUS } from '@/constants';
import CustomSelect from '@/components/CustomSelect';
import dayjs from 'dayjs';
import DateRangePicker from '@/components/DateRangePicker';
import { formatVND } from '@/utils/common';
import { useOrderList } from '@/hooks/useOrder';
import { downloadFileExcel } from '@/services/orderService';

export default function Declarations() {
    const t = useTranslations();
    const locale = useLocale();
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const accessToken = Cookies.get('accessToken') || "";
    const today = dayjs();
    const from = today.subtract(6, "day");
    const [selectedDeclaration, setSelectedDeclaration] = useState(SERVICE_CODE.BHXH);
    const [isLoadingState, startTransition] = useTransition();

    const declarations = [
        { code: SERVICE_CODE.BHXH, name: t('social_ins'), acronym: "bhxh" },
        { code: SERVICE_CODE.BHYT, name: t('family_health_ins'), acronym: "bhythgd" },
    ]

    const plans = {
        bhxh: [
            { code: PLANS.NEXT_PAYMENT, name: t('next_payment') },
            { code: PLANS.NEW, name: t('new') },
            { code: PLANS.DECREASE, name: t('decrease') },
            { code: PLANS.REPAY, name: t('repay') },
            { code: PLANS.MAKE_UP_PAYMENT, name: t('make_up_payment') },
        ],
        bhythgd: [
            { code: PLANS.RENEWAL, name: t('renewal') },
            { code: PLANS.NEW, name: t('new') },
            { code: PLANS.DECREASE, name: t('decrease') },
        ]
    }

    const internalStatus = [
        { code: INTERNAL_STATUS.RECORD, name: t('record') },
        { code: INTERNAL_STATUS.WAIT_PAID, name: t('pending_payment') },
        { code: INTERNAL_STATUS.PAID, name: t('paid') },
        { code: INTERNAL_STATUS.RECORD_CREATED, name: t('record_created') },
        { code: INTERNAL_STATUS.RECORD_SUBMITTED, name: t('record_submitted') },
        { code: INTERNAL_STATUS.APPROVED_BY_SOCIAL_INS, name: t('approved_by_social_ins') },
        { code: INTERNAL_STATUS.RETURNED_BY_SOCIAL_INS, name: t('return_by_social_ins') },
        { code: INTERNAL_STATUS.CANCELLED, name: t('cancelled_declaration') },
    ]

    const providerStatus = [
        { code: PROVIDER_ORDER_STATUS.SUCCESS, name: t('create_declaration_success') },
        { code: PROVIDER_ORDER_STATUS.PAID_BY_PARTNER, name: t('paid_by_partner') },
        { code: PROVIDER_ORDER_STATUS.PENDING_PAYMENT_SOCIAL_INS, name: t('pending_payment_social_ins') },
        { code: PROVIDER_ORDER_STATUS.PAID_BY_SOCIAL_INS, name: t('paid_buy_social_ins') },
        { code: PROVIDER_ORDER_STATUS.RECORD_CREATED, name: t('record_created') },
        { code: PROVIDER_ORDER_STATUS.RECORD_SUBMITTED, name: t('record_submitted') },
        { code: PROVIDER_ORDER_STATUS.APPROVED_BY_SOCIAL_INS, name: t('approved_by_social_ins') },
        { code: PROVIDER_ORDER_STATUS.RETURNED_BY_SOCIAL_INS, name: t('return_by_social_ins') },
        { code: PROVIDER_ORDER_STATUS.CANCELLED, name: t('cancelled') },
    ]

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const statusParam = searchParams.get('status') != null ? Number(searchParams.get('status')) : "";
    const socialStatusParam = searchParams.get('provider_order_status') != null ? Number(searchParams.get('provider_order_status')) : "";
    const serviceCodeParam = searchParams.get('service_code') != null ? Number(searchParams.get('service_code')) : SERVICE_CODE.BHXH;
    const params = {
        limit: limit,
        page: page,
        serviceCode: serviceCodeParam,
        medicalCode: "",
        customerName: "",
        customerPhone: "",
        providerStatus: socialStatusParam,
        status: statusParam,
        plan: "",
        fromDate: from.format("YYYY-MM-DD"),
        toDate: today.format("YYYY-MM-DD"),
        receiptFromDate: "",
        receiptToDate: "",
        fromMonth: "",
        toMonth: ""
    }

    const defaultParams = {
        limit: 10,
        page: 1,
        serviceCode: SERVICE_CODE.BHXH,
        medicalCode: "",
        customerName: "",
        customerPhone: "",
        providerStatus: "",
        status: "",
        plan: "",
        fromDate: from.format("YYYY-MM-DD"),
        toDate: today.format("YYYY-MM-DD"),
        receiptFromDate: "",
        receiptToDate: "",
        fromMonth: "",
        toMonth: ""
    }

    const [formData, setFormData] = useState(params);
    const { data: ordersRes, isLoading: isLoadOrders, isError: errLoadOrders } = useOrderList(params, accessToken);
    const orders = errLoadOrders ? [] : ordersRes?.data;

    const getPaymentStatus = (status: string) => {
        const statusMap: Record<string, { bg: string; label: string }> = {
            [PAYMENT_STATUS.RECORDED]: { bg: 'bg-green-600', label: t('recorded') },
            [PAYMENT_STATUS.WAIT_PAID]: { bg: 'bg-amber-400', label: t('pending_payment') },
        }
        return statusMap[status] ?? { bg: 'bg-blue-600', label: t('paid') }
    }

    const getPlanLabel = (plan: string) => {
        const planMap: Record<string, string> = {
            [PLANS.NEW]: t('new'),
            [PLANS.RENEWAL]: t('renewal'),
        }
        return planMap[plan] ?? t('decrease')
    }

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
        const newParams = new URLSearchParams();
        newParams.set('limit', String(formData.limit));
        newParams.set('page', '1');
        newParams.set('from_date', String(formData.fromDate));
        newParams.set('to_date', String(formData.toDate));
        newParams.set('service_code', String(formData.serviceCode));
        if (formData.status !== "" && formData.status !== null) {
            newParams.set('status', String(formData.status));
        }
        if (formData.providerStatus !== "" && formData.providerStatus !== null) {
            newParams.set('provider_order_status', String(formData.providerStatus));
        }
        if (formData.medicalCode) {
            newParams.set('medical_code', formData.medicalCode);
        }
        if (formData.customerName) {
            newParams.set('customer_name', formData.customerName);
        }
        if (formData.plan) {
            newParams.set('plan', formData.plan);
        }
        if (formData.customerPhone) {
            newParams.set('customer_phone', formData.customerPhone);
        }
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const handleRefresh = () => {
        setFormData(defaultParams)
        const newParams = new URLSearchParams();
        newParams.set('limit', String(formData.limit));
        newParams.set('page', '1');
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

    const getDateViaServiceCode = (serviceCode: any, date: any) => {
        if (!date) return "";
        return Number(serviceCode) == SERVICE_CODE.BHXH ? dayjs(date).format("MM-YYYY") : dayjs(date).format("DD-MM-YYYY");
    }

    const getServiceNameFromCode = (serviceCode: number) => {
        const find = declarations.find((item: any) => item.code == serviceCode);
        return find?.acronym.toUpperCase();
    }

    const exportFile = () => {
        if (!accessToken) return;
        startTransition(async () => {
            const resp = await downloadFileExcel(formData, accessToken);
            if (resp && resp.success) {
                const url = resp.data.download_url;
                window.open(url, "_blank");
            }
        });
    };

    useEffect(() => {
        dispatch(setActiveTitle(t('list_declaration')));
    }, [t])

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
                            onChange={(e) => handleValueChange("medicalCode", e.target.value)}
                        />

                        <InputGroup
                            label={t('customer_name')}
                            value={formData.customerName}
                            onChange={(e) => handleValueChange("customerName", e.target.value)}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('status')}</label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.status}
                                onChange={(value) => handleValueChange("status", value)}
                                options={internalStatus.map((type: any) => ({
                                    value: type.code,
                                    label: type.name,
                                }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('social_status')}</label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.providerStatus}
                                onChange={(value) => handleValueChange("providerStatus", value)}
                                options={providerStatus.map((type: any) => ({
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
                            <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full">{orders && orders.length}</span>
                        </div>
                        <button
                            onClick={exportFile}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-[#2a5285] transition-colors">
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
                                                {getPlanLabel(order.ld_pa)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{order.ld_name}</td>
                                            <td className="px-4 py-3 text-gray-600">{dayjs(order.ld_dob).format("DD-MM-YYYY")}</td>
                                            <td className="px-4 py-3 text-gray-600">{order.ld_maso_bhxh}</td>
                                            <td className="px-4 py-3 text-gray-600">{dayjs(order.created_at).format("DD/MM/YYYY")}</td>
                                            <td className="px-4 py-3 text-gray-600">{order.billing_date}</td>
                                            <td className="px-4 py-3 text-center">
                                                {(() => {
                                                    const { bg, label } = getPaymentStatus(order.status)
                                                    return (
                                                        <span className={`${bg} text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap`}>
                                                            {label}
                                                        </span>
                                                    )
                                                })()}
                                            </td>
                                            <td className="px-4 py-3 text-right">{order.distributors_order_number}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">
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
                            currentPage={page}
                            totalItems={ordersRes?.paginate.total || 0}
                            pageSize={limit}
                            onPageChange={(page) => handlePageChange(page)}
                            onPageSizeChange={(limit) => handleLimitChange(limit)}
                        />
                    </div>
                </div>
            </div>
            <Loading stateShow={isLoadOrders || isLoadingState} />
        </div>
    )
}