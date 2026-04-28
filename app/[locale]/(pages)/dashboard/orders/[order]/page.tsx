    "use client"

    import FormSection from "@/components/FormSection";
    import InputGroup from "@/components/InputGroup";
    import { useTranslations } from "next-intl";
    import { useEffect, useState } from "react";
    import Cookies from 'js-cookie';
    import { useParams } from "next/navigation";
    import { useDispatch } from "react-redux";
    import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
    import { handleApiError } from "@/utils/errorHandler";
    import { BIRTHDAY_VALUE, GENDER, NATIONAL, PLANS, SERVICE_CODE } from "@/constants";
    import { calculateEndDate, formatVND } from "@/utils/common";
    import DatePickerCustom from "@/components/DatePicker";
    import Loading from "@/components/Loading";
    import dayjs from "dayjs";
    import { loadEthinicities, loadProvinces } from "@/services/commonService";
import { loadOrders } from "@/services/orderService";

    export default function OrderDetail() {
        const t = useTranslations();
        const params: any = useParams();
        const dispatch = useDispatch();
        const [isLoading, setIsLoading] = useState(false);
        const accessToken = Cookies.get('accessToken');
        const [isBHXH, setIsBHXH] = useState(false);
        const [provinces, setProvinces] = useState<any>(null);
        const [ethinicities, setEthinicities] = useState<any>(null);
        const [family, setFamily] = useState<any>(null);

        const [formData, setFormData] = useState<any>({
            socialCode: "",
            fullname: "",
            birthday: "",
            hasCard: 0,
            nic: "",
            ethnicity: "",
            gender: "",
            nationality: "",
            phoneNumber: "",
            placeOfBirthRegistration: "",
            address: "",
            provider: {},
            distributor: {},
            collector: "",
            city: "",
            hospital: "",
            plan: "",
            method: "",
            note: "",
            fromMonth: "",
            month: "",
            receiptNumber: "",
            receiptDate: "",
            oldCardStartDate: "",
            oldCardEndDate: "",
            newCardStartDate: "",
            newCardEndDate: "",
            householdContributionRate: "",
            localGovSpRate: "",
            localGovSpAmount: "",
            stateSupportRate: "",
            stateSupportAmount: "",
            socialInsAmount: "",
            contributionAmount: "",
            householdCode: "",
            departmentCode: "",
            healthInsBenefitLevel: ""
        })

        const getNameProvince = (provinceCode: string) => {
            const result = provinces.find((province: any) => province.code == provinceCode);
            return result ? result.name : '';
        }

        const getNameEthinicity = (ethinicityCode: string) => {
            const result = ethinicities.find((ethinicity: any) => ethinicity.code == ethinicityCode);
            return result ? result.name : '';
        }

        const updateDataOrder = (dataOrder: any, isBHXH: boolean) => {
            const getDataOrder = {
                socialCode: dataOrder.ld_maso_bhxh,
                fullname: dataOrder.data.tk1_ts.noi_dung[0].ho_ten,
                birthday: dataOrder.data.tk1_ts.noi_dung[0].ngay_sinh,
                hasCard: isBHXH ? "" : (dataOrder.data.tk1_ts.noi_dung[0].maso_bhxh ? true : false),
                nic: dataOrder.data.tk1_ts.noi_dung[0].cmnd,
                ethnicity: getNameEthinicity(dataOrder.data.tk1_ts.noi_dung[0].dan_toc),
                gender: dataOrder.data.tk1_ts.noi_dung[0].gioi_tinh,
                nationality: dataOrder.data.tk1_ts.noi_dung[0].quoc_tich,
                phoneNumber: dataOrder.data.tk1_ts.noi_dung[0].dienthoai_lh,
                placeOfBirthRegistration: getNameProvince(dataOrder.data.tk1_ts.noi_dung[0].matinh_ks),
                address: dataOrder.data.tk1_ts.noi_dung[0].diachi_ks,
                provider: dataOrder.user.provider,
                note: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].ghichu : "",
                distributor: dataOrder.user.distributor,
                collector: isBHXH ? "" : dataOrder.collector.name,
                city: getNameProvince(dataOrder.data.tk1_ts.noi_dung[0].matinh_ks),
                hospital: isBHXH ? "" : dataOrder.data.tk1_ts.noi_dung[0].ma_benh_vien,
                plan: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].pa : dataOrder.data.d03_ts.noi_dung[0].pa,
                fromMonth: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].tuthang : "",
                month: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].sothang : dataOrder.data.d03_ts.noi_dung[0].so_thang,
                receiptNumber: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].so_bien_lai : dataOrder.data.d03_ts.noi_dung[0].so_bien_lai,
                receiptDate: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].ngay_bien_lai : dataOrder.data.d03_ts.noi_dung[0].ngay_bien_lai,
                oldCardStartDate: "",
                oldCardEndDate: "",
                newCardStartDate: isBHXH ? "" : dataOrder.data.d03_ts.noi_dung[0].tu_ngay,
                newCardEndDate: isBHXH ? "" : calculateEndDate(dataOrder.data.d03_ts.noi_dung[0].tu_ngay, dataOrder.data.d03_ts.noi_dung[0].so_thang, 'month'),
                householdContributionRate: isBHXH ? "" : dataOrder.data.tk1_ts.noi_dung[0].mucdong,
                localGovSpRate: "",
                localGovSpAmount: "",
                stateSupportRate: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].tyle_nsnn : "",
                stateSupportAmount: isBHXH ? "" : "",
                socialInsAmount: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].muc_tien : 0,
                contributionAmount: isBHXH ? dataOrder.data.d05_ts.noi_dung[0].tongtien : dataOrder.amount,
                householdCode: dataOrder.data.tk1_ts.noi_dung[0].maho_giadinh,
                departmentCode: isBHXH ? "" : dataOrder.data.d03_ts.noi_dung[0].ma_phong_ban,
                healthInsBenefitLevel: isBHXH ? "" : dataOrder.data.d03_ts.noi_dung[0].muc_huong
            }
            setFamily(dataOrder.data.tk1_ts.noi_dung[0].ho_gia_dinh.thanh_vien);
            console.log(getDataOrder)
            setFormData(getDataOrder);
        }

        const getOrderDetail = async (orderNumber: string) => {
            if (!accessToken) return;
            try {
                setIsLoading(true);
                const data = {
                    orderNumber: orderNumber
                }
                const resp = await loadOrders(data, accessToken);
                if (resp && resp.success) {
                    const dataResp = resp.data[0];
                    const typeServiceBHXH = dataResp.service_code == SERVICE_CODE.BHXH;
                    setIsBHXH(typeServiceBHXH);
                    updateDataOrder(dataResp, typeServiceBHXH);
                }
            } catch(err: any) {
                console.log('Error get order: ', err);
                handleApiError(err, t);
            } finally {
                setIsLoading(false);
            }
        }

        const getProvinces = async () => {
            if (!accessToken) return;
            try {
                setIsLoading(true);
                const resp = await loadProvinces(accessToken);
                if (resp && resp.success) {
                    setProvinces(resp.data);
                }
            } catch(err: any) {
                console.log('Error get provinces: ', err);
                handleApiError(err, t);
            } finally {
                setIsLoading(false);
            }
        }

        const getEthinicities = async () => {
            if (!accessToken) return;
            try {
                setIsLoading(true);
                const resp = await loadEthinicities(accessToken);
                if (resp && resp.success) {
                    setEthinicities(resp.data);
                }
            } catch(err: any) {
                console.log('Error get ethinicities: ', err);
                handleApiError(err, t);
            } finally {
                setIsLoading(false);
            }
        }

        const calculateMonth = (date: any, range: number) => {
            const result = dayjs(date, "MM/YYYY").add(Number(range), 'month');
            return dayjs(result, "MM/YYY");
        }
 
        const handleValueChange = (nameField: string, value: any) => {
            setFormData((prev: any) => ({
                ...prev,
                [nameField]: value
            }));
        };

        useEffect(() => {
            dispatch(setActiveTitle(t('order_detail')));
            const initData = async () => {
                await getProvinces();
                await getEthinicities();
            }

            initData();
        },[])

        useEffect(() => {
            if (!provinces || !ethinicities) return;
            getOrderDetail(params.order);
        },[provinces, ethinicities, params.order])
        

        return (
            <div className="min-h-screen font-sans text-gray-800 flex flex-col gap-4 ">
                <div className="w-full bg-white p-6 rounded shadow-sm border border-gray-200">
                    <FormSection title={t('info_customer')}>
                        <div className="col-span-full">
                            <p className="text-xs font-medium mb-2 block italic text-gray-600"><span className="text-red-500">*</span> {`${t('type_ins')}: ${isBHXH ? t('social_ins') : t('family_health_ins')}`}</p>
                        </div>
                        <div className="col-span-2 md:col-span-full bg-blue-50 p-4 rounded-md mb-4 w-full">
                            <h3 className="mb-4">{t('check_medical_code')}</h3>
                            <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4">
                                <InputGroup 
                                    label={t('social_code')} 
                                    value={formData.socialCode}
                                    onChange={(e) => handleValueChange("socialCode", e.target.value)}
                                    readOnly
                                />
                                <InputGroup 
                                    label={t('participant_name')} 
                                    value={formData.fullname}
                                    readOnly
                                />
                                <DatePickerCustom 
                                    label={t('birthday')}
                                    value={dayjs(formData.birthday, "DD/MM/YYYY")}
                                    format={'DD/MM/YYYY'}
                                    readOnly
                                />
                            </div>
                        </div>

                        <InputGroup 
                            label={t('social_ins_book_number')}
                            value={formData.socialCode}
                            readOnly
                        />
                        {!isBHXH && (
                            <InputGroup 
                                label={t('has_card')}
                                value={formData.hasCard ? t('yes') : t('no')} 
                                readOnly
                            />
                        )}

                        <InputGroup 
                            label={t('nic')}
                            value={formData.nic} 
                            readOnly
                        />

                        <InputGroup 
                            label={t('ethnicity')}
                            value={formData.ethnicity} 
                            readOnly
                        />
                        
                        <InputGroup 
                            label={t('gender')} 
                            value={formData.gender == GENDER.MALE ? t('male') : t('female')} 
                            readOnly
                        />

                        <InputGroup 
                            label={t('nationality')}
                            value={formData.nationality == NATIONAL.VN.toUpperCase() ? t('national_vn') : t('other')}  
                            readOnly
                        />

                        <InputGroup 
                            label={t('phone_number')} 
                            value={formData.phoneNumber} 
                            readOnly
                        />

                        <div className="col-span-2">
                            <InputGroup 
                                label={t('place_of_birth_registration')}
                                value={formData.placeOfBirthRegistration} 
                                readOnly
                            />
                        </div>
                        <div className="col-span-2">
                            <InputGroup 
                                label={t('contact_address')}
                                value={formData.address} 
                                readOnly
                            />
                        </div>
                    </FormSection>

                    <FormSection title={t('social_ins_authority_info')}>
                        <div className="col-span-1">
                            <InputGroup 
                                label={t('social_ins_authority')} 
                                value={formData.provider.name}
                                readOnly 
                            />
                        </div>
                        <div className="col-span-1">
                            <InputGroup 
                                label={t('distributor')} 
                                value={formData.distributor.name} 
                                readOnly 
                            />
                        </div>
                        <div className="col-span-1">
                            <InputGroup 
                                label={t('collector_code')} 
                                value={formData.collector}
                                readOnly 
                            />
                        </div>
                    </FormSection>

                    <FormSection title={isBHXH ? t('social_ins_info') : t('health_ins_info')}>
                        {isBHXH && (
                            <InputGroup 
                                label={t('previous_register_date')} 
                                value={""} 
                                readOnly 
                            />
                        )}
                        {!isBHXH && (
                            <>
                                <InputGroup 
                                    label={t('city_for_medical_treatment')} 
                                    value={formData.city} 
                                    readOnly 
                                />
                                <InputGroup 
                                    label={t('hospital')} 
                                    value={formData.hospital} 
                                    readOnly 
                                />
                                <DatePickerCustom 
                                    label={t('old_card_start_date')}
                                    value={dayjs(formData.receiptDate, "DD/MM/YYYY")}
                                    format={'DD/MM/YYYY'}
                                    readOnly
                                />
                                <DatePickerCustom 
                                    label={t('old_card_end_date')}
                                    value={dayjs(formData.receiptDate, "DD/MM/YYYY")}
                                    format={'DD/MM/YYYY'}
                                    readOnly
                                />
                                <DatePickerCustom 
                                    label={t('five_years_date')}
                                    value={dayjs(formData.receiptDate, "DD/MM/YYYY")}
                                    format={'DD/MM/YYYY'}
                                    readOnly
                                />
                            </>
                        )}
                        <InputGroup 
                            label={t('plan')} 
                            value={formData.plan == PLANS.NEW ? t('new') : t('renewal')}
                            readOnly
                        />
                        {!isBHXH ? (
                            <>
                                <DatePickerCustom 
                                    label={t('new_card_start_date')}
                                    value={dayjs(formData.newCardStartDate, "DD/MM/YYYY")}
                                    format={'DD/MM/YYYY'}
                                    readOnly
                                />
                                <DatePickerCustom 
                                    label={t('new_card_end_date')}
                                    value={dayjs(formData.newCardEndDate, "DD/MM/YYYY")}
                                    format={'DD/MM/YYYY'}
                                    readOnly
                                />
                            </>
                        ) : (
                            <InputGroup 
                                label={t('social_method')} 
                                value={formData.method} 
                                readOnly 
                            />
                        )}
                        <InputGroup 
                            label={t('number_of_month')} 
                            value={formData.month} 
                            readOnly 
                        />
                        {isBHXH && (
                            <>
                                <DatePickerCustom
                                    picker="month" 
                                    label={t('from_month')}
                                    value={dayjs(formData.fromMonth, "MM/YYYY")}
                                    format={'MM/YYYY'}
                                    readOnly
                                />
                                <DatePickerCustom 
                                    picker="month" 
                                    label={t('to_month')}
                                    value={calculateMonth(formData.fromMonth, formData.month)}
                                    format={'MM/YYYY'}
                                    readOnly
                                />
                            </>
                        )}
                        <InputGroup 
                            label={t('receipt_number')} 
                            value={formData.receiptNumber} 
                            readOnly    
                        />
                        <DatePickerCustom 
                            label={t('receipt_date')}
                            value={dayjs(formData.receiptDate, "DD/MM/YYYY")}
                            format={'DD/MM/YYYY'}
                            readOnly
                        />
                    </FormSection>

                    <FormSection title={isBHXH ? t('social_ins_payment_info') : t('health_ins_payment_info')}>
                        {isBHXH ? (
                            <>
                                <InputGroup 
                                    label={t('social_amount_range')} 
                                    value={`22 %`}
                                    readOnly 
                                />
                                <InputGroup 
                                    label={t('total_amount')} 
                                    value={formatVND(formData.socialInsAmount)}
                                    readOnly 
                                />
                                <InputGroup 
                                    label={t('state_sp_rate')} 
                                    value={`${t('other_case')}: - ${formData.stateSupportRate}%`}
                                    readOnly 
                                />
                                <InputGroup 
                                    label={t('state_sp_amount')} 
                                    value={formData.stateSupportAmount}
                                    readOnly 
                                />
                            </>
                        ) : (
                            <InputGroup 
                                label={t('household_contribution_rate')} 
                                value={`${formData.householdContributionRate}%`}
                                readOnly 
                            />
                        )}
                        <InputGroup 
                            label={t('local_gov_sp_rate')} 
                            value={formData.localGovSpRate} 
                            readOnly
                        />
                        <InputGroup 
                            label={t('local_gov_sp_amount')} 
                            value={formData.localGovSpAmount} 
                            readOnly
                        />
                        {isBHXH && (
                            <>
                                <div className="col-span-2">
                                    <InputGroup 
                                        label={t('social_interest_money')} 
                                        value={formData.localGovSpAmount} 
                                        readOnly
                                    />
                                </div>
                                <InputGroup 
                                    label={t('balance_previous')} 
                                    value={formData.localGovSpAmount} 
                                    readOnly
                                />
                            </>
                        )}
                        <InputGroup 
                            label={t('contribution_amount')} 
                            value={formatVND(formData.contributionAmount)} 
                            readOnly 
                        />
                        {isBHXH ? (
                            <div className="col-span-2">
                                <InputGroup 
                                    label={t('note')} 
                                    value={formData.note} 
                                    readOnly 
                                />
                            </div>
                        ) : (
                            <>
                                <InputGroup 
                                    label={t('health_ins_benefit_level')} 
                                    value={formData.healthInsBenefitLevel} 
                                    readOnly
                                />
                                <InputGroup 
                                    label={t('household_code')} 
                                    value='' 
                                    readOnly
                                />
                                <InputGroup 
                                    label={t('department_code')}  
                                    value=''
                                    readOnly
                                />
                            </>
                        )}
                    </FormSection>
                </div>
                <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-blue-900 font-bold text-sm uppercase">
                        {t('household_info')}
                    </h3>
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left border-collapse min-w-[1500px]">
                    <thead>
                        <tr className="bg-[#1a4b8c] text-white text-[11px] uppercase">
                            <th className="p-2 border border-blue-800 text-center w-12 font-semibold">{t('index')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('fullname')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('social_code')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('birthday')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('year_of_birth_only')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('relationship_with_house_head')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('gender')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('place_of_birth_registration')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('nic')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('note')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('document_type')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('document_number')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('address')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('nationality')}</th>
                            <th className="p-2 border border-blue-800 font-semibold">{t('ethnicity')}</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] text-gray-700">
                        {family && family.map((member: any, index: number) => (
                            <tr key={index}
                                className="hover:bg-blue-50 border-b border-gray-200 transition-colors">
                                <td className="p-2 border-r border-gray-200 text-center">{member.stt}</td>
                                <td className="p-2 border-r border-gray-200">{member.ho_ten}</td>
                                <td className="p-2 border-r border-gray-200">{member.maso_bhxh}</td>
                                <td className="p-2 border-r border-gray-200">{member.ngay_sinh}</td>
                                <td className="p-2 border-r border-gray-200">
                                    {
                                        member.ccns == BIRTHDAY_VALUE.FULL ? t('full_birthday_date') :
                                        member.ccns == BIRTHDAY_VALUE.MONTH_AND_YEAR ? t('month_and_year') : t('only_year')
                                    }
                                </td>
                                <td className="p-2 border-r border-gray-200 text-yellow-600 font-medium">{index == 0 ? t('house_head') : t('other')}</td>
                                <td className="p-2 border-r border-gray-200">{member.gioi_tinh == GENDER.MALE ? t('male') : t('female')}</td>
                                <td className="p-2 border-r border-gray-200 max-w-[150px] truncate">{getNameProvince(member.matinh_ks)}</td>
                                <td className="p-2 border-r border-gray-200">{member.cmnd}</td>
                                <td className="p-2 border-r border-gray-200">{member.ghichu}</td>
                                <td className="p-2 border-r border-gray-200"></td>
                                <td className="p-2 border-r border-gray-200"></td>
                                <td className="p-2 border-r border-gray-200 max-w-[150px] truncate">{member.diachi_dkks}</td>
                                <td className="p-2 border-r border-gray-200">{member.quoc_tich == NATIONAL.VN.toUpperCase() ? t('national_vn') : t('other')}</td>
                                <td className="p-2 border-r border-gray-200">{getNameEthinicity(member.dan_toc)}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                <Loading stateShow={isLoading} />
            </div>
        );
    }