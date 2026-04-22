import { Modal as AntModal, Button } from 'antd';
import { useTranslations } from "next-intl";
import { ExclamationCircleFilled } from '@ant-design/icons';

interface Props {
    isOpen: boolean;
    title: string;
    onConfirm: () => void;
    onClose: () => void;
    loading?: boolean;
}

export default function Modal({ isOpen, title, onConfirm, onClose, loading = false }: Props) {
    const t = useTranslations();

    return (
        <AntModal
            title={
                <div className="flex items-center gap-2">
                    <ExclamationCircleFilled className="text-amber-500 text-xl" />
                    <span className="text-gray-800 font-bold">{t('confirmation')}</span>
                </div>
            }
            open={isOpen}
            onOk={onConfirm}
            onCancel={onClose}
            confirmLoading={loading}
            centered
            footer={[
                <Button 
                    key="back" 
                    onClick={onClose}
                    className="rounded-md border-gray-300 hover:text-gray-600"
                >
                    {t('no')}
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={loading} 
                    onClick={onConfirm}
                    className="bg-[#926BFF] hover:bg-[#5e29f2] border-none rounded-md px-6"
                >
                    {t('yes')}
                </Button>,
            ]}
            styles={{
                mask: { backdropFilter: 'blur(4px)' }
            }}
            width={400}
        >
            <div className="py-4 text-gray-600 text-[15px]">
                {title}
            </div>
        </AntModal>
    );
}