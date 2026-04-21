"use client"

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faChevronRight, faChevronLeft, faChevronDown, faShoppingCart, faChartLine,
    faSignOutAlt,
    faTimes,
    faBars,
    faBuilding,
    faUserTie,
    faCashRegister
} from '@fortawesome/free-solid-svg-icons'
import { useLocale, useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Roles } from '@/types/userType';

interface SubMenuItem {
    label: string;
    title: string;
    link?: string;
}

interface MenuItem {
    icon: any;
    label: string;
    link?: string;
    hasSubMenu?: boolean;
    isDropItem?: boolean;
    allowedRoles?: Roles[];
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
    const [mount, setMount] = useState(false);
    const [userRole, setUserRole] = useState('sale');
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState<string | null>(null);

    const navData: MenuData[] = [
        {
            category: t("ctg_manager").toUpperCase(),
            items: [
                { icon: faBuilding, label: t('distributor'), link: "distributor", allowedRoles: ['admin', 'user'] },
                { icon: faCashRegister, label: t('collection'), link: "collection", allowedRoles: ['admin', 'user'] },
            ]
        },
        {
            category: t("ctg_finace").toUpperCase(),
            items: [
                { icon: faShoppingCart, label: t('payment_request'), link: "payment", allowedRoles: ['admin', 'user'] },
            ]
        },
        {
            category: t("ctg_report").toUpperCase(),
            items: [
                { icon: faChartLine, label: t('list_declaration'), link: "list-declaration", allowedRoles: ['admin', 'user'] },
            ]
        },
    ];

    useEffect(() => {
        setMount(true);
        const role = Cookies.get('userRole') || 'admin';
        setUserRole(role);
    },[])

    const filteredNavData = navData.map(group => ({
        ...group,
        items: group.items.filter(item => {
            if (!item.allowedRoles) return true;
            return item.allowedRoles.includes(userRole as any);
        })
    })).filter(group => group.items.length > 0);

    if (!mount) return <div className="w-56 bg-[var(--global-main-color)] h-screen" />;

    const toggleSubMenu = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenSubMenuIndex(prev => prev === key ? null : key);
    };

    const handleLogout = () => {
        Cookies.remove("accessToken", { path: '/' });
        Cookies.remove("userRole", { path: '/'});
        window.location.href = `/${locale}/login`;
    };

    const handleItemClick = (item: any, gIdx: number, iIdx: number) => {
        if (!item.isDropItem) {
            dispatch(setActiveTitle(item.label));
        }
        if (item.hasSubMenu) {
            toggleSubMenu(gIdx, iIdx);
        } else {
            setIsMobileOpen(false);
        }
    };

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#926BFF] text-white z-[60] flex items-center px-4 shadow-md">
                <button 
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 bg-white text-[var(--global-main-color)] rounded shadow-lg"
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
                fixed inset-y-0 left-0 z-50 flex flex-col bg-[var(--global-main-color)] text-white transition-all duration-300 shadow-xl
                ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'} 
                md:relative md:translate-x-0 ${isExpanded ? 'md:w-56' : 'md:w-16'}
            `}>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="h-14 hidden md:flex items-center justify-center border-b border-white"
                >
                    <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} size="lg"/>
                </button>

                <div className="h-14 flex md:hidden items-center justify-between px-6 border-b border-white">
                    <span className="font-bold text-sm tracking-widest uppercase">Menu</span>
                    <button onClick={() => setIsMobileOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                    {filteredNavData.map((group, gIdx) => (
                        <div key={gIdx} className={`${isExpanded ? 'mb-6' : 'mb-2' }`}>
                            <div className={`px-7 mb-2 text-xs font-bold text-white uppercase tracking-wider transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                                {isExpanded ? group.category : "..."}
                            </div>

                            {group.items.map((item, iIdx) => {
                                const isSubOpen = openSubMenuIndex === `${gIdx}-${iIdx}`;
                                const fullHref = item.link ? `/${locale}/dashboard/${item.link}` : '#';
                                const isActive = pathname == fullHref;

                                return (
                                    <div key={iIdx}>
                                        <Link 
                                            href={fullHref}
                                            onClick={() => handleItemClick(item, gIdx, iIdx)}
                                            className={`w-full flex items-center px-7 py-3.5 relative transition-colors
                                                ${isActive ? 'bg-white text-[var(--global-main-color)]' : 'bg-[var(--global-main-color)] hover:bg-white/70 hover:text-[var(--global-main-color)]'} 
                                                ${(!isExpanded && !isMobileOpen) && 'justify-center'}`}
                                        >
                                            <div className={`w-5 ${isActive ? 'text-[var(--global-main-color)]' : 'hover:text-[var(--global-main-color)]'} flex justify-center text-lg`}>
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
                                            <div className="py-1 ml-4 bg-black/10">
                                                {item.subMenuItems.map((sub, sIdx) => {
                                                    const subHref = `/${locale}/dashboard/${sub.link}`;
                                                    const isSubActive = pathname === subHref;

                                                    return (
                                                        <Link
                                                            key={sIdx}
                                                            href={subHref}
                                                            onClick={() => {
                                                                dispatch(setActiveTitle(sub.label));
                                                                setIsMobileOpen(false);
                                                            }}
                                                            className={`w-full flex items-center pl-10 pr-6 py-3 text-[13px] transition-all
                                                                ${isSubActive ? 'text-[var(--global-main-color)] bg-white' : 'text-white hover:text-[var(--global-main-color)] hover:bg-white/70'}`}
                                                        >
                                                            <div className="w-4 flex justify-center mr-3 opacity-40 text-[10px]">
                                                                <FontAwesomeIcon icon={item.icon} />
                                                            </div>
                                                            {sub.label}
                                                        </Link>
                                                    );
                                                })}
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
                        className="w-full flex items-center px-7 py-4 hover:bg-white/70 hover:text-[var(--global-main-color)] text-white rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span className={`ml-4 text-sm ${(isExpanded || isMobileOpen) ? 'block' : 'hidden'}`}>{t('logout')}</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
