"use client";

import FormSection from "@/components/FormSection";
import InputGroup from "@/components/InputGroup";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import {
	BIRTHDAY_VALUE,
	GENDER,
	NATIONAL,
	SERVICE_CODE,
} from "@/constants";
import { formatVND } from "@/utils/common";
import DatePickerCustom from "@/components/DatePicker";
import Loading from "@/components/Loading";
import dayjs from "dayjs";
import { useEthnicityList, useProvinceList } from "@/hooks/useCommonHook";
import { useOrderDetail } from "@/hooks/useOrder";
import CustomSelect from "@/components/CustomSelect";

export default function OrderDetail() {
	const t = useTranslations();
	const params: any = useParams();
	const dispatch = useDispatch();
	const accessToken = Cookies.get("accessToken") || "";
	const [isBHXH, setIsBHXH] = useState(false);
	const [family, setFamily] = useState<any>(null);
	const genders = [
		{ label: t('male'), value: GENDER.MALE },
		{ label: t('female'), value: GENDER.FEMALE },
	]

	const countries = [
		{ label: t('national_vn'), value: NATIONAL.VN }
	]

	const [formData, setFormData] = useState<any>({
		socialCode: "",
		customerName: "",
		birthday: "",
		hasCard: "",
		nic: "",
		ethnicity: "",
		gender: "",
		nationality: "",
		phone: "",
		birthRegisterAddress: "",
		address: "",
		provider: "",
		collector: "",
		previousDate: "",
		city: "",
		hospital: "",
		plan: "",
		method: "",
		fiveYearsDate: "",
		oldCardStartDate: "",
		oldCardEndDate: "",
		startDate: "",
		endDate: "",
		month: "",
		fromMonth: "",
		toMonth: "",
		receiptNumber: "",
		receiptDate: "",
		rate: "",
		amount: "",
		totalAmount: "",
		govSupportRate: "",
		govSupportAmount: "",
		localSupportRate: "",
		localSupportAmount: "",
		interestMoney: "",
		change: "",
		note: "",
	})

	const { data: provincesRes, isLoading: isLoadProvinces, isError: errLoadProvinces } = useProvinceList(accessToken);
	const { data: ethnicitiesRes, isLoading: isLoadEthnicities, isError: errLoadEthinicities } = useEthnicityList(accessToken);
	const { data: orderDetailRes, isLoading: isLoadOrderDetail, isError: errLoadOrderDetail } = useOrderDetail(params.id, accessToken);
	const provinces = errLoadProvinces ? [] : provincesRes?.data;
	const ethnicities = errLoadEthinicities ? [] : ethnicitiesRes?.data;
	const order = errLoadOrderDetail ? [] : orderDetailRes?.data;

	const getNameProvince = (provinceCode: string) => {
		const result = provinces.find((province: any) => province.code == provinceCode);
		return result ? result.name : "";
	};

	const getNameEthnicity = (ethnicityCode: string) => {
		if (ethnicities) {
			const result = ethnicities.find((ethnicity: any) => ethnicity.code == ethnicityCode);
			return result ? result.name : "";
		}
	};

	const handleFormDataChange = (nameField: string, value: any) => {
		setFormData((prev: any) => ({
			...prev,
			[nameField]: value
		}))
	}

	const calculateMonth = (date: any, range: number) => {
		const result = dayjs(date, "MM/YYYY").add(Number(range), "month");
		return dayjs(result, "MM/YYY");
	};

	useEffect(() => {
		dispatch(setActiveTitle(t("order_detail")));
	}, [t]);

	useEffect(() => {
		if (order) {
			const isBHXH = order.service_code == SERVICE_CODE.BHXH;
			setIsBHXH(isBHXH);
			setFamily(order.data?.tk1_ts?.noi_dung[0]?.ho_gia_dinh?.thanh_vien);
			const data = {
				socialCode: order.ld_maso_bhxh,
				customerName: order.ld_name,
				birthday: order.ld_dob,
				hasCard: order.ld_maso_bhxh ? t("yes") : t("no"),
				nic: order.data.tk1_ts.noi_dung[0].cmnd,
				ethnicity: getNameEthnicity(order.data.tk1_ts.noi_dung[0].dan_toc),
				gender: order.data.tk1_ts.noi_dung[0]?.gioi_tinh == GENDER.MALE ? t("male") : t("female"),
				nationality: order.data.tk1_ts.noi_dung[0].quoc_tich == NATIONAL.VN.toUpperCase() ? t("national_vn") : t("other"),
				phone: order.ld_phone,
				birthRegisterAddress: order.data.tk1_ts.noi_dung[0].diachi_ks,
				address: "",
				provider: order.data.collector?.provider?.name,
				collector: order.data.collector?.name,
				previousDate: "",
				city: "",
				hospital: "",
				plan: order.ld_pa,
				method: "",
				fiveYearsDate: "",
				oldCardStartDate: order.old_start_date,
				oldCardEndDate: order.old_end_date,
				startDate: order.start_date,
				endDate: order.end_date,
				month: isBHXH ? order.data.d05_ts.noi_dung[0].sothang : "",
				fromMonth: isBHXH ? order.data.d05_ts.noi_dung[0].tuthang : "",
				toMonth: isBHXH ? calculateMonth(order.data.d05_ts.noi_dung[0].tuthang, order.data.d05_ts.noi_dung[0].sothang) : "",
				receiptNumber: isBHXH ? order.data.d05_ts.noi_dung[0].so_bien_lai : "",
				receiptDate: order.billing_date,
				rate: "",
				amount: order.amount,
				totalAmount: order.base_amount,
				govSupportRate: isBHXH ? order.data.d05_ts.noi_dung[0].tyle_nsnn : "",
				govSupportAmount: isBHXH ? order.data.d05_ts.noi_dung[0].tien_hotro : "",
				localSupportRate: isBHXH ? order.data.d05_ts.noi_dung[0].tyle_nsdp : "",
				localSupportAmount: isBHXH ? order.data.d05_ts.noi_dung[0].tien_nsdp : "",
				interestMoney: "",
				change: "",
				note: "",
			}
			setFormData(data)
		}
	}, [order]);

	return (
		<div className="min-h-screen font-sans text-gray-800 flex flex-col gap-4 ">
			{order && (
				<>
					<div className="w-full bg-white p-6 rounded shadow-sm border border-gray-200">
						<FormSection title={t("info_customer")}>
							<div className="col-span-full">
								<p className="text-xs font-medium mb-2 block italic text-gray-600">
									<span className="text-red-500">*</span>{" "}
									{`${t("type_ins")}: ${isBHXH ? t("social_ins") : t("family_health_ins")}`}
								</p>
							</div>
							<div className="col-span-2 md:col-span-full bg-blue-50 p-4 rounded-md mb-4 w-full">
								<h3 className="mb-4">{t("social_info")}</h3>
								<div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4">
									<InputGroup
										label={t("social_code")}
										value={formData.socialCode}
										onChange={(e) => handleFormDataChange("socialCode", e.target.value)}
									/>
									<InputGroup
										label={t("participant_name")}
										value={formData.customerName}
										onChange={(e) => handleFormDataChange("customerName", e.target.value)}
									/>
									<DatePickerCustom
										label={t("birthday")}
										value={formData.birthday}
										format={"DD/MM/YYYY"}
										onChange={(value) => handleFormDataChange("birthday", value)}
									/>
								</div>
							</div>

							<InputGroup
								label={t("social_ins_book_number")}
								value={formData.socialCode}
								onChange={(e) => handleFormDataChange("socialCode", e.target.value)}
							/>
							{!isBHXH && (
								<InputGroup
									label={t("has_card")}
									value={formData.hasCard}
									onChange={(e) => handleFormDataChange("hasCard", e.target.value)}
								/>
							)}

							<InputGroup
								label={t("nic")}
								value={formData.nic}
								onChange={(e) => handleFormDataChange("nic", e.target.value)}
							/>

							<InputGroup
								label={t("ethnicity")}
								value={formData.ethnicity}
								onChange={(e) => handleFormDataChange("ethnicity", e.target.value)}
							/>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm mb-1 font-medium text-gray-600">{t('gender')}</label>
								<CustomSelect
									placeholder={t('select_option')}
									value={formData.gender}
									onChange={(value) => handleFormDataChange("gender", value)}
									options={genders.map((gender) => ({
										value: gender.value,
										label: gender.label,
									}))}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm mb-1 font-medium text-gray-600">{t('nationality')}</label>
								<CustomSelect
									placeholder={t('select_option')}
									value={formData.nationality}
									onChange={(value) => handleFormDataChange("nationality", value)}
									options={countries.map((country) => ({
										value: country.value,
										label: country.label,
									}))}
								/>
							</div>

							<InputGroup
								label={t("phone_number")}
								value={formData.phone}
								onChange={(e) => handleFormDataChange("phone", e.target.value)}
							/>

							<div className="col-span-2">
								<InputGroup
									label={t("place_of_birth_registration")}
									value={formData.birthRegisterAddress}
									onChange={(e) => handleFormDataChange("birthRegisterAddress", e.target.value)}
								/>
							</div>
							<div className="col-span-2">
								<InputGroup
									label={t("contact_address")}
									value={formData.address}
									onChange={(e) => handleFormDataChange("address", e.target.value)}
								/>
							</div>
						</FormSection>

						<FormSection title={t("social_ins_authority_info")}>
							<div className="col-span-1">
								<InputGroup
									label={t("social_ins_authority")}
									value={formData.provider}
									readOnly
								/>
							</div>
							<div className="col-span-1">
								<InputGroup
									label={t("collector_code")}
									value={formData.provider}
									readOnly
								/>
							</div>
						</FormSection>

						<FormSection
							title={isBHXH ? t("social_ins_info") : t("health_ins_info")}
						>
							{isBHXH && (
								<InputGroup
									label={t("previous_register_date")}
									value={formData.previousDate}
									readOnly
								/>
							)}
							{!isBHXH && (
								<>
									<InputGroup
										label={t("city_for_medical_treatment")}
										value={formData.city}
										readOnly
									/>
									<InputGroup
										label={t("hospital")}
										value={formData.hospital}
										readOnly
									/>
									<DatePickerCustom
										label={t("old_card_start_date")}
										value={formData.oldCardStartDate}
										format={"DD/MM/YYYY"}
										onChange={(value) => handleFormDataChange("oldCardStartDate", value)}
									/>
									<DatePickerCustom
										label={t("old_card_end_date")}
										value={formData.oldCardEndDate}
										format={"DD/MM/YYYY"}
										onChange={(value) => handleFormDataChange("oldCardEndDate", value)}
									/>
									<DatePickerCustom
										label={t("five_years_date")}
										value={formData.fiveYearsDate}
										format={"DD/MM/YYYY"}
										readOnly
									/>
								</>
							)}
							<InputGroup
								label={t("plan")}
								value={formData.plan}
								onChange={(e) => handleFormDataChange("plan", e.target.value)}
							/>
							{!isBHXH ? (
								<>
									<DatePickerCustom
										label={t("new_card_start_date")}
										value={formData.start_date}
										format={"DD/MM/YYYY"}
										readOnly
									/>
									<DatePickerCustom
										label={t("new_card_end_date")}
										value={formData.end_date}
										format={"DD/MM/YYYY"}
										readOnly
									/>
								</>
							) : (
								<InputGroup
									label={t("social_method")}
									value={""}
									readOnly
								/>
							)}
							<InputGroup
								label={t("number_of_month")}
								value={formData.month}
								onChange={(e) => handleFormDataChange("month", e.target.value)}
							/>
							{isBHXH && (
								<>
									<DatePickerCustom
										picker="month"
										label={t("from_month")}
										value={formData.fromMonth}
										format={"MM/YYYY"}
										readOnly
									/>
									<DatePickerCustom
										picker="month"
										label={t("to_month")}
										value={formData.toMonth}
										format={"MM/YYYY"}
										readOnly
									/>
								</>
							)}
							<InputGroup
								label={t("receipt_number")}
								value={formData.receiptNumber}
								readOnly
							/>
							<DatePickerCustom
								label={t("receipt_date")}
								value={formData.receiptDate}
								format={"DD/MM/YYYY"}
								readOnly
							/>
						</FormSection>

						<FormSection
							title={
								isBHXH
									? t("social_ins_payment_info")
									: t("health_ins_payment_info")
							}
						>
							{isBHXH ? (
								<>
									<InputGroup
										label={t("social_amount_range")}
										value={`22 %`}
										readOnly
									/>
									<InputGroup
										label={t("total_amount")}
										value={formatVND(formData.totalAmount)}
										onChange={(e) => handleFormDataChange("totalAmount", e.target.value)}
									/>
									<InputGroup
										label={t("state_sp_rate")}
										value={`${t("other_case")}: - ${formData.govSupportRate}%`}
										readOnly
									/>
									<InputGroup
										label={t("state_sp_amount")}
										value={formatVND(formData.govSupportAmount)}
										readOnly
									/>
								</>
							) : (
								<InputGroup
									label={t("household_contribution_rate")}
									value={`${order.data.tk1_ts.noi_dung[0].mucdong}%`}
									readOnly
								/>
							)}
							<InputGroup
								label={t("local_gov_sp_rate")}
								value={""}
								readOnly
							/>
							<InputGroup
								label={t("local_gov_sp_amount")}
								value={""}
								readOnly
							/>
							{isBHXH && (
								<>
									<div className="col-span-2">
										<InputGroup
											label={t("social_interest_money")}
											value={""}
											readOnly
										/>
									</div>
									<InputGroup
										label={t("balance_previous")}
										value={""}
										readOnly
									/>
								</>
							)}
							<InputGroup
								label={t("contribution_amount")}
								value={formatVND(formData.amount)}
								readOnly
							/>
							{isBHXH ? (
								<div className="col-span-2">
									<InputGroup
										label={t("note")}
										value={formData.note}
										onChange={(e) => handleFormDataChange("note", e.target.value)}
									/>
								</div>
							) : (
								<>
									<InputGroup
										label={t("health_ins_benefit_level")}
										value={order?.data?.d03_ts?.noi_dung[0]?.muc_huong}
										readOnly
									/>
									<InputGroup
										label={t("household_code")}
										value=""
										readOnly
									/>
									<InputGroup
										label={t("department_code")}
										value=""
										readOnly
									/>
								</>
							)}
						</FormSection>
					</div>
					<div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
						<h3 className="text-blue-900 font-bold text-sm uppercase">
							{t("household_info")}
						</h3>
					</div>

					<div className="overflow-x-auto mb-6">
						<table className="w-full text-left border-collapse min-w-[1500px]">
							<thead>
								<tr className="bg-[#1a4b8c] text-white text-[11px] uppercase">
									<th className="p-2 border border-blue-800 text-center w-12 font-semibold">
										{t("index")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("fullname")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("social_code")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("birthday")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("year_of_birth_only")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("relationship_with_house_head")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("gender")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("place_of_birth_registration")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("nic")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("note")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("document_type")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("document_number")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("address")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("nationality")}
									</th>
									<th className="p-2 border border-blue-800 font-semibold">
										{t("ethnicity")}
									</th>
								</tr>
							</thead>
							<tbody className="text-[12px] text-gray-700">
								{family &&
									family.map((member: any, index: number) => (
										<tr
											key={index}
											className="hover:bg-blue-50 border-b border-gray-200 transition-colors"
										>
											<td className="p-2 border-r border-gray-200 text-center">
												{member.stt}
											</td>
											<td className="p-2 border-r border-gray-200">
												{member.ho_ten}
											</td>
											<td className="p-2 border-r border-gray-200">
												{member.maso_bhxh}
											</td>
											<td className="p-2 border-r border-gray-200">
												{member.ngay_sinh}
											</td>
											<td className="p-2 border-r border-gray-200">
												{member.ccns == BIRTHDAY_VALUE.FULL
													? t("full_birthday_date")
													: member.ccns == BIRTHDAY_VALUE.MONTH_AND_YEAR
														? t("month_and_year")
														: t("only_year")}
											</td>
											<td className="p-2 border-r border-gray-200 text-yellow-600 font-medium">
												{index == 0 ? t("house_head") : t("other")}
											</td>
											<td className="p-2 border-r border-gray-200">
												{member.gioi_tinh == GENDER.MALE
													? t("male")
													: t("female")}
											</td>
											<td className="p-2 border-r border-gray-200 max-w-[150px] truncate">
												{getNameProvince(member.matinh_ks)}
											</td>
											<td className="p-2 border-r border-gray-200">
												{member.cmnd}
											</td>
											<td className="p-2 border-r border-gray-200">
												{member.ghichu}
											</td>
											<td className="p-2 border-r border-gray-200"></td>
											<td className="p-2 border-r border-gray-200"></td>
											<td className="p-2 border-r border-gray-200 max-w-[150px] truncate">
												{member.diachi_dkks}
											</td>
											<td className="p-2 border-r border-gray-200">
												{member.quoc_tich == NATIONAL.VN.toUpperCase()
													? t("national_vn")
													: t("other")}
											</td>
											<td className="p-2 border-r border-gray-200">
												{getNameEthnicity(member.dan_toc)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</>
			)}
			<Loading stateShow={isLoadProvinces || isLoadEthnicities || isLoadOrderDetail} />
		</div>
	);
}
