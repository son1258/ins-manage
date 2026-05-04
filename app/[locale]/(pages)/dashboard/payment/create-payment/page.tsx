"use client"

import { faSearch, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Pagination from '@/components/Pagination';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setBatchPayments, setExcludedItems, setIsPaymentDate, setSelectedItems, setTotalAmount } from '@/lib/redux/slices/paymentSlice';
import InputGroup from '@/components/InputGroup';
import CustomSelect from '@/components/CustomSelect';
import { PAYMENT_STATUS, PLANS, SERVICE_CODE } from '@/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DateRangePicker from '@/components/DateRangePicker';
import { handleApiError } from '@/utils/errorHandler';
import Cookies from 'js-cookie';
import { loadOrders } from '@/services/orderService';
import dayjs from 'dayjs';
import { formatVND } from '@/utils/common';
import Loading from '@/components/Loading';
import { createPaymentWithFilter, updatePaymentWithFilter } from '@/services/paymentService';

export default function CreatePaymentRequest() {
    const t = useTranslations();
    const router = useRouter();
    const locale = useLocale();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const accessToken = Cookies.get('accessToken');
    const today = dayjs();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [plans, setPlans] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [excludedIds, setExcludedIds] = useState<any[]>([]);
    const dataSelectedIds = useSelector((state: any) => state.payment.selectedItems);
    const [isCheckAllPayments, setIsCheckAllPayments] = useState(false);
    const [amountMap, setAmountMap] = useState<any>({});
    const [tempPaymentFilter, setTempPaymentFilter] = useState({
        batchPaymentId: "",
        fromDate: "",
        toDate: "",
        excludedIds: [],
    })
    
    const [formData, setFormData] = useState<any>({
        serviceCode: null,
        medicalCode: "",
        customerName: "",
        status: "",
        plan: "",
        fromDate: today,
        toDate: today
    });

    const declarations = [
        {code: SERVICE_CODE.BHXH, name: t('social_ins'), acronym: "bhxh"},
        {code: SERVICE_CODE.BHYT, name: t('family_health_ins'), acronym: "bhythgd"},
    ]

    const handleValueChange = (nameField: string, value: any) => {
        if (nameField == 'serviceCode') {
            if (value == SERVICE_CODE.BHXH) {
                setPlans([
                    {code: PLANS.NEXT_PAYMENT, name: t('next_payment')},
                    {code: PLANS.NEW, name: t('new')},
                    {code: PLANS.DECREASE, name: t('decrease')},
                    {code: PLANS.REPAY, name: t('repay')},
                    {code: PLANS.MAKE_UP_PAYMENT, name: t('make_up_payment')},
                ])
            } else {
                setPlans([
                    {code: PLANS.RENEWAL, name: t('renewal')},
                    {code: PLANS.NEW, name: t('new')},
                    {code: PLANS.DECREASE, name: t('decrease')},
                ])
            }
        } 
        setFormData((prev: any) => ({
            ...prev,
            [nameField]: value
        }))
    }

    const handleRefresh = () => {
        router.push(pathname);
        setIsCheckAllPayments(false);
        dispatch(setSelectedItems([]));
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCheckAllPayments(false);
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
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentIds = orders.map(item => item.id);
        if (isCheckAllPayments) {
            let newExcludedIds = [...excludedIds];
            if (e.target.checked) {
                newExcludedIds = newExcludedIds.filter(id => !currentIds.includes(id));
            } else {
                currentIds.forEach(id => {
                    if (!newExcludedIds.includes(id)) newExcludedIds.push(id);
                });
            }
            setExcludedIds(newExcludedIds);
            dispatch(setExcludedItems(newExcludedIds));
        } else {
            let newSelectedIds = [...dataSelectedIds];
            if (e.target.checked) {
                currentIds.forEach(id => {
                    if (!newSelectedIds.includes(id)) newSelectedIds.push(id);
                })
            } else {
                newSelectedIds = newSelectedIds.filter(id => !currentIds.includes(id));
            }
            dispatch(setSelectedItems(newSelectedIds));
            calculateTotalAmount(newSelectedIds);
        }
    }

    const handleSelectRow = (id: any) => {
        if (isCheckAllPayments) {
            let newExcludedIds = [...excludedIds];
            if (newExcludedIds.includes(id)) {
                newExcludedIds = newExcludedIds.filter(item => item !== id);
            } else {
                newExcludedIds.push(id);
            }
            setExcludedIds(newExcludedIds);
            dispatch(setExcludedItems(newExcludedIds));
        } else {
            let newSelectedIds = [...dataSelectedIds];
            if (newSelectedIds.includes(id)) {
                newSelectedIds = newSelectedIds.filter(item => item !== id);
            } else {
                newSelectedIds.push(id);
            }
            dispatch(setSelectedItems(newSelectedIds));
            calculateTotalAmount(newSelectedIds);
        }
    }

    const filterOrders = (listOrders: any) => {
        const values = listOrders.filter((item: any) => item.status == PAYMENT_STATUS.RECORDED);
        return values;
    }

    const getOrders = async (data: any) => {
        if (!accessToken) return;
        try {
            setIsLoading(true);
            const resp = await loadOrders(data, accessToken);
            if (resp && resp.success) {
                const newOrders = filterOrders(resp.data);
                setOrders(newOrders);
                setTotalItems(resp.paginate.total);
            }
        } catch(err: any) {
            console.log('Error get medicals: ', err);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
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

    const getServiceNameFromCode = (serviceCode: number) => {
        const find = declarations.find((item: any) => item.code == serviceCode);
        return find?.acronym.toUpperCase();
    }

    const handleDataPaymentWithDate = (data: any) => {
        dispatch(setTotalAmount(data.batch_payment.amount));
        dispatch(setSelectedItems(data.batch_payment.list_orders));
    }

    const createTempPaymentWithDate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecking = e.target.checked;
        setIsCheckAllPayments(isChecking);
        dispatch(setIsPaymentDate(isChecking));
        if (isChecking) {
            if (!accessToken) return;
            try {
                setIsLoading(true);
                const data = {
                    "from_date": formData.fromDate,
                    "to_date": formData.toDate,
                    "list_excluded_orders": []
                }
                const resp = await createPaymentWithFilter(data, accessToken);
                if (resp && resp.success) {
                    handleDataPaymentWithDate(resp.data[0]);
                    setTempPaymentFilter(prev => ({
                        ...prev,
                        batchPaymentId: resp.data[0].batch_payment.id,
                        fromDate: formData.fromDate,
                        toDate: formData.toDate,
                    }));
                } 
            } catch(err: any) {
                console.log('Error create payment with date: ', err);
                handleApiError(err, t);
                setIsCheckAllPayments(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            dispatch(setSelectedItems([]));
            dispatch(setTotalAmount(0));
        }
    }

    const updatePaymentWithDate = async () => {
        if (!accessToken) return;
        try {
            setIsLoading(true);
            const data = {
                "batch_payment_id": tempPaymentFilter.batchPaymentId,
                "from_date": tempPaymentFilter.fromDate,
                "to_date": tempPaymentFilter.toDate,
                "list_excluded_orders": excludedIds
            }
            const resp = await updatePaymentWithFilter(data, accessToken);
            if (resp && resp.success) {
                dispatch(setBatchPayments(resp.data[0].batch_payment));
                handleDataPaymentWithDate(resp.data[0]);
            }
        } catch(err: any) {
            console.log('Error update payment: ', err);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
    }

    const calculateTotalAmount = (currentSelectedIds: string[]) => {
        const total = currentSelectedIds.reduce((sum, id) => {
            return sum + (amountMap[id] || 0);
        }, 0);
        dispatch(setTotalAmount(total));
    };

    useEffect(() => {
        dispatch(setActiveTitle(t("create_payment_request")));
        const serviceCode = Number(searchParams.get('service_code'));
        const medicalCodeParams = searchParams.get('medical_code');
        const customerNameParams = searchParams.get('customer_name');
        const planParams = searchParams.get('plan');
        const fromDateParams = searchParams.get('from_date');
        const toDateParams = searchParams.get('to_date');
        const statusParams = searchParams.get('status');
        const limitParams = Number(searchParams.get('limit')) || 10;
        const pageParams = Number(searchParams.get('page')) || 1;
   
        const dataFromUrl = {
            limit: limitParams || 10,
            page: pageParams || 1,
            serviceCode: serviceCode,
            medicalCode: medicalCodeParams || "",
            customerName: customerNameParams || "",
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

    useEffect(() => {
        if (orders.length > 0) {
            setAmountMap((prev:any) => {
                const newMap = { ...prev };
                orders.forEach(item => {
                    let num = 0;
                    if (typeof item.amount === 'string') {
                        num = parseInt(item.amount.replace(/\./g, '')) || 0;
                    } else {
                        num = item.amount || 0;
                    }
                    newMap[item.id] = num;
                });
                return newMap;
            });
        }
    }, [orders]);

    useEffect(() => {
        dispatch(setSelectedItems([]));
        dispatch(setExcludedItems([]));
        dispatch(setTotalAmount(0));
        dispatch(setBatchPayments({}));
        dispatch(setIsPaymentDate(false));
        setExcludedIds([]);
        setIsCheckAllPayments(false);
    }, []);

    return (
        <div className="flex flex-col gap-3 text-black">
            <form onSubmit={handleSearch}>
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-[#1e3a5f] uppercase text-sm tracking-wide">
                        {t('search')}
                    </h2>
                    
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
                            <label className="text-sm mb-1 font-medium text-gray-600">{t('plan')}</label>
                            <CustomSelect
                                placeholder={t('select_option')}
                                value={formData.plan || undefined} 
                                onChange={(value) => handleValueChange("plan", value)}
                                options={plans.map((plan: any) => ({
                                    value: plan.code,
                                    label: plan.name,
                                }))}
                                disabled={formData.serviceCode == ""}
                                className={`${formData.serviceCode == "" ? 'bg-gray-300' : ' bg-white'}`}
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
                            <span className="bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded-full">{orders.length}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <label className="flex items-center cursor-pointer font-bold">
                                <input 
                                    type="checkbox"
                                    checked={isCheckAllPayments} 
                                    className="form-checkbox h-4 w-4 mr-2 cursor-pointer accent-[#1e3a5f]" 
                                    onChange={createTempPaymentWithDate}
                                />
                                <span>{t('all')}</span>
                            </label>
                        
                            <button
                                onClick={updatePaymentWithDate}
                                disabled={!isCheckAllPayments && !excludedIds}
                                className={`text-white px-2 py-1 rounded text-sm font-semibold cursor-pointer 
                                    ${excludedIds.length > 0 ? 'bg-[#1e3a5f] hover:bg-[#152944]' : 'bg-gray-300'}`}
                            >{t('update')}
                            </button>            
                        </div>
                    </div>

                    <div className="bg-white rounded shadow overflow-hidden px-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--global-main-color)] text-white whitespace-nowrap">
                                        <th className="flex items-center gap-2 px-4 py-3 font-semibold border-r border-white">
                                            {orders && orders.length > 0 && (
                                                <input 
                                                    type="checkbox" 
                                                    onChange={handleSelectAll}
                                                    checked={isCheckAllPayments 
                                                        ? orders.every(item => !excludedIds.includes(item.id))
                                                        : (orders.length > 0 && orders.every(item => dataSelectedIds.includes(item.id)))}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                            )}
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
                                    {orders.map((order, idx) => {
                                        const isSelected = isCheckAllPayments ? 
                                            !excludedIds.includes(order.id)
                                            : dataSelectedIds?.includes(order.id);
                                        return (
                                            <tr 
                                                key={order.id} 
                                                className={`transition-colors ${isSelected ? 'bg-gray-200' : 'hover:bg-blue-50/30 bg-white'}`}
                                            >
                                                <td className="flex items-center gap-2 px-4 py-3 text-blue-600 font-medium text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isSelected}
                                                        onChange={() => handleSelectRow(order.id)}
                                                        className="w-4 h-4 cursor-pointer"
                                                    />
                                                    {order.order_number}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{getServiceNameFromCode(order.service_code)}</td>
                                                <td className="px-4 py-3 text-gray-600">{order.collector?.name}</td>
                                                <td className="px-4 py-3 font-medium text-gray-700">{order.ld_name}</td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {order.ld_maso_bhxh}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {order.ld_pa == PLANS.NEW ? t("new") : t("renewal")}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{dayjs(order.created_at).format("DD-MM-YYYY")}</td>
                                                <td className="px-4 py-3 text-right text-teal-600 font-bold">
                                                    {formatVND(order.amount)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={(page) => handlePageChange(page)}
                            onPageSizeChange={(limit) => handleLimitChange(limit)}
                        />
                    </div>
                </div>
            </div>
            <Loading stateShow={isLoading} />
        </div>
    )
}