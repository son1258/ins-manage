import { useTranslations } from "next-intl";

interface Props {
    isOpen: boolean;
    title: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function Modal({isOpen, title, onConfirm, onClose} : Props) {
    const t = useTranslations();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-sm shadow-2xl w-[90%] max-w-sm">
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>                
                <div className="flex gap-3 mt-2">
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-2 bg-[#926BFF] hover:bg-[#5e29f2] text-white rounded-lg font-medium transition-all"
                    >
                        {t('yes')}
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
                    >
                        {t('no')}
                    </button>
                </div>
            </div>
        </div>
    )
}