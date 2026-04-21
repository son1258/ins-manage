"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeadset, 
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

import LanguageSwitcher from './LanguageSwitcher';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const Navbar = () => {
    const t = useTranslations();
    const activeTitle = useSelector((state: RootState) => state.menu.activeTitle);
    const userInfo = useSelector((state: RootState) => state.user);

    return (
        <nav className="hidden md:flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm font-sans sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <span className="text-[16px] font-semibold text-gray-800">{activeTitle}</span>
            </div>

            <div className="flex items-center gap-5">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#f37021] hover:bg-orange-600 text-white rounded-md transition-all shadow-sm">
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3.5 h-3.5" />
                    <span className="font-bold uppercase text-[11px] tracking-tight whitespace-nowrap">Chuyển sang QLCĐ</span>
                </button>

                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-[14px] border-l pl-4 border-gray-200">
                    <FontAwesomeIcon icon={faHeadset} className="w-4 h-4" />
                    <span className="whitespace-nowrap">{t('support')}</span>
                </button>

                <LanguageSwitcher />

                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-all border-l pl-4 border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gray-300 border border-gray-200 overflow-hidden">
                        <div className="w-full h-full bg-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-700 uppercase whitespace-nowrap">{userInfo.username}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;