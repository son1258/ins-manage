"use client";

import FormSection from "@/components/FormSection";
import InputGroup from "@/components/InputGroup";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setActiveTitle } from "@/lib/redux/slices/menuSlice";
import {
	BIRTHDAY_VALUE,
	DOCUMENT_TYPES,
	FAMILY_RATE,
	FAMILY_RELATIONSHIPS,
	GENDER,
	GOV_SUPPORT_AMOUNT,
	MEDICAL_INS_RATE,
	NATIONAL,
	PAYMENT_STATUS,
	PLANS,
	SERVICE_CODE,
	SOCIAL_INS_RATE,
} from "@/constants";
import { formatVND, parseVND, validateNumericField } from "@/utils/common";
import DatePickerCustom from "@/components/DatePicker";
import Loading from "@/components/Loading";
import dayjs from "dayjs";
import { useCountries, useEthnicityList, useProvinceList } from "@/hooks/useCommonHook";
import { useOrderDetail, useUpdateOrderDetail } from "@/hooks/useOrder";
import CustomSelect from "@/components/CustomSelect";
import InputWithAffix from "@/components/InputWithAffix";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import Modal from '@/components/Modal';
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/errorHandler";
import { removeImageOrder } from "@/services/orderService";
import { useQueryClient } from "@tanstack/react-query";

export default function OrderDetail() {
	const t = useTranslations();
	const params: any = useParams();
	const dispatch = useDispatch();
	const router = useRouter();
	const queryClient = useQueryClient();
	const accessToken = Cookies.get("accessToken") || "";
	const [isBHXH, setIsBHXH] = useState(false);
	const [plans, setPlans] = useState<any>();
	const [families, setFamilies] = useState<any>();
	const [modalAddMember, setModalAddMember] = useState(false);
	const [isRemoveMember, setIsRemoveMember] = useState(false);
	const [memberSelected, setMemberSelected] = useState<any>();
	const [isRemoveImg, setIsRemoveImg] = useState(false);
	const [imgSelected, setImgSelected] = useState<any>();
	const [dateType, setDateType] = useState<"date" | "month" | "year">("date");
	const [isLoadingState, startTransition] = useTransition();
	const [formErrors, setFormErrros] = useState({
		socialCode: false,
		hospital: false,
	})

	const [formAddMemberErrors, setFormAddMemberErrors] = useState({
		fullname: false,
		birthday: false,
		ethnicity: false,
		nationality: false,
		relationshipWithHouseHead: false,
		birthRegisterAddress: false,
		gender: false,
		address: false,
		socialCode: false,
	})

	const genders = [
		{ label: t('male'), value: GENDER.MALE },
		{ label: t('female'), value: GENDER.FEMALE },
	]

	const hasCards = [
		{ label: t('yes'), value: 0 },
		{ label: t('no'), value: 1 },
	]

	const oftionsDate = [
		{ value: "date", label: `${t('date')}/${t('month')}/${t('year')}` },
		{ value: "month", label: `${t('month')}/${t('year')}` },
		{ value: "year", label: `${t('year')}` },
	]

	const medicalMonths = [
		{ label: `3 ${t('month')}`, value: 3 },
		{ label: `6 ${t('month')}`, value: 6 },
		{ label: `12 ${t('month')}`, value: 12 },
	]

	const methods = [
		{ label: `1 ${t('month')}`, value: 1 },
		{ label: `3 ${t('month')}`, value: 3 },
		{ label: `6 ${t('month')}`, value: 6 },
		{ label: `12 ${t('month')}`, value: 12 },
	]

	const defaultFormAddMember = {
		fullname: "",
		birthday: "",
		relationshipWithHouseHead: "",
		ethnicity: "",
		nationality: "",
		gender: "",
		birthRegisterAddress: "",
		socialCode: "",
		nic: "",
		documentType: "",
		documentNumber: "",
		address: "",
		note: ""
	}
	const [formAddMember, setFormAddMember] = useState(defaultFormAddMember);

	const [formData, setFormData] = useState<any>({
		id: "",
		attachments: [],
		status: "",
		collectorCode: "",
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
		benefitRank: "",
		familyCode: "",
		departmentCode: "",
		totalAmount: "",
		amount: "",
		govSupportRate: "",
		govSupportAmount: "",
		localSupportRate: "",
		localSupportAmount: "",
		interestMoney: "",
		change: "",
		note: "",
		baseAmount: "",
		documentType: ""
	})
	const { data: countriesRes, isLoading: isLoadCountries, isError: errLoadCountries } = useCountries(accessToken);
	const { data: provincesRes, isLoading: isLoadProvinces, isError: errLoadProvinces } = useProvinceList(accessToken);
	const { data: ethnicitiesRes, isLoading: isLoadEthnicities, isError: errLoadEthinicities } = useEthnicityList(accessToken);
	const { data: orderDetailRes, isLoading: isLoadOrderDetail, isError: errLoadOrderDetail } = useOrderDetail(params.id, accessToken);
	const updateOrder = useUpdateOrderDetail(accessToken);
	const countries = errLoadCountries ? [] : countriesRes?.data;
	const provinces = errLoadProvinces ? [] : provincesRes?.data;
	const ethnicities = errLoadEthinicities ? [] : ethnicitiesRes?.data;
	const order = errLoadOrderDetail ? [] : orderDetailRes?.data;

	const getNameProvince = (provinceCode: string) => {
		if (provinces) {
			const result = provinces.find((province: any) => province.code == provinceCode);
			return result ? result.name : "";
		}
	};

	const getNameEthnicity = (ethnicityCode: string) => {
		if (ethnicities) {
			const result = ethnicities.find((ethnicity: any) => ethnicity.code == ethnicityCode);
			return result ? result.name : "";
		}
	};

	const getDateFormat = () => {
		if (dateType === "year") return "YYYY";
		if (dateType === "month") return "MM/YYYY";
		return "DD/MM/YYYY";
	}

	const onMethodChange = (value: number) => {
		setFormData((prev: any) => ({
			...prev,
			month: value
		}))
	}

	const handleFormDataChange = (nameField: string, value: any) => {
		if (nameField === "method") {
			onMethodChange(value);
		}

		if (nameField === "baseAmount") {
			value = parseVND(value); 
		}

		if (nameField === "fromMonth") {
			const toMonth = calculateMonth(value, formData.month);
			setFormData((prev: any) => ({
				...prev,
				toMonth: toMonth
			}))
		}

		if (nameField === "socialCode" && formData.plan != PLANS.NEW) {
			const errSocialCode = validateNumericField(value, 10);
			setFormErrros((prev) => ({
				...prev,
				[nameField]: !errSocialCode,
			}))
		}

		if (nameField === "hospital" && !isBHXH) {
			const errHospital = validateNumericField(value, 5);
			setFormErrros((prev) => ({
				...prev,
				[nameField]: !errHospital,
			}))
		}

		setFormData((prev: any) => ({
			...prev,
			[nameField]: value
		}))
	}

	const calculateMonth = (date: any, range: number) => {
		return dayjs(date).add(Number(range), "month");
	};

	const handleFormAddMemberChange = (nameField: string, value: any) => {
		if (nameField == "socialCode") {
			let state = false;
			if (value) {
				state = !validateNumericField(value, 10);
			}
			setFormAddMemberErrors(prev => ({
				...prev,
				socialCode: state
			}))
		}
		if (
			nameField === "fullname" ||
			nameField === "address" ||
			nameField === "birthRegisterAddress"
		) {
			setFormAddMemberErrors(prev => ({
				...prev,
				[nameField]: !value?.trim()
			}))
		}

		if (
			nameField === "birthday" ||
			nameField === "relationshipWithHouseHead" ||
			nameField === "ethnicity" ||
			nameField === "nationality"
		) {
			setFormAddMemberErrors(prev => ({
				...prev,
				[nameField]: !value
			}))
		}
		if (nameField == "gender") {
			setFormAddMemberErrors(prev => ({
				...prev,
				gender: value === ""
			}))
		}
		setFormAddMember((prev: any) => ({
			...prev,
			[nameField]: value
		}))
	}

	const handleCancel = () => {
		setModalAddMember(false);
	}

	const handleRemoveMember = (index: number) => {
		setIsRemoveMember(true);
		setMemberSelected(index);
	}

	const onConfirmRemoveMember = () => {
		setFamilies((prev: any) => ({
			...prev,
			thanh_vien: prev.thanh_vien.filter((_: any, idx: number) => idx !== memberSelected)
		}))
		setIsRemoveMember(false);
	}

	const handleSubmitAddMember = (e: React.FormEvent) => {
		e.preventDefault();
		const errList = {
			fullname: formAddMember.fullname.trim() === "",
			birthday: formAddMember.birthday === "",
			ethnicity: formAddMember.ethnicity === "",
			nationality: formAddMember.nationality === "",
			relationshipWithHouseHead: formAddMember.relationshipWithHouseHead === "",
			birthRegisterAddress: formAddMember.birthRegisterAddress === "",
			gender: formAddMember.gender === "",
			address: formAddMember.address === "",
			socialCode: formAddMember.socialCode ? !validateNumericField(formAddMember.socialCode, 10) : false,
		}
		setFormAddMemberErrors(errList);
		const isError = Object.values(errList).some(Boolean);
		if (isError) {
			toast.error(t('err_field_required'));
			return;
		}
		const dataMember = {
			stt: families.thanh_vien.length + 1,
			ho_ten: formAddMember.fullname,
			maso_bhxh: formAddMember.socialCode,
			ngay_sinh: dayjs(formAddMember.birthday).format("DD/MM/YYYY"),
			gioi_tinh: formAddMember.gender,
			dan_toc: formAddMember.ethnicity,
			quoc_tich: formAddMember.nationality,
			matinh_ks: formAddMember.birthRegisterAddress,
			mahuyen_ks: "",
			maxa_ks: "",
			moi_quan_he: formAddMember.relationshipWithHouseHead,
			cmnd: formAddMember.nic,
			diachi_dkks: formAddMember.address,
			ghichu: formAddMember.note,
			ccns: 0,
			nguoi_tham_gia: families.thanh_vien.length + 1,
		}
		setFamilies((prev: any) => ({
			...prev,
			thanh_vien: [
				...(prev.thanh_vien || []),
				dataMember
			]
		}))
		setFormAddMember(defaultFormAddMember);
		setModalAddMember(false);
	}

	const getDatePlaceholder = () => {
		if (dateType === "year") return "YYYY";
		if (dateType === "month") return "MM/YYYY";
		return "DD/MM/YYYY";
	};

	const getRelationship = (value: string) => {
		return FAMILY_RELATIONSHIPS.find(relationship => relationship.value == value)?.label || t('other')
	}

	const getDocumentType = (value: string) => {
		return DOCUMENT_TYPES.find(type => type.value == value)?.label || t('other')
	}

	const getNationalName = (value: string) => {
		if (!countries) return;
		return countries.find((country: any) => country.code == value.toUpperCase())?.name || t('other')
	}

	const onConfirmRemoveImg = () => {
		if (!accessToken) return;
		startTransition(async () => {
			try {
				const resp = await removeImageOrder({ id: imgSelected.id }, accessToken);
				if (resp && resp.success) {
					toast.success(t('success'));
					setIsRemoveImg(false);
					setImgSelected(null);
					queryClient.invalidateQueries({ queryKey: ['order-detail', params.id] });
				}
			} catch (err) {
				handleApiError(err, t)
			}
		})
	}

	const handleRemoveImage = (dataImange: any) => {
		setIsRemoveImg(true);
		setImgSelected(dataImange);
	}

	const buildD03 = (formData: any) => ({
		stt: 1,
		ho_ten: formData.customerName,
		maso_bhxh: formData.socialCode,
		so_cccd: formData.nic,
		ngay_sinh: dayjs(formData.birthday).format("DD/MM/YYYY"),
		gioi_tinh: Number(formData.gender),
		matinh_benh_vien: formData.city,
		ma_benh_vien: formData.hospital,
		ngay_bien_lai: dayjs(formData.receiptDate).format("DD/MM/YYYY"),
		so_bien_lai: formData.receiptNumber,
		tien_dong: formData.amount,
		tu_ngay: dayjs(formData.startDate).format("DD/MM/YYYY"),
		so_thang: Number(formData.month),
		ccns: 0,
		pa: formData.plan,
		muc_huong: 4,
		loai: 0,
		ty_le_nsdp: 0,
		matinh_dang_ss: formData.city,
		mahuyen_dang_ss: "",
		maxa_dang_ss: "",
		diachi_dang_ss: formData.address,
		ngay_chet: "",
		co_giam_chet: 0,
		ma_nhanvien_thu: formData.collectorCode,
		ghichu: formData.note,
		ma_vung_ss: "",
		ma_phong_ban: formData.departmentCode,
		id: "",
		hotro_khac: 0
	})

	const buildD05 = (formData: any) => ({
		stt: 1,
		ho_ten: formData.customerName,
		maso_bhxh: formData.socialCode,
		so_cccd: formData.nic,
		ngay_bien_lai: dayjs(formData.receiptDate).format("DD/MM/YYYY"),
		so_bien_lai: formData.receiptNumber,
		muc_tien: formData.baseAmount,
		tuthang: dayjs(formData.fromMonth).format("MM/YYYY"),
		sothang: formData.month,
		tongtien: formData.totalAmount,
		tien_tudong: formData.amount,
		ghichu: formData.note,
		pa: formData.plan,
		tyle_nsdp: formData.localSupportRate,
		tien_nsdp: formData.localSupportAmount,
		tyle_nsnn: formData.govSupportRate,
		tien_hotro: formData.govSupportAmount,
		tyle_hotro_khac: 0,
		tien_hotro_khac: 0,
		ma_nhanvien_thu: formData.collectorCode,
		matinh_dang_ss: formData.city,
		mahuyen_dang_ss: "",
		maxa_dang_ss: "",
		diachi_dang_ss: formData.address,
		heso: 0,
		tyle: 0,
		ccns: 0,
		phuongthuc: formData.method.toString(),
		loai: 0
	})

	const onSave = () => {
		if (!accessToken) return;
		const checkFormErr = Object.values(formErrors).some(err => err === true);
		if (checkFormErr) {
			toast.error(t('err_check_form'));
			return;
		}
		updateOrder.mutate(
			{
				id: formData.id,
				ngay5nam: formData.fiveYearsDate,
				old_start_date: formData.oldCardStartDate,
				old_end_date: formData.oldCardEndDate,
				comment: formData.note,
				status: formData.status,
				tk1_ts: {
					ho_ten: formData.customerName,
					ngay_sinh: dayjs(formData.birthday).format("DD/MM/YYYY"),
					gioi_tinh: formData.gender,
					dan_toc: formData.ethnicity,
					quoc_tich: formData.nationality,
					diachi_ks: formData.birthRegisterAddress,
					matinh_ks: formData.city,
					mahuyen_ks: "",
					maxa_ks: "",
					diachi_nn: formData.address,
					matinh_nn: formData.city,
					mahuyen_nn: "",
					maxa_nn: "",
					ten_chame_giamho: "",
					maso_bhxh: formData.socialCode,
					dienthoai_lh: formData.phone,
					email_lh: "",
					cmnd: formData.nic,
					maho_giadinh: formData.familyCode,
					mucdong: formData.rate,
					phuong_thuc: formData.method.toString(),
					matinh_benh_vien: formData.city,
					ma_benh_vien: formData.hospital,
					noidung_thaydoi: "",
					hoso_kemtheo: "",
					ccns: 0,
					nhan_ban_dientu: 0,
					nhan_bangiay: 0,
					diachi_nhan_bangiay: "",
					tinh_nhan_bangiay: "",
					huyen_nhan_bangiay: "",
					xa_nhan_bangiay: "",
					ho_gia_dinh: families
				},
				d01_ts: null,
				d03_ts: isBHXH ? null : buildD03(formData),
				d05_ts: isBHXH ? buildD05(formData) : null
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

	useEffect(() => {
		dispatch(setActiveTitle(t("order_detail")));
	}, [t]);

	useEffect(() => {
		if (order) {
			const isBHXH = order.service_code == SERVICE_CODE.BHXH;
			setIsBHXH(isBHXH);
			let dataPlans;
			if (order.ld_pa == PLANS.NEW) {
				dataPlans = [
					{ value: PLANS.NEW, label: t('new') },
				]
			} else {
				const listPlanBHXH = [
					{ value: PLANS.NEXT_PAYMENT, label: t('next_payment') },
					{ value: PLANS.DECREASE, label: t('decrease') },
					{ value: PLANS.REPAY, label: t('repay') },
					{ value: PLANS.MAKE_UP_PAYMENT, label: t('make_up_payment') },
				]
				const listPlanBHYT = [
					{ value: PLANS.RENEWAL, label: t('renewal') },
					{ value: PLANS.DECREASE, label: t('decrease') },
				]
				dataPlans = isBHXH ? listPlanBHXH : listPlanBHYT
			}

			const data = {
				id: order.id,
				attachments: order.attachments,
				status: order.status,
				collectorCode: isBHXH ? order.data.d05_ts.noi_dung[0].ma_nhanvien_thu : order.data.d03_ts.noi_dung[0].ma_nhanvien_thu,
				socialCode: order.ld_maso_bhxh,
				customerName: order.ld_name,
				birthday: order.ld_dob,
				hasCard: order.ld_maso_bhxh ? 0 : 1,
				nic: order.data.tk1_ts.noi_dung[0].cmnd,
				ethnicity: order.data.tk1_ts.noi_dung[0].dan_toc,
				gender: order.data.tk1_ts.noi_dung[0]?.gioi_tinh,
				nationality: order.data.tk1_ts.noi_dung[0].quoc_tich,
				phone: order.ld_phone,
				birthRegisterAddress: order.data.tk1_ts.noi_dung[0].diachi_ks,
				address: order.data.tk1_ts.noi_dung[0].ho_gia_dinh.diachi_tt_ch,
				provider: order.collector?.provider?.name,
				collector: order.collector?.name,
				previousDate: "",
				city: isBHXH ? order.data.d05_ts.noi_dung[0].matinh_dang_ss : order.data.d03_ts.noi_dung[0].matinh_dang_ss,
				hospital: isBHXH ? "" : order.data.d03_ts.noi_dung[0].ma_benh_vien,
				plan: order.ld_pa,
				method: isBHXH ? order.data.d05_ts.noi_dung[0].sothang : "",
				fiveYearsDate: order.ld_ngay5nam,
				oldCardStartDate: order.old_start_date,
				oldCardEndDate: order.old_end_date,
				startDate: order.start_date,
				endDate: order.end_date,
				month: isBHXH ? order.data.d05_ts.noi_dung[0].sothang : order.data.d03_ts.noi_dung[0].so_thang,
				fromMonth: isBHXH ? dayjs(order.data.d05_ts.noi_dung[0].tuthang, "MM/YYYY") : "",
				toMonth: isBHXH ? calculateMonth(dayjs(order.data.d05_ts.noi_dung[0].tuthang, "MM/YYYY"), order.data.d05_ts.noi_dung[0].sothang) : "",
				receiptNumber: isBHXH ? order.data.d05_ts.noi_dung[0].so_bien_lai : "",
				receiptDate: order.billing_date,
				rate: order.data.tk1_ts.noi_dung[0].mucdong,
				benefitRank: isBHXH ? "" : order.data.d03_ts.noi_dung[0].muc_huong,
				familyCode: order.data.tk1_ts.noi_dung[0].maho_giadinh,
				amount: order.amount,
				baseAmount: order.base_amount,
				govSupportRate: isBHXH ? order.data.d05_ts.noi_dung[0].tyle_nsnn : "",
				govSupportAmount: isBHXH ? order.data.d05_ts.noi_dung[0].tien_hotro : "",
				localSupportRate: isBHXH ? order.data.d05_ts.noi_dung[0].tyle_nsdp : order.data.d03_ts.noi_dung[0].ty_le_nsdp,
				localSupportAmount: isBHXH ? order.data.d05_ts.noi_dung[0].tien_nsdp : 0,
				interestMoney: "",
				change: "",
				note: order.comment,
				documentType: "",
				departmentCode: isBHXH ? "" : order.data.d03_ts.noi_dung[0].ma_phong_ban
			}
			setPlans(dataPlans);
			setFamilies(order.data.tk1_ts.noi_dung[0].ho_gia_dinh);
			setFormData(data);
		}
	}, [order]);

	return (
		<div className="min-h-screen font-sans text-gray-800 flex flex-col gap-4 ">
			{order && (
				<>
					<div className="w-full bg-white p-4 rounded shadow-sm border border-gray-200">
						{order && order.status === PAYMENT_STATUS.RECORDED && (
							<div className="w-full flex justify-end items-center">
								<button
									onClick={onSave}
									className="flex flex-row gap-1 items-center px-2 py-1 bg-sky-600 text-sm text-white rounded-sm cursor-pointer"
								>
									<FontAwesomeIcon icon={faSave} />
									{t('save')}
								</button>
							</div>
						)}
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
										className="md:col-span-1 col-span-full"
										onChange={(e) => handleFormDataChange("socialCode", e.target.value)}
										isError={formErrors.socialCode}
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
								className="md:col-span-1 col-span-2"
								onChange={(e) => handleFormDataChange("socialCode", e.target.value)}
							/>
							{!isBHXH && (
								<div className="flex flex-col gap-1.5 md:col-span-1 col-span-2">
									<label className="text-sm mb-1 font-medium text-gray-600">{t('ethnicity')}</label>
									<CustomSelect
										placeholder={t('select_option')}
										value={formData.hasCard}
										onChange={(value) => handleFormDataChange("hasCard", value)}
										options={hasCards.map((option: any) => ({
											value: option.value,
											label: option.label,
										}))}
									/>
								</div>
							)}

							<InputGroup
								label={t("nic")}
								value={formData.nic}
								className="md:col-span-1 col-span-2"
								onChange={(e) => handleFormDataChange("nic", e.target.value)}
							/>
							<div className="flex flex-col gap-1.5 md:col-span-1 col-span-2">
								<label className="text-sm mb-1 font-medium text-gray-600">{t('ethnicity')}</label>
								<CustomSelect
									placeholder={t('select_option')}
									value={formData.ethnicity}
									onChange={(value) => handleFormDataChange("ethnicity", value)}
									options={ethnicities && ethnicities.map((ethnicity: any) => ({
										value: ethnicity.code,
										label: ethnicity.name,
									}))}
								/>
							</div>
							<div className="flex flex-col gap-1.5 md:col-span-1 col-span-2">
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
							<div className="flex flex-col gap-1.5 md:col-span-1 col-span-2">
								<label className="text-sm mb-1 font-medium text-gray-600">{t('nationality')}</label>
								<CustomSelect
									placeholder={t('select_option')}
									value={formData.nationality}
									onChange={(value) => handleFormDataChange("nationality", value)}
									options={countries && countries.map((country: any) => ({
										value: country.code,
										label: country.name,
									}))}
								/>
							</div>

							<InputGroup
								label={t("phone_number")}
								value={formData.phone}
								className="md:col-span-1 col-span-2"
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
							<div className="md:col-span-2 col-span-full">
								<InputGroup
									label={t("social_ins_authority")}
									value={formData.provider}
									readOnly
								/>
							</div>
							<div className="md:col-span-2 col-span-full">
								<InputGroup
									label={t("collector_code")}
									value={formData.collector}
									readOnly
								/>
							</div>
						</FormSection>

						<FormSection
							title={isBHXH ? t("social_ins_info") : t("health_ins_info")}
						>
							{isBHXH && (
								<DatePickerCustom
									label={t("previous_register_date")}
									value={formData.oldCardStartDate}
									format={"DD/MM/YYYY"}
									placeholder="DD/MM/YYYY"
									onChange={(value) => handleFormDataChange("oldCardStartDate", value)}
								/>
							)}
							{!isBHXH && (
								<>
									<div className="flex flex-col gap-1.5 md:col-span-1 col-span-2">
										<label className="text-sm mb-1 font-medium text-gray-600">{t('city_for_medical_treatment')}</label>
										<CustomSelect
											placeholder={t('select_option')}
											value={formData.city}
											onChange={(value) => handleFormDataChange("city", value)}
											options={provinces && provinces.map((province: any) => ({
												value: province.code,
												label: province.name,
											}))}
										/>
									</div>

									<InputGroup
										label={t("hospital_code")}
										value={formData.hospital}
										onChange={(e) => handleFormDataChange("hospital", e.target.value)}
										required
										isError={formErrors.hospital}
									/>
									<DatePickerCustom
										label={t("old_card_start_date")}
										value={formData.oldCardStartDate}
										format={"DD/MM/YYYY"}
										readOnly
									/>
									<DatePickerCustom
										label={t("old_card_end_date")}
										value={formData.oldCardEndDate}
										format={"DD/MM/YYYY"}
										readOnly
									/>
									<DatePickerCustom
										label={t("five_years_date")}
										value={formData.fiveYearsDate}
										format={"DD/MM/YYYY"}
										readOnly
									/>
								</>
							)}
							<div className="flex flex-col gap-1.5">
								<label className="text-sm mb-1 font-medium text-gray-600">
									<span className="text-red-500">*</span> {t('plan')}
								</label>
								<CustomSelect
									placeholder={t('select_option')}
									value={formData.plan}
									onChange={(value) => handleFormDataChange("plan", value)}
									options={plans && plans.map((plan: any) => ({
										value: plan.value,
										label: plan.label,
									}))}
								/>
							</div>
							{!isBHXH ? (
								<>
									<DatePickerCustom
										label={t("new_card_start_date")}
										value={formData.startDate}
										format={"DD/MM/YYYY"}
										onChange={(value) => handleFormDataChange("startDate", value)}
									/>
									<DatePickerCustom
										label={t("new_card_end_date")}
										value={formData.endDate}
										format={"DD/MM/YYYY"}
										readOnly
									/>
								</>
							) : (
								<div className="flex flex-col gap-1.5">
									<label className="text-sm mb-1 font-medium text-gray-600">{t('social_method')}</label>
									<CustomSelect
										placeholder={t('select_option')}
										value={formData.method}
										onChange={(value) => handleFormDataChange("method", value)}
										options={methods.map((method) => ({
											value: method.value,
											label: method.label,
										}))}
									/>
								</div>
							)}
							<div className="flex flex-col gap-1.5">
								<label className="text-sm mb-1 font-medium text-gray-600">
									<span className="text-red-500">*</span> {t('number_of_month')}
								</label>
								<CustomSelect
									placeholder={t('select_option')}
									value={formData.month}
									onChange={(value) => handleFormDataChange("month", value)}
									options={medicalMonths.map((month) => ({
										value: month.value,
										label: month.label,
									}))}
									disabled={isBHXH}
								/>
							</div>
							{isBHXH && (
								<>
									<DatePickerCustom
										picker="month"
										label={t("from_month")}
										value={formData.fromMonth}
										onChange={(value) => handleFormDataChange("fromMonth", value)}
										format={"MM/YYYY"}
										placeholder="MM/YYYY"
									/>
									<DatePickerCustom
										picker="month"
										label={t("to_month")}
										value={formData.toMonth}
										format={"MM/YYYY"}
										placeholder="MM/YYYY"
										readOnly
									/>
								</>
							)}
							<InputGroup
								label={t("receipt_number")}
								value={formData.receiptNumber}
								onChange={(e) => handleFormDataChange("receiptNumber", e.target.value)}
							/>
							<DatePickerCustom
								label={t("receipt_date")}
								value={formData.receiptDate}
								format={"DD/MM/YYYY"}
								onChange={(value) => handleFormDataChange("receiptNumber", value)}
							/>
						</FormSection>

						<FormSection title={isBHXH ? t("social_ins_payment_info") : t("health_ins_payment_info")}>
							{isBHXH ? (
								<>
									<InputGroup
										label={t("salary_for_social_ins")}
										value={formatVND(formData.baseAmount)}
										className="md:col-span-1 col-span-2"
										onChange={(e) => handleFormDataChange("baseAmount", e.target.value)}
									/>
									<InputGroup
										label={t("total_amount")}
										className="md:col-span-1 col-span-2"
										value={formatVND(formData.totalAmount)}
										readOnly
									/>
									<InputWithAffix
										label={t("state_sp_rate")}
										value={formData.govSupportRate}
										className="md:col-span-1 col-span-2"
										onChange={(e) => handleFormDataChange("govSupportRate", e.target.value)}
										prefix={`${t("other_case")}: - `}
										suffix="%"
									/>
									<InputGroup
										label={t("state_sp_amount")}
										value={formatVND(formData.govSupportAmount)}
										className="md:col-span-1 col-span-2"
										onChange={(e) => handleFormDataChange("govSupportAmount", e.target.value)}
									/>
								</>
							) : (
								<div className="flex flex-col gap-1.5 md:col-span-1 col-span-2">
									<label className="text-sm mb-1 font-medium text-gray-600">
										<span className="text-red-500">*</span> {t('household_contribution_rate')}
									</label>
									<CustomSelect
										placeholder={t('select_option')}
										value={formData.rate}
										onChange={(value) => handleFormDataChange("rate", value)}
										options={FAMILY_RATE.map((rate) => ({
											value: rate.value,
											label: rate.label,
										}))}
									/>
								</div>

							)}
							<InputWithAffix
								label={t("local_gov_sp_rate")}
								value={formData.localSupportRate}
								className="md:col-span-1 col-span-2"
								onChange={(e) => handleFormDataChange("localSupportRate", e.target.value)}
								suffix="%"
							/>
							<InputGroup
								label={t("local_gov_sp_amount")}
								value={formatVND(formData.localSupportAmount)}
								className="md:col-span-1 col-span-2"
								onChange={(e) => handleFormDataChange("localSupportAmount", e.target.value)}
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
								value={formData.amount > 0 ? formatVND(formData.amount) : 0}
								className="md:col-span-1 col-span-2"
								readOnly
							/>
							{isBHXH ? (<></>) :
								(
									<>
										<InputGroup
											label={t("health_ins_benefit_level")}
											value={formData.benefitRank}
											className="md:col-span-1 col-span-2"
											readOnly
										/>
										<InputGroup
											label={t("household_code")}
											value={formData.familyCode}
											className="md:col-span-1 col-span-2"
											onChange={(e) => handleFormDataChange("familyCode", e.target.value)}
										/>
										<InputGroup
											label={t("department_code")}
											value={formData.departmentCode}
											className="md:col-span-1 col-span-2"
											onChange={(e) => handleFormDataChange("departmentCode", e.target.value)}
										/>
									</>
								)}
							<div className={`${isBHXH ? 'md:col-span-2' : 'md:col-span-4'} col-span-2`}>
								<InputGroup
									label={t("note")}
									value={formData.note}
									onChange={(e) => handleFormDataChange("note", e.target.value)}
								/>
							</div>
							<div className="md:col-span-4 col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									{t("images")}
								</label>
								{formData.attachments && formData.attachments.length > 0 && (
									<div className="mt-3 flex gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
										{formData.attachments.map((img: any) => (
											<div
												key={img.id}
												className="relative group flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
											>
												<a href={img.url_file} target="_blank">
													<img
														src={img.url_file}
														alt={`image-${img.id}`}
														className="w-full h-full object-contain"
													/>
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															e.preventDefault();
															handleRemoveImage(img);
														}}
														className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md"
													>
														<FontAwesomeIcon icon={faClose} />
													</button>
												</a>
											</div>
										))}
									</div>
								)}
								<Modal
									isOpen={isRemoveImg}
									title={t('remove_img')}
									onConfirm={onConfirmRemoveImg}
									onClose={() => setIsRemoveImg(false)}
								/>
							</div>
						</FormSection>
					</div>
					{families && families.thanh_vien.length > 0 && (
						<>
							<div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
								<h3 className="text-blue-900 font-bold text-sm uppercase">
									{t("household_info")}
								</h3>
								<button
									onClick={() => setModalAddMember(true)}
									className="flex flex-row items-center gap-1 px-2 py-1 text-white text-sm bg-[#1a4b8c] cursor-pointer">
									<FontAwesomeIcon icon={faPlus} />
									{t('add_member')}
								</button>
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
											<th className="p-2 border border-blue-800 font-semibold">
												{t("action")}
											</th>
										</tr>
									</thead>
									<tbody className="text-[12px] text-gray-700">
										{
											families.thanh_vien.map((member: any, index: number) => (
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
														{getRelationship(member.moi_quan_he)}
													</td>
													<td className="p-2 border-r border-gray-200">
														{member.gioi_tinh == GENDER.MALE ? t("male") : t("female")}
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
													<td className="p-2 border-r border-gray-200">{getDocumentType(member.loai_giay_to)}</td>
													<td className="p-2 border-r border-gray-200">{member.so_giay_to}</td>
													<td className="p-2 border-r border-gray-200 max-w-[150px] truncate">
														{member.diachi_dkks}
													</td>
													<td className="p-2 border-r border-gray-200">
														{getNationalName(member.quoc_tich)}
													</td>
													<td className="p-2 border-r border-gray-200">
														{getNameEthnicity(member.dan_toc)}
													</td>
													<td className="px-4 py-3 text-center text-gray-400 space-x-3 whitespace-nowrap">
														<button
															onClick={() => handleRemoveMember(index)}
															className="hover:text-red-600 transition-colors">
															<FontAwesomeIcon icon={faTrashAlt} />
														</button>
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
							<Modal
								isOpen={isRemoveMember}
								title={t('remove_member')}
								onConfirm={onConfirmRemoveMember}
								onClose={() => setIsRemoveMember(false)}
							/>
						</>
					)}
					{modalAddMember && (
						<div
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
							onClick={handleCancel}
						>
							<div
								className="bg-white rounded-lg shadow-xl w-[80%] md:w-[600px] max-h-[80vh] overflow-y-auto scrollbar-hide p-6"
								onClick={(e) => e.stopPropagation()}
							>
								<h2 className="text-lg font-semibold mb-4">{t('add_member')}</h2>
								<form
									onSubmit={handleSubmitAddMember}
								>
									<div className="grid md:grid-cols-3 grid-cols-full gap-4">
										<InputGroup
											label={t("fullname")}
											value={formAddMember.fullname}
											onChange={(e) => handleFormAddMemberChange("fullname", e.target.value)}
											isError={formAddMemberErrors.fullname}
											required
										/>
										<div className="flex flex-col gap-1.5 col-span-2">
											<label className="text-sm mb-1 font-medium text-gray-600">
												<span className="text-red-500">*</span> {t('birthday')}
											</label>
											<div className="flex flex-row gap-4 w-full">
												<CustomSelect
													placeholder={t('select_option')}
													className="w-1/2"
													value={dateType}
													onChange={(value) => setDateType(value)}
													options={oftionsDate.map((option) => ({
														value: option.value,
														label: option.label,
													}))}
												/>
												<DatePickerCustom
													picker={dateType}
													className="w-1/2"
													format={getDateFormat()}
													value={formAddMember.birthday}
													placeholder={getDatePlaceholder()}
													onChange={(value) => handleFormAddMemberChange("birthday", value)}
													isError={formAddMemberErrors.birthday}
												/>
											</div>
										</div>
										<div className="flex flex-col gap-1.5">
											<label className="text-sm mb-1 font-medium text-gray-600">
												<span className="text-red-500">*</span> {t('relatioship_with_house_head')}
											</label>
											<CustomSelect
												placeholder={t('select_option')}
												value={formAddMember.relationshipWithHouseHead}
												onChange={(value) => handleFormAddMemberChange("relationshipWithHouseHead", value)}
												options={FAMILY_RELATIONSHIPS.map((relation: any) => ({
													value: relation.value,
													label: relation.label,
												}))}
												isError={formAddMemberErrors.relationshipWithHouseHead}
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<label className="text-sm mb-1 font-medium text-gray-600">
												<span className="text-red-500">*</span> {t('ethnicity')}
											</label>
											<CustomSelect
												placeholder={t('select_option')}
												value={formAddMember.ethnicity}
												onChange={(value) => handleFormAddMemberChange("ethnicity", value)}
												options={ethnicities.map((ethnicity: any) => ({
													value: ethnicity.code,
													label: ethnicity.name,
												}))}
												isError={formAddMemberErrors.ethnicity}
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<label className="text-sm mb-1 font-medium text-gray-600">
												<span className="text-red-500">*</span> {t('nationality')}
											</label>
											<CustomSelect
												placeholder={t('select_option')}
												value={formAddMember.nationality}
												onChange={(value) => handleFormAddMemberChange("nationality", value)}
												options={countries && countries.map((country: any) => ({
													value: country.code,
													label: country.name,
												}))}
												isError={formAddMemberErrors.nationality}

											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<label className="text-sm mb-1 font-medium text-gray-600">
												<span className="text-red-500">*</span> {t('gender')}
											</label>
											<CustomSelect
												placeholder={t('select_option')}
												value={formAddMember.gender}
												onChange={(value) => handleFormAddMemberChange("gender", value)}
												options={genders.map((gender: any) => ({
													value: gender.value,
													label: gender.label,
												}))}
												isError={formAddMemberErrors.gender}
											/>
										</div>
										<div className="flex flex-col gap-1.5 md:col-span-1 col-span-2">
											<label className="text-sm mb-1 font-medium text-gray-600">
												<span className="text-red-500">*</span> {t('place_of_birth_registration')}
											</label>
											<CustomSelect
												placeholder={t('select_option')}
												value={formAddMember.birthRegisterAddress}
												onChange={(value) => handleFormAddMemberChange("birthRegisterAddress", value)}
												options={provinces && provinces.map((province: any) => ({
													value: province.code,
													label: province.name,
												}))}
												isError={formAddMemberErrors.birthRegisterAddress}
											/>
										</div>
										<InputGroup
											label={t("social_code")}
											value={formAddMember.socialCode}
											onChange={(e) => handleFormAddMemberChange("socialCode", e.target.value)}
											isError={formAddMemberErrors.socialCode}
										/>
										<InputGroup
											label={t("nic")}
											value={formAddMember.nic}
											onChange={(e) => handleFormAddMemberChange("nic", e.target.value)}
										/>
										<div className="flex flex-col gap-1.5">
											<label className="text-sm mb-1 font-medium text-gray-600">{t('document_type')}</label>
											<CustomSelect
												placeholder={t('select_option')}
												value={formAddMember.documentType}
												onChange={(value) => handleFormAddMemberChange("documentType", value)}
												options={DOCUMENT_TYPES.map((type: any) => ({
													value: type.value,
													label: type.label,
												}))}
											/>
										</div>
										<InputGroup
											label={t("document_number")}
											value={formAddMember.documentNumber}
											onChange={(e) => handleFormAddMemberChange("documentNumber", e.target.value)}
										/>
										<InputGroup
											label={t("address")}
											className="col-span-full"
											value={formAddMember.address}
											onChange={(e) => handleFormAddMemberChange("address", e.target.value)}
											isError={formAddMemberErrors.address}
											required
										/>
										<div className="flex flex-col gap-1.5 col-span-full">
											<label className="text-sm font-medium text-gray-600">{t('note')}</label>
											<textarea
												rows={1}
												onChange={e => handleFormAddMemberChange("note", e.target.value)}
												className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
												style={{ borderRadius: '4px' }}
											/>
										</div>
									</div>
									<div className="flex items-center justify-end gap-3 pt-4 mt-2">
										<Button
											type="default"
											onClick={handleCancel}
											className="h-8 text-sm"
										>
											{t('cancel')}
										</Button>
										<Button
											type="primary"
											htmlType="submit"
											className="h-8 text-sm bg-blue-600 hover:bg-blue-700"
										>
											{t('save')}
										</Button>
									</div>
								</form>
							</div>
						</div>
					)}
				</>
			)}
			<Loading stateShow={isLoadingState || isLoadProvinces || isLoadCountries || isLoadEthnicities || isLoadOrderDetail} />
		</div>
	);
}
