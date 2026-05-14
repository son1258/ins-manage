"use client"

import { faSearch, faSync, faTrash, faFileAlt, faCirclePlus, faQrcode, faChevronRight, faChevronDown, faTimes, faCheck} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import Pagination from '@/components/Pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import InputGroup from '@/components/InputGroup';
import React from 'react';
import CustomSelect from '@/components/CustomSelect';
import DateRangePicker from '@/components/DateRangePicker';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { PAYMENT_STATUS, SERVICE_CODE } from '@/constants';
import dayjs from 'dayjs';
import InfoItem from '@/components/InfoItem';
import { formatVND } from '@/utils/common';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { useListOrdersInBatchPayment, usePaymentList, useTerminatePaymentMutation } from '@/hooks/usePayment';
import { confirmPayment } from '@/services/paymentService';
import { toast } from 'react-toastify';
import { handleApiError } from '@/utils/errorHandler';
import { useQueryClient } from '@tanstack/react-query';

export default function Payment() {
    const t = useTranslations();
    const router = useRouter();
    const locale = useLocale();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const accessToken = Cookies.get('accessToken') || "";
    const today = dayjs();
    const from = today.subtract(6, "day");
    const queryClient = useQueryClient();
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTerminate, setModalTerminate] = useState(false);
    const [selectItem, setSelectItem] = useState<any>();
    const [currentSubPage, setCurrentSubPage] = useState(1);
    const [subPageSize, setSubPageSize] = useState(10);
    const [batchPaymentId, setBatchPaymentId] = useState('');
    const [isLoadingConfirm, startTransition] = useTransition();

    const status = [
        {code: PAYMENT_STATUS.PAID, name: t('paid')},
        {code: PAYMENT_STATUS.RECORDED, name: t('pending_payment')},
    ]

    const declarations = [
        {code: SERVICE_CODE.BHXH, name: t('social_ins'), acronym: "bhxh"},
        {code: SERVICE_CODE.BHYT, name: t('family_health_ins'), acronym: "bhythgd"},
    ]

    const defaultParams = {
        paymentCode: "",
        status: null,
        fromDate: from.format("YYYY-MM-DD"),
        toDate: today.format("YYYY-MM-DD"),
        limit: 10,
        page: 1
    }

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const params = {
        paymentCode: searchParams.get('payment_code') != null ? searchParams.get('payment_code') : "",
        status: searchParams.get('status') !== null ? Number(searchParams.get('status')) : null,
        fromDate: searchParams.get('from_date') !== null ? searchParams.get('from_date') : from.format("YYYY-MM-DD"),
        toDate: searchParams.get('to_date') !== null ? searchParams.get('to_date') : today.format("YYYY-MM-DD"),
        limit: limit,
        page: page
    }
    const [formData, setFormData] = useState(params);
    const {data: paymentsRes, isLoading: isLoadPayments, isError: errLoadPayments} = usePaymentList(params, accessToken);
    const payments = errLoadPayments ? [] : paymentsRes?.data;
    const terminatePaymentMutation = useTerminatePaymentMutation(accessToken, t);
    const { data: ordersRes, isLoading: isLoadOrders, isError: errLoadOrders } = useListOrdersInBatchPayment(
        {
            batchPaymentId: expandedRow,
            page: currentSubPage,
            limit: subPageSize,
        },
        accessToken
    )
    const listOrders = errLoadOrders ? [] : ordersRes?.data;

    const handleValueChange = (nameField: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [nameField]: value
        }))
    }

    const handleShowOr = (item: any) => {
        setShowModal(true);
        setSelectItem(item);
    }

    const toggleRow = (payment: any) => {
        if (payment.status !== PAYMENT_STATUS.WAIT_PAID) return;
        setExpandedRow(prev => {
            if (prev === payment.id) return null
            return payment.id;
        })
    };

    const handleRefresh = () => {
        setFormData(defaultParams);
        const newParams = new URLSearchParams();
        newParams.set('limit', String(formData.limit));
        newParams.set('page', '1');
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const newParams = new URLSearchParams();
        newParams.set('limit', String(formData.limit));
        newParams.set('page', '1');
        newParams.set('from_date', String(formData.fromDate));
        newParams.set('to_date', String(formData.toDate));

        if (formData.status != null && formData.status != undefined) {
            newParams.set('status', String(formData.status));
        }
        if (formData.paymentCode) {
            newParams.set('payment_code', formData.paymentCode);
        }
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', String(page));
        handleValueChange('page', page);
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const handleLimitChange = (limit: number) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('limit', String(limit));
        newParams.set('page', '1');
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const onSelectedTerminatePayment = (id: string) => {
        setBatchPaymentId(id);
        setModalTerminate(!modalTerminate);
    }

    const onConfirmTerminatePayment = async () => {
        if (batchPaymentId) {
            const data = {
                batch_payment_id: batchPaymentId
            }
            await terminatePaymentMutation.mutateAsync(data);
            setModalTerminate(false);
            setExpandedRow(null);
        }
    }

    const getServiceNameFromCode = (serviceCode: number) => {
        const find = declarations.find((item: any) => item.code == serviceCode);
        return find?.acronym.toUpperCase();
    }

    const getPaymentStatusBadge = (status: string) => {
        const statusMap: Record<string, { bg: string; label: string }> = {
            [PAYMENT_STATUS.PAID]:   { bg: 'bg-blue-500', label: t('paid') },
            [PAYMENT_STATUS.CANCEL]: { bg: 'bg-red-500',  label: t('cancel') },
            [PAYMENT_STATUS.WAIT_PAID]: { bg: 'bg-amber-500',  label: t('pending_payment') },
        }
        return statusMap[status] ?? { bg: 'bg-green-400', label: t('record') }
    }

    const handleConfirmPayment = (payment: any) => {
        startTransition(async () => {
            try {
                const resp = await confirmPayment({batch_payment_id: payment.id}, accessToken);
                if (resp && resp.success) {
                    toast.success(t("success"));
                    await queryClient.invalidateQueries({queryKey: ['payments']})
                }
                } catch(err: any) {
                    handleApiError(err, t);
                }
            }
        )
    }

    useEffect(() => {
        dispatch(setActiveTitle(t('payment_request')));
    },[t])

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
                            label={t('create_date')}
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
            <div className="bg-white rounded-lg shadow overflow-x-auto mb-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap justify-between items-center bg-white px-4 pt-4">
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-gray-800 text-sm">{t('list_payment_request')}</h1>
                            <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full">{payments && payments.length}</span>
                        </div>
                        
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faFileAlt} />{t('download_file')}
                            </button>
                            <button 
                                onClick={() => router.push(`/${locale}/dashboard/payment/create-payment`)}
                                className="flex items-center gap-2 bg-gray-800 text-white px-2 py-1 text-xs cursor-pointer">
                                <FontAwesomeIcon icon={faCirclePlus} />{t('create_payment_request')}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow overflow-hidden px-4 pb-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--global-main-color)] text-white whitespace-nowrap">
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
                                    {payments && payments.map((payment: any) => (
                                        <React.Fragment key={payment.id}>
                                            <tr 
                                                className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${expandedRow === payment.id ? 'bg-blue-50/50' : ''}`}
                                            >
                                                <td className="px-4 py-3 text-[#1e3a5f] font-medium text-center flex items-center justyfy-center gap-2">
                                                    {payment.status === PAYMENT_STATUS.WAIT_PAID ? (
                                                        <FontAwesomeIcon 
                                                            onClick={() => toggleRow(payment)}
                                                            icon={expandedRow === payment.id ? faChevronDown : faChevronRight} 
                                                            className="text-gray-400 text-xs"
                                                        />
                                                    ) : (<></>)} {payment.code}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{payment.user.fullname}</td>
                                                <td className="px-4 py-3 text-teal-600 font-bold">{formatVND(payment.amount)}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {(() => {
                                                        const { bg, label } = getPaymentStatusBadge(payment.status)
                                                        return (
                                                            <span className={`${bg} px-3 py-1 text-white rounded-full text-[11px] whitespace-nowrap`}>
                                                                {label}
                                                            </span>
                                                        )
                                                    })()}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{dayjs(payment.created_at).format("DD-MM-YYYY")}</td>
                                                <td className="px-4 py-3 text-gray-600">{dayjs(payment.updated_at).format("DD-MM-YYYY")}</td>
                                                <td className="px-4 py-3 text-center text-gray-400 space-x-3">
                                                    {payment.status !== PAYMENT_STATUS.CANCEL && (
                                                        <div className='flex items-center justify-center w-full gap-2'>
                                                            {payment.status === PAYMENT_STATUS.RECORDED ? ( 
                                                                <button 
                                                                    onClick={() => handleConfirmPayment(payment)}
                                                                    className="hover:text-blue-600">
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleShowOr(payment)}
                                                                    className="hover:text-blue-600">
                                                                    <FontAwesomeIcon icon={faQrcode} />
                                                                </button>
                                                            )}
                                                            {(payment.status !== PAYMENT_STATUS.PAID || payment.status === PAYMENT_STATUS.RECORDED) && 
                                                                <button
                                                                    onClick={() => onSelectedTerminatePayment(payment.id)} 
                                                                    className="hover:text-red-600"><FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            }
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>

                                            {expandedRow === payment.id && listOrders && (
                                                <>
                                                    <tr>
                                                        <td colSpan={8} className="bg-orange-50/30 p-0">
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full text-[12px] border-t border-orange-100">
                                                                    <thead>
                                                                        <tr className="text-gray-500 font-semibold border-b border-orange-100">
                                                                            <th className="pl-14 py-2">{t('declaration_code')}</th>
                                                                            <th className="px-4 py-2">{t('user')}</th>
                                                                            <th className="px-4 py-2">{t('application_type')}</th>
                                                                            <th className="px-4 py-2">{t('social_code')}</th>
                                                                            <th className="px-4 py-2">{t('fullname')}</th>
                                                                            <th className="px-4 py-2 text-right">{t('total_amount')}</th>
                                                                            <th className="px-4 py-2 text-center">{t('register_date')}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {listOrders.map((order: any) => (
                                                                            <tr key={order.order_number} className="border-b border-orange-50 last:border-0">
                                                                                <td className="pl-14 py-2 text-blue-600">{order.order_number}</td>
                                                                                <td className="px-4 py-2">{order.user.fullname}</td>
                                                                                <td className="px-4 py-2">{getServiceNameFromCode(order.service_code)}</td>
                                                                                <td className="px-4 py-2 font-mono">{order.ld_maso_bhxh}</td>
                                                                                <td className="px-4 py-2 font-medium">{order.ld_name}</td>
                                                                                <td className="px-4 py-2 text-right text-teal-600 font-bold">{formatVND(order.amount)}</td>
                                                                                <td className="px-4 py-2 text-center">{dayjs(order.created_date).format("DD-MM-YYYY")}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-orange-50/30">
                                                        <td colSpan={8} className="px-4 py-2 border-b border-orange-100">
                                                            <Pagination
                                                                currentPage={currentSubPage}
                                                                totalItems={ordersRes?.paginate.total || 0}
                                                                pageSize={subPageSize}
                                                                onPageChange={(page) => setCurrentSubPage(page)}
                                                                onPageSizeChange={(limit) => setSubPageSize(limit)}
                                                            />
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-2">
                            <Pagination
                                currentPage={page}
                                totalItems={paymentsRes?.paginate.total || 0}
                                pageSize={limit}
                                onPageChange={(page) => handlePageChange(page)}
                                onPageSizeChange={(limit) => handleLimitChange(limit)}
                            />
                        </div>
                    </div>
                </div>
                {showModal && selectItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100">
                                <h3 className="text-base font-semibold text-gray-800">
                                    {t('transfer_info')}
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTimes} size="lg" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-4 border-b border-gray-100">
                                    <div className="inline-block border-b-2 border-blue-600 px-2 pb-1 text-blue-800 font-bold text-sm">
                                        Vietcombank
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                    <div className="w-full md:w-1/2 flex flex-col items-center">
                                        <div className="border-2 border-gray-100 rounded-xl bg-white shadow-sm p-2">
                                            <img 
                                                src={`https://api.vietqr.io/image/vietcombank-970436-23121321232.jpg?amount=${String(selectItem.amount).replace(/\D/g,'')}&addInfo=${encodeURIComponent('TT ' + selectItem.id)}`}
                                                alt="QR Payment" 
                                                className="w-40 h-40 object-contain"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2 italic">{t('scan_qr')}</p>
                                    </div>
                                    <div className="w-full md:w-1/2 space-y-3 text-[13px]">
                                        <InfoItem 
                                            label="Tên tài khoản" 
                                            value="CONG TY CO PHAN BAO HIEM PVI" 
                                        />
                                        <InfoItem 
                                            label="Số tài khoản" 
                                            value="0071001234567" 
                                        />
                                        <InfoItem 
                                            label="Ngân hàng" 
                                            value="Vietcombank - CN TP.HCM" 
                                        />
                                        <InfoItem 
                                            label="Số tiền" 
                                            value={formatVND(selectItem.amount)} 
                                            isRed
                                        />
                                        
                                        <div className="pt-2 border-t border-dashed border-gray-200">
                                            <label className="text-xs font-bold text-gray-700 block mb-1">{t('explan')}:</label>
                                            <div className="bg-gray-50 p-2 rounded border border-gray-100 break-all">
                                                <span className="text-red-600 font-bold">TT {selectItem.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal 
                isOpen={modalTerminate} 
                title={t('terminate_order')} 
                onConfirm={onConfirmTerminatePayment} 
                onClose={() => setModalTerminate(false)} 
            />
            <Loading stateShow={isLoadingConfirm || isLoadPayments || isLoadOrders || terminatePaymentMutation.isPending} />
        </div>
    )
}