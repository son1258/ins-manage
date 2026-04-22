"use client"

import InfoItem from '@/components/InfoItem';
import { faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux'; 
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { handleApiError } from '@/utils/errorHandler';
import { createNewPayment } from '@/services/paymentService';
import { useRouter } from 'next/navigation';

export default function CreatePaymentLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations();
    const { selectedIds, totalAmount } = useSelector((state: any) => state.payment);
    const accessToken = Cookies.get('accessToken');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const locale = useLocale();

    const createPayment = async () => {
        if (!totalAmount || !accessToken) return;
        try {
            setIsLoading(false);
            const resp = await createNewPayment({order_id_list: selectedIds}, accessToken);
            if (resp) {
                router.push(`/${locale}/dashboard/payment`)
            }
        }catch(err: any) {
            console.log('Error get medicals: ', err);
            handleApiError(err, t);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative flex flex-col min-h-full bg-[#f4f7fa] w-full">
            <div className="flex-1 pb-4"> 
                {children}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10 -mx-4 mt-4">
                <div className="flex justify-between items-center w-full px-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                            {t('info_payment_request')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[#1e3a5f]">
                                {selectedIds?.length > 0 ? selectedIds.length : "--"}
                            </span>
                            <span className="text-gray-500 text-sm">hồ sơ /</span>
                            <span className="text-2xl font-bold text-red-600">
                                {selectedIds?.length > 0 ? totalAmount.toLocaleString('vi-VN') : "--"}
                            </span>
                            <span className="text-[#1e3a5f] font-bold">đ</span>
                        </div>
                    </div>

                    <button
                        onClick={createPayment}
                        disabled={!selectedIds || selectedIds.length === 0}
                        className={`px-8 py-3 rounded-md font-bold text-sm transition-all shadow-md
                            ${selectedIds?.length > 0 
                                ? 'bg-[#1e3a5f] text-white hover:bg-[#152944] active:scale-95' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {t('create_payment_summary')}
                    </button>
                </div>
            </div>
        </div>
    )
}