"use client"

import Loading from "@/components/Loading";
import { callApi } from "@/services/callApi";
import { faEye, faEyeSlash, faLock, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/lib/redux/slices/userSlice";
import { login } from "@/services/userService";

export default function Login() {
    const t = useTranslations();
    const router = useRouter();
    const locale = useLocale();
    const dispatch = useDispatch();
    const [isHidePwd, setIsHidePwd] = useState(true);
    const [isLoading, setIsloading] = useState(false);
    const [formLogin, setFormLogin] = useState({
        account: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        missingAccount: false,
        missingPassword: false
    })

    const handleValueChange = (nameField: string, value: any) => {
        let emptValue = value == "";
        setFormLogin(prev => ({
            ...prev, 
            [nameField]: value
        }))

        setErrors(prev => ({
            ...prev,
            [`missing${nameField.charAt(0).toUpperCase() + nameField.slice(1)}`]: emptValue
        }))
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const checkError = {
            missingAccount: !formLogin.account,
            missingPassword: !formLogin.password
        }
        setErrors(checkError);
        if (checkError.missingAccount || checkError.missingPassword){
            toast.error(t('missing_info_login'))
            return;
        };

        try {
            setIsloading(true);
            const data = {
                username: formLogin.account,
                password: formLogin.password
            }
            const resp = await login(data);
            if (resp && resp.success) {
                Cookies.set("userRole", resp.data.role, { path: '/' });
                Cookies.set("accessToken", resp.data.access_token, {
                    path: '/',
                    expires: resp.data.expires_in / 86400
                });
                router.push(`/${locale || 'vi'}/dashboard`);
            }
        } catch(err: any) {
            console.log("Login Error:", err.message);
            toast.error(t('err_login'))
        } finally {
            setIsloading(false);
        }
    }

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div className="flex flex-col gap-4 md:w-1/5 w-[80%]">
                <img src="https://galaxypay.vn/wp-content/uploads/2023/09/Group-1024x296.png" />
                <p className="text-2xl text-[var(--global-main-color)] uppercase">{t('login')}</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className={`flex items-center p-1 border-[2px] ${errors.missingAccount ? 'border-red-500' : 'border-gray-300'} outline-none`}>
                        <FontAwesomeIcon icon={faUser} className="px-1"/>
                        <input 
                            className="w-full outline-none"
                            value={formLogin.account}
                            onChange={(e) => handleValueChange('account', e.target.value)}
                        />
                    </div>
                     <div className={`flex items-center p-1 border-[2px] ${errors.missingPassword ? 'border-red-500' : 'border-gray-300'} outline-none`}>
                        <FontAwesomeIcon icon={faLock} className="px-1 "/>
                        <input 
                            className="w-full outline-none"
                            type={isHidePwd ? "password" : "text"}
                            value={formLogin.password}
                            onChange={(e) => handleValueChange('password', e.target.value)}
                        />
                        <FontAwesomeIcon 
                            icon={isHidePwd ? faEye : faEyeSlash}
                            className="cursor-pointer px-2"
                            onClick={() => setIsHidePwd(!isHidePwd)}
                        />
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <button
                            type="submit"
                            className="md:w-2/3 w-full bg-[var(--global-main-color)] hover:bg-[var(--global-hover-color)] py-1 text-white cursor-pointer"
                        >
                            {t('login')}
                        </button>
                    </div>
                </form>
            </div>
            <Loading stateShow={isLoading}/>
        </div>
    )
}
