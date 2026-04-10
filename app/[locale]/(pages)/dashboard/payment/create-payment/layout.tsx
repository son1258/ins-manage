"use client"

import InfoItem from '@/components/InfoItem';
import { faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux'; 
import { toast } from 'react-toastify';

export default function CreatePaymentLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations();
    const { selectedIds, totalAmount } = useSelector((state: any) => state.payment);
    const [showModal, setShowModal] = useState(false);

    const createPayment = () => {
        if (!totalAmount) return;
        setShowModal(true);

    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Đã sao chép: " + text);
    };

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
           {showModal && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-2xl w-2/7 overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-2 border-b border-gray-100">
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

            <div className="p-4">
                <div className="mb-4 border-b border-gray-100">
                    <div className="inline-block border-b-2 border-blue-600 px-2 text-blue-800 font-bold text-sm">
                        Vietcombank
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 items-start">
                    <div className="w-full md:w-1/2 flex flex-col items-center gap-3">
                        <div className="border-2 border-gray-100 rounded-xl bg-white shadow-sm">
                            <img 
                                src={`https://api.vietqr.io/image/vietcombank-970436-23121321232.jpg?amount=${totalAmount}&addInfo=TT%201000307140`}
                                alt="QR Payment" 
                                className="w-42 h-42 object-contain"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-5 text-xs">
                        <div className="">
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
                                value={`${totalAmount.toLocaleString('vi-VN')} đ`} 
                                isRed
                                onCopy={() => copyToClipboard(totalAmount.toString())}
                            />
                            <div className="pt-2">
                                <label className="text-sm font-bold text-gray-700 block mb-1">{t('explan')}:</label>
                                <div className="flex items-center gap-2 group">
                                    <span className="text-red-600 font-bold">TT</span>
                                    <span>
                                        1000307140
                                    </span>
                                    <span className="text-red-500 font-bold">1000307140</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    )
}