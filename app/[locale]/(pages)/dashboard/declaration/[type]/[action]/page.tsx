"use client"

import { use } from "react";
import { useTranslations } from "use-intl";

interface ParamProps {
    locale: string;
    type: string;
    action: string
}
interface Props {
    params: Promise<ParamProps>;
}

export default function DynamicDeclarationPage({params}: Props) {
    const t = useTranslations();
    const { type, action } = use(params);

    const getInfoPage = () => {
        const isMedical = type === "medical";
        const actions = {
            register: t('register_new'),
            renewal: t('renewal_new'),
            declaration: t('other_declaration')
        }

        return {
            title: `${actions[action as keyof typeof actions]} ${isMedical ? t('medical_ins') : t('social_ins')}`,
            insType: type,
            actionType: action
        }
    }

    const config = getInfoPage();

    return (
        <div>
            
        </div>
    )
}