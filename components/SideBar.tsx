"use client"

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faChevronRight, faChevronLeft, faChevronDown, faLayerGroup,
    faSyncAlt, faPlusCircle, faUserShield, faHeartbeat, faIdCard,
    faFileInvoice, faShoppingCart, faChartLine, faSearch,
    faInfoCircle, faSignOutAlt,
    faTimes,
    faBars,
    faBuilding,
    faUserTie
} from '@fortawesome/free-solid-svg-icons'
import { useLocale, useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SubMenuItem {
    label: string;
    path: string;
}

interface MenuItem {
    icon: any;
    label: string;
    link?: string;
    hasSubMenu?: boolean;
    subMenuItems?: SubMenuItem[];
}

interface MenuData {
    category: string;
    items: MenuItem[];
}

export default function SideBar() {
    const t = useTranslations();
    const locale = useLocale();
    const pathname = usePathname();
    
    const dispatch = useDispatch();
    const activeTitle = useSelector((state: RootState) => state.menu.activeTitle);

    const navData: MenuData[] = [
        {
            category: t("ctg_create_receipt").toUpperCase(),
            items: [
                { icon: faLayerGroup, label: "Đăng ký mới", hasSubMenu: true, subMenuItems: [{label: 'Sub Item 1', path: "a"}, {label: 'Sub Item 2', path: ""}] },
                { icon: faSyncAlt, label: "Thu nối tiếp / t...", hasSubMenu: true },                
                { icon: faPlusCircle, label: "Tờ khai khác", hasSubMenu: true },
            ]
        },
        {
            category: t("ctg_manager").toUpperCase(),
            items: [
                { icon: faUserShield, label: t('social_ins'), link: "social" },
                { icon: faHeartbeat, label: t('medical_ins'), link: "medical"},
                { icon: faIdCard, label: t('other_declaration'), link: "orther-declaration" },
                { icon: faFileInvoice, label: t('e_receipt'), link: "e-receipt" },
                { icon: faBuilding, label: t('unit_payment'), link: "unit" },
                { icon: faUserTie, label: t('collector'), link: "collector" },
            ]
        },
        {
            category: t("ctg_finace").toUpperCase(),
            items: [
                { icon: faShoppingCart, label: t('payment_request'), link: "payment" },
            ]
        },
        {
            category: t("ctg_report").toUpperCase(),
            items: [
                { icon: faChartLine, label: t('list_declaration'), link: "list-declaration" },
            ]
        },
        {
            category: t("ctg_util").toUpperCase(),
            items: [
                { icon: faSearch, label: t('find'), link: "search"},
                { icon: faInfoCircle, label: t('instruct'), link: "instructions" },
            ]
        },
    ];

    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setActiveTitle("Bảo hiểm y tế"));
    }, [dispatch]);

    const toggleSubMenu = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenSubMenuIndex(prev => prev === key ? null : key);
    };

    const handleLogout = () => {
        Cookies.remove("accessToken", { path: '/' });
        window.location.href = `/${locale}/login`;
    };

    const handleItemClick = (item: any, gIdx: number, iIdx: number) => {
        dispatch(setActiveTitle(item.label));
        if (item.hasSubMenu) {
            toggleSubMenu(gIdx, iIdx);
        } else {
            setIsMobileOpen(false);
        }
    };

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#1e3a5f] text-white z-[60] flex items-center px-4 shadow-md">
                <button 
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 bg-[#1e3a5f] text-white rounded shadow-lg"
                >
                    <FontAwesomeIcon icon={isMobileOpen ? faTimes : faBars} />
                </button>
            </div>

            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1e3a5f] text-white transition-all duration-300 shadow-xl
                ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'} 
                md:relative md:translate-x-0 ${isExpanded ? 'md:w-56' : 'md:w-16'}
            `}>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="h-14 hidden md:flex items-center justify-center border-b border-white/5 hover:bg-white/10"
                >
                    <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} size="lg"/>
                </button>

                <div className="h-14 flex md:hidden items-center justify-between px-6 border-b border-white/5 bg-[#162a45]">
                    <span className="font-bold text-sm tracking-widest uppercase">Menu</span>
                    <button onClick={() => setIsMobileOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                    {navData.map((group, gIdx) => (
                        <div key={gIdx} className={`${isExpanded ? 'mb-6' : 'mb-2' }`}>
                            <div className={`px-7 mb-2 text-xs font-bold text-white/50 uppercase tracking-wider transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                                {isExpanded ? group.category : "..."}
                            </div>

                            {group.items.map((item, iIdx) => {
                                const isSubOpen = openSubMenuIndex === `${gIdx}-${iIdx}`;
                                const fullHref = item.link ? `/${locale}/dashboard/${item.link}` : '#';
                                const isActive = pathname.includes(fullHref) && fullHref !== '#';

                                return (
                                    <div key={iIdx}>
                                        <Link 
                                            href={fullHref}
                                            onClick={() => handleItemClick(item, gIdx, iIdx)}
                                            className={`w-full flex items-center px-7 py-3.5 relative transition-colors
                                                ${isActive ? 'bg-[#f37021] text-white' : 'hover:bg-white/10 text-white/70'} 
                                                ${(!isExpanded && !isMobileOpen) && 'justify-center'}`}
                                        >
                                            <div className="w-5 flex justify-center text-lg">
                                                <FontAwesomeIcon icon={item.icon} />
                                            </div>
                                            <span className={`ml-4 text-sm font-medium transition-all ${(isExpanded || isMobileOpen) ? 'opacity-100' : 'opacity-0 absolute'}`}>
                                                {item.label}
                                            </span>
                                            {item.hasSubMenu && (isExpanded || isMobileOpen) && (
                                                <FontAwesomeIcon icon={faChevronDown} className={`absolute right-4 text-[10px] transition-transform ${isSubOpen ? 'rotate-180' : ''}`} />
                                            )}
                                        </Link>

                                        {item.hasSubMenu && item.subMenuItems && isSubOpen && (isExpanded || isMobileOpen) && (
                                            <div className="bg-[#182f4d] py-1 border-l-2 border-[#f37021]/30 ml-4">
                                                {item.subMenuItems.map((sub, sIdx) => (
                                                    <Link
                                                        key={sIdx}
                                                        href={`/${locale}/dashboard/${sub.path}`}
                                                        onClick={() => {
                                                            dispatch(setActiveTitle(sub.label));
                                                            setIsMobileOpen(false);
                                                        }}
                                                        className="w-full flex items-center pl-10 pr-6 py-3 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-all"
                                                    >
                                                        <div className="w-4 flex justify-center mr-3 opacity-40 text-[10px]">
                                                            <FontAwesomeIcon icon={item.icon} />
                                                        </div>
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>

                <div className="p-2 border-t border-white/10">
                    <button onClick={handleLogout} 
                        className="w-full flex items-center px-7 py-4 hover:bg-red-500/20 text-white/70 rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span className={`ml-4 text-sm ${(isExpanded || isMobileOpen) ? 'block' : 'hidden'}`}>{t('logout')}</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
