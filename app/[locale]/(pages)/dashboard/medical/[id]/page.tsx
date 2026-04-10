"use client"

import FormSection from "@/components/FormSection";
import InputGroup from "@/components/InputGroup";
import { faEdit, faPlus, faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function DetailMedical() {
    const t = useTranslations();
    const [isAddMember, setIsAddMember] = useState(false);

    const [formData, setFormData] = useState({
        socialCode: "",
        fullname: "",
        createDate: new Date(),
        hasCard: 0,
        nic: "",
        ethnicity: "",
        gender: "",
        nationality: "",
        phoneNumber: "",
        placeOfBirthRegistration: "",
        contactAddress: "",
        socialInsAuthority: "",
        pviUnitCode: "",
        collectionPointCode: "",
        cityForMedicalTreatment: "",
        hospital: "",
        plan: "",
        numberOfMonth: "",
        receiptNumber: "",
        receiptDate: "",
        fromDateCard: new Date(),
        toDateCard: new Date(),
        householdContributionRate: "",
        localGovSpRate: "",
        localGovSpAmount: "",
        contributionAmount: "",
        householdCode: "",
        departmentCode: "",
        healthInsBenefitLevel: ""
    })

    const listHealthIns = [
        {code: "bhythgd", name: t('family_health_ins')}
    ];

    const medialTypeChange = (item: any) => {

    }

    const handleSearchFromSocialCode = () => {

    }

    const handleValueChange = (nameField: string, value: any) => {

    }

    return (
        <div className="min-h-screen font-sans text-gray-800 flex flex-col gap-4 ">
            <div className="w-full bg-white p-6 rounded shadow-sm border border-gray-200">
                <FormSection title={t('participant_info')}>
                    <div className="col-span-full">
                        <label className="text-xs font-medium mb-2 block italic text-gray-600"><span className="text-red-500">*</span> {t('medical_type_ins')}</label>
                        <div className="flex flex-wrap gap-4">
                            {listHealthIns.map((item, index) => (
                            <label key={index} className="flex items-center text-xs text-gray-400 gap-2">
                                <input onChange={() => medialTypeChange(item)} 
                                    type="radio" name="type" disabled={index !== 0} checked={index === 0} 
                                /> {item.name}
                            </label>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-full bg-blue-50 p-4 rounded-md mb-4 w-full">
                        <h3 className="mb-4">{t('check_medical_code')}</h3>
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4">
                            <InputGroup 
                                label={t('social_code')} 
                                value={formData.socialCode} 
                            />
                            <InputGroup 
                                label={t('participant_name')} 
                                value={formData.fullname}
                                required 
                            />

                            <InputGroup label={t('create_date')} value="2026-04-09" type="date" />

                            <div className="flex items-end">
                                <button 
                                    onClick={handleSearchFromSocialCode}
                                    className="bg-blue-600 h-8 text-white px-4 rounded text-sm hover:bg-blue-700 transition">{t('search')}</button>
                            </div>
                        </div>
                    </div>

                    <InputGroup 
                        label={t('social_ins_book_number')}
                        value={formData.socialCode} 
                    />

                    <InputGroup 
                        label={t('has_card')}
                        value={formData.hasCard} 
                    />

                    <InputGroup 
                        label={t('nic')}
                        value={formData.nic} 
                        required 
                    />

                    <InputGroup 
                        label={t('ethnicity')}
                        value={formData.ethnicity} 
                    />
                    
                    <InputGroup 
                        label={t('gender')} 
                        value={formData.gender} 
                        required 
                    />

                    <InputGroup 
                        label={t('nationality')}
                        value={formData.nationality}  
                        required 
                    />
                    <InputGroup 
                        label={t('phone_number')} 
                        value={formData.phoneNumber} 
                        required 
                    />
                    <div />

                    <div className="col-span-2">
                        <InputGroup label={t('place_of_birth_registration')}  value={formData.placeOfBirthRegistration} />
                    </div>
                    <div className="col-span-2">
                        <InputGroup label={t('contact_address')} value={formData.contactAddress} />
                    </div>
                </FormSection>

                <FormSection title={t('social_ins_authority_info')}>
                    <div className="col-span-1">
                        <InputGroup label={t('social_ins_authority')} value={formData.socialInsAuthority} required />
                    </div>
                    <div className="col-span-1">
                        <InputGroup label={t('pvi_unit_code')} value={formData.pviUnitCode} required />
                    </div>
                    <div className="col-span-2">
                        <InputGroup label={t('collection_point_code')} value={formData.collectionPointCode} required />
                    </div>
                </FormSection>

                <FormSection title={t('health_ins_info')}>
                <InputGroup label={t('city_for_medical_treatment')} value={formData.cityForMedicalTreatment} required />
                <InputGroup label={t('hospital')} value={formData.hospital} required />
                <InputGroup label={t('plan')} value={formData.plan} required />
                <InputGroup label={t('number_of_month')} value={formData.numberOfMonth} required />
                
                <InputGroup label={t('receipt_number')} value="" />
                <InputGroup label={t('receipt_date')} value={formData.receiptDate} type="date" />
                <InputGroup label={t('from_date_card')} value={formData.fromDateCard} type="date" required />
                <InputGroup label={t('to_date_card')} value={formData.toDateCard} type="date" />
                </FormSection>

                <FormSection title={t('health_ins_payment_info')}>
                    <InputGroup label={t('household_contribution_rate')} value={formData.householdContributionRate} required />
                    <InputGroup label={t('local_gov_sp_rate')} value={formData.localGovSpRate} />
                    <InputGroup label={t('local_gov_sp_amount')} value={formData.localGovSpAmount} />
                    <InputGroup 
                        label={t('contribution_amount')} 
                        value={formData.contributionAmount} 
                        readOnly
                        required
                    />
                    <InputGroup label={t('household_code')} value={formData.householdCode} />
                    <InputGroup label={t('department_code')}  value={formData.departmentCode} />
                    <InputGroup label={t('health_ins_benefit_level')} value={formData.healthInsBenefitLevel} />
                </FormSection>

                <div className="mt-8 pt-4 border-t border-gray-200 flex gap-2">
                    <button className="bg-gray-100 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-200">Đính kèm</button>
                    <button className="bg-gray-100 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-200">Chụp ảnh</button>
                </div>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-blue-900 font-bold text-sm uppercase">
                {t('household_info')}
                </h3>
                <button 
                    onClick={() => setIsAddMember(true)}
                    className="bg-[#003060] text-white px-3 py-1.5 rounded flex items-center gap-2 text-xs hover:bg-blue-900 transition">
                    <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                {t('add_member')}
                </button>
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
                    <th className="p-2 border border-blue-800 text-center sticky right-0 bg-[#1a4b8c]">{t('action')}</th>
                    </tr>
                </thead>
                <tbody className="text-[12px] text-gray-700">
                    <tr className="hover:bg-blue-50 border-b border-gray-200 transition-colors">
                    <td className="p-2 border-r border-gray-200 text-center">1</td>
                    <td className="p-2 border-r border-gray-200">Nguyễn Thị Trang</td>
                    <td className="p-2 border-r border-gray-200">1921529011</td>
                    <td className="p-2 border-r border-gray-200">02/06/1992</td>
                    <td className="p-2 border-r border-gray-200 text-gray-400 italic">Ngày/Tháng/Năm</td>
                    <td className="p-2 border-r border-gray-200 text-yellow-600 font-medium">Chủ hộ</td>
                    <td className="p-2 border-r border-gray-200">Nữ</td>
                    <td className="p-2 border-r border-gray-200 max-w-[150px] truncate">Tdp Me, Đông Cao, Phổ Yên, Thái Nguyên</td>
                    <td className="p-2 border-r border-gray-200">019192012519</td>
                    <td className="p-2 border-r border-gray-200"></td>
                    <td className="p-2 border-r border-gray-200"></td>
                    <td className="p-2 border-r border-gray-200"></td>
                    <td className="p-2 border-r border-gray-200 max-w-[150px] truncate">Phường Trung Thành, Tỉnh Thái Nguyên</td>
                    <td className="p-2 border-r border-gray-200">Việt Nam</td>
                    <td className="p-2 border-r border-gray-200">Kinh</td>
                    <td className="p-2 text-center sticky right-0 bg-white shadow-[-5px_0_5px_-5px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-center gap-3 text-gray-500">
                        <button className="hover:text-blue-600 transition"><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="hover:text-red-600 transition"><FontAwesomeIcon icon={faTrashAlt} /></button>
                        </div>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            
            {isAddMember ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {t('add_new_relative')}
                        </h2>
                        <button onClick={() => setIsAddMember(false)} className="text-gray-400 hover:text-gray-600 transition">
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                        </div>

                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex gap-6 mb-6">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="radio" name="role" className="w-4 h-4 text-blue-600" />
                                <span>{t('is_house_head')}</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="radio" name="role" className="w-4 h-4 text-blue-600" defaultChecked />
                                <span>{t('not_house_head')}</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                            <InputGroup label={t('fullname')} required />
                            <div className="md:col-span-2 grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-700"><span className="text-red-500 mr-1">*</span>Ngày sinh</label>
                                <select className="border border-gray-300 rounded h-10 px-2 text-sm bg-white">
                                    <option>Ngày/Tháng/Năm</option>
                                </select>
                            </div>
                            <div className="flex items-end h-10 mt-auto">
                                <input type="date" className="w-full border border-gray-300 rounded h-10 px-2 text-sm" />
                            </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-700"><span className="text-red-500 mr-1">*</span>Mối quan hệ với chủ hộ</label>
                                <select className="border border-gray-300 rounded h-10 px-2 text-sm bg-white outline-none">
                                <option value="">Chọn</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-700"><span className="text-red-500 mr-1">*</span>Dân tộc</label>
                                <select className="border border-gray-300 rounded h-10 px-2 text-sm bg-white outline-none">
                                <option>Kinh</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-700"><span className="text-red-500 mr-1">*</span>Quốc tịch</label>
                                <select className="border border-gray-300 rounded h-10 px-2 text-sm bg-white outline-none">
                                <option>Việt Nam</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-700"><span className="text-red-500 mr-1">*</span>Giới tính</label>
                                <select className="border border-gray-300 rounded h-10 px-2 text-sm bg-white outline-none">
                                <option value="">Chọn</option>
                                </select>
                            </div>

                            {/* Ô địa chỉ có icon edit phía cuối */}
                            <div className="md:col-span-2 flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold text-gray-700"><span className="text-red-500 mr-1">*</span>Nơi cấp giấy khai sinh</label>
                            <div className="relative">
                                <input className="w-full border border-gray-300 rounded h-10 px-2 pr-10 text-sm bg-gray-50" value="Tdp Me, Đông Cao, Phổ Yên, Thái Nguyên" readOnly />
                                <FontAwesomeIcon icon={faEdit} className="absolute right-3 top-3 text-blue-500 cursor-pointer" />
                            </div>
                            </div>

                            <InputGroup label="Mã số BHXH" />
                            <InputGroup label="Số CMND/CCCD" />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-700">Loại giấy tờ</label>
                                <select className="border border-gray-300 rounded h-10 px-2 text-sm bg-white outline-none">
                                <option value="">Chọn</option>
                                </select>
                            </div>

                            <InputGroup label="Số giấy tờ" />
                            <div className="md:col-span-2 flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold text-gray-700"><span className="text-red-500 mr-1">*</span>Địa chỉ liên hệ</label>
                            <div className="relative">
                                <input className="w-full border border-gray-300 rounded h-10 px-2 pr-10 text-sm bg-gray-50" placeholder="Phường Trung Thành, Tỉnh Thái Nguyên" readOnly />
                                <FontAwesomeIcon icon={faEdit} className="absolute right-3 top-3 text-blue-500 cursor-pointer" />
                            </div>
                            </div>

                            <div className="md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold text-gray-700">Ghi chú</label>
                            <textarea className="border border-gray-300 rounded p-2 text-sm h-16 outline-none" />
                            </div>
                        </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                        <button 
                            onClick={() => setIsAddMember(false)}
                            className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-white transition"
                        >
                            Hủy
                        </button>
                        <button className="px-6 py-2 bg-[#1a4b8c] text-white rounded text-sm hover:bg-blue-900 transition font-medium">
                            Xác nhận
                        </button>
                        </div>
                    </div>
                </div>
            ) : (<></>)}
        </div>
    );
}