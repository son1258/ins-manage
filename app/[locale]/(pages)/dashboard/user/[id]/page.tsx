"use client"

import { useEffect, useRef, useState } from 'react';
import InputGroup from '@/components/InputGroup';
import CustomSelect from '@/components/CustomSelect';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setActiveTitle } from '@/lib/redux/slices/menuSlice';
import Cookies from 'js-cookie';
import { ROLE_CODE, STATUS } from '@/constants';
import { handleApiError } from '@/utils/errorHandler';
import Loading from '@/components/Loading';
import DatePickerCustom from '@/components/DatePicker';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUser } from '@fortawesome/free-solid-svg-icons';
import { useUpdateUserMutation, useUserDetail } from '@/hooks/useUser';
import { useCollectorList } from '@/hooks/useCollector';
import { updateAvatar } from '@/services/userService';
import { useQueryClient } from '@tanstack/react-query';

export default function EditCollector() {
    const t = useTranslations();
    const queryClient = useQueryClient();
    const params: any = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const acceptedBirthday = dayjs().subtract(18, 'year').format("YYYY-MM-DD");
    const accessToken = Cookies.get('accessToken') || "";
    const role = Cookies.get('userRole');
    const [isMounted, setIsMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const listStatus = [
        { code: STATUS.ACTIVE, name: t('active') },
        { code: STATUS.DEACTIVE, name: t('deactive') },
    ];

    const roles = [
        { label: t('admin_role'), value: ROLE_CODE.ADMIN, name: "admin" },
        { label: t('user_role'), value: ROLE_CODE.USER, name: "user" },
    ]

    const [formData, setFormData] = useState<any>({
        userId: "",
        fullname: "",
        phone: "",
        nic: "",
        address: "",
        email: "",
        birthday: acceptedBirthday,
        username: "",
        role: "",
        avatar: "",
        status: "",
        distributor: {},
        collectorIds: []
    });

    const { data: userRes, isLoading: isUserLoading } = useUserDetail(params.id, accessToken)
    const { data: collectorsRes, isLoading: isCollectorsLoading }: any = useCollectorList(
        { status: STATUS.ACTIVE, distributorId: formData.distributor.id },
        accessToken,
        { enabled: !!accessToken && !!formData.distributor.id }
    )
    const updateUser = useUpdateUserMutation(accessToken)
    const userDetail = userRes?.data;
    const handleValueChange = (nameField: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [nameField]: value
        }));
    }

    const standardCollectors = collectorsRes?.data?.map((item: any) => ({
        label: item.name,
        value: item.id
    }))

    const checkAge = (date: any) => {
        const maxDate = dayjs().subtract(18, 'year').format("YYYY-MM-DD");
        return date > maxDate;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errDate = checkAge(formData.birthday);
        if (errDate) {
            toast.error(t('err_birthday'));
            return;
        }
        updateUser.mutate(
            {
                id: formData.userId,
                fullname: formData.fullname,
                role_id: formData.role,
                phone: formData.phone,
                nic: formData.nic,
                address: formData.address,
                email: formData.email,
                birthday: formData.birthday,
                status: formData.status,
                collector_ids: formData.collectorIds
            },
            {
                onSuccess: () => {
                    toast.success(t('success'));
                    router.back();
                },
                onError: (err: any) => {
                    handleApiError(err, t)
                }
            }
        )
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !accessToken) return;
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev: any) => ({ ...prev, avatar: previewUrl }));
        try {
            setIsUploading(true);
            const formDataSubmit = new FormData();
            formDataSubmit.append('file', file);
            formDataSubmit.append('user_id', formData.userId)
            const resp = await updateAvatar(formDataSubmit, accessToken);
            if (resp && resp.success) {
                toast.success(t('success'))
            }
        } catch (err) {
            handleApiError(err, t);
        } finally {
            setIsUploading(false);
            e.target.value = '';
            queryClient.invalidateQueries({ queryKey: ['user-detail', params.id]})
        }
    }

    const getValueRoleByName = (role: string) => {
        switch (role) {
            case "admin":
                return ROLE_CODE.ADMIN;
            case "user":
                return ROLE_CODE.USER;
            default:
                break;
        }
    }

    const checkStatusCollectors = (listCollectors: any) => {
        if (!listCollectors) return;
        const collectorIds = listCollectors.filter(
            (collector: any) => collector.status === STATUS.ACTIVE
        ).map((collector: any) => collector.id)
        return collectorIds;
    };

    useEffect(() => {
        if (userDetail) {
            setFormData({
                userId: userDetail.id,
                fullname: userDetail.fullname || "",
                phone: userDetail.phone || "",
                nic: userDetail.nic || "",
                address: userDetail.address || "",
                email: userDetail.email || "",
                birthday: userDetail.birthday || "",
                status: userDetail.status,
                username: userDetail.username || "",
                role: getValueRoleByName(userDetail.role),
                avatar: userDetail.avatar || "",
                distributor: userDetail.distributor || {},
                collectorIds: checkStatusCollectors(userDetail.collectors) || []
            })
        }
    }, [userDetail])

    useEffect(() => {
        setIsMounted(true);
        dispatch(setActiveTitle(t('update_user')));
    }, [t])

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            <div className="max-w-[90%] mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{t('info_user')}</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-8">
                            <div className="flex flex-col items-center mb-10">
                                <div className="relative group">
                                    <div className="relative w-32 h-32 group cursor-pointer" onClick={handleAvatarClick}>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />

                                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center ring-1 ring-gray-200">
                                            {formData?.avatar ? (
                                                <img
                                                    src={formData.avatar}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-gray-400 flex flex-col items-center">
                                                    <FontAwesomeIcon icon={faUser} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {isUploading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm font-medium text-gray-500">{t('avatar')}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-1.5 md:col-span-1">
                                        <InputGroup
                                            label={t('distributor')}
                                            value={formData.distributor.name}
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5 md:col-span-3">
                                        <label className="text-sm font-semibold text-gray-700 mb-1">
                                            <span className="text-red-500 mr-1">*</span>{t('collector')}
                                        </label>
                                        <CustomSelect
                                            mode="multiple"
                                            placeholder={t('select_option')}
                                            value={formData.collectorIds}
                                            onChange={(val) => handleValueChange("collectorIds", val)}
                                            options={standardCollectors || []}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputGroup
                                        label={t('fullname')}
                                        value={formData.fullname}
                                        onChange={(e) => handleValueChange("fullname", e.target.value)}
                                        required
                                    />
                                    <InputGroup
                                        label={t('nic')}
                                        value={formData.nic}
                                        onChange={(e) => handleValueChange("nic", e.target.value)}
                                    />
                                    <DatePickerCustom
                                        label={t('birthday')}
                                        value={formData.birthday}
                                        onChange={(value) => handleValueChange("birthday", value)}
                                        format="DD-MM-YYYY"
                                        placeholder="DD-MM-YYYY"
                                    />
                                    <InputGroup
                                        label={'Email'}
                                        value={formData.email}
                                        onChange={(e) => handleValueChange("email", e.target.value)}
                                    />
                                    <InputGroup
                                        label={t('phone')}
                                        value={formData.phone}
                                        onChange={(e) => handleValueChange("phone", e.target.value)}
                                    />
                                    <InputGroup
                                        label={t('address')}
                                        value={formData.address}
                                        onChange={(e) => handleValueChange("address", e.target.value)}
                                    />
                                    {isMounted && role === 'admin' && (
                                        <>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm text-gray-700 mb-1">{t('status')}</label>
                                                <CustomSelect
                                                    placeholder={t('select_option')}
                                                    value={formData.status}
                                                    onChange={(value) => handleValueChange("status", value)}
                                                    options={listStatus.map((status: any) => ({
                                                        value: status.code,
                                                        label: status.name,
                                                    }))}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm text-gray-700 mb-1">{t('role')}</label>
                                                <CustomSelect
                                                    placeholder={t('select_option')}
                                                    value={formData.role}
                                                    onChange={(value) => handleValueChange("role", value)}
                                                    options={roles.map((role: any) => ({
                                                        value: role.value,
                                                        label: role.label,
                                                    }))}
                                                    disabled={getValueRoleByName(userDetail?.role) === ROLE_CODE.ADMIN}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                                    {t('save')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Loading stateShow={isUserLoading || isCollectorsLoading || updateUser.isPending} />
        </div>
    );
}