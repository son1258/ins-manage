"use client";

import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Navbar = () => {
    const t = useTranslations();
    const router = useRouter();
    const locale = useLocale();
    const activeTitle = useSelector((state: RootState) => state.menu.activeTitle);
    const [username, setUsername] = useState("");

    useEffect(() => {
        setUsername(Cookies.get('username') || "");
    },[])

    return (
        <nav className="hidden md:flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm font-sans sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <span className="text-[16px] font-semibold text-gray-800">{activeTitle}</span>
            </div>

            <div className="flex items-center gap-5">
                <LanguageSwitcher />
                <div
                    className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-all border-l pl-4 border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-700 uppercase whitespace-nowrap">{username}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;