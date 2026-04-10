"use client";

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function LanguageSwitcher() {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();    
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const languages = [
        { code: 'vi', name: t('name_vi'), flag: '/vietnamese.svg' },
        { code: 'en', name: t('name_en'), flag: '/english.svg' }
    ];

    const currentLang = languages.find(lang => lang.code === locale) || languages[0];

    const changeLanguage = (newLocale: string) => {
        if (newLocale === locale) return;
        const segments = pathname.split('/');
        segments[1] = newLocale;
        const newPath = segments.join('/') || '/';
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className="relative border-l pl-4 border-gray-200" ref={dropdownRef}>
            <button
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-6 h-4 relative overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                    <img 
                        src={currentLang.flag} 
                        alt={currentLang.name} 
                        style={{ width: '24px', height: '16px', objectFit: 'contain' }} 
                    />
                </div>
                
                <span className="text-[14px] text-gray-600 group-hover:text-blue-600 transition-colors">
                    {currentLang.name}
                </span>
                
                <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-[10px] text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            {isOpen && (
                <ul className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
                    {languages.map(lang => (
                        <li
                            key={lang.code}
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => changeLanguage(lang.code)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-3.5 relative border border-gray-100">
                                    <Image 
                                        src={lang.flag} 
                                        alt={lang.name} 
                                        fill 
                                        className='object-cover'
                                        unoptimized
                                    />
                                </div>
                                <span className={locale === lang.code ? 'font-bold text-blue-600' : 'text-gray-700'}>
                                    {lang.name}
                                </span>
                            </div>
                            {locale === lang.code && <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-[10px]" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}