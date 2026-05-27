export const ROLE_CODE = {
    ADMIN: 1,
    USER: 2,
    SALEMAN: 3,
    AGENT: 4,
    CUSTOMER: 5,
    ADMIN_GROUP: 6
}

export const STATUS = {
    DEACTIVE: 0,
    ACTIVE: 1,
}

export const INTERNAL_STATUS = {
    RECORD: 0,
    WAIT_PAID: 1,
    PAID: 2,
    RECORD_CREATED: 3,
    RECORD_SUBMITTED: 4,
    APPROVED_BY_SOCIAL_INS: 5,
    RETURNED_BY_SOCIAL_INS: 6,
    CANCELLED: 7,
}

export const PROVIDER_ORDER_STATUS = {
    SUCCESS: 0,
    PAID_BY_PARTNER: 1,
    PENDING_PAYMENT_SOCIAL_INS: 2,
    PAID_BY_SOCIAL_INS: 3,
    RECORD_CREATED: 4,
    RECORD_SUBMITTED: 5,
    APPROVED_BY_SOCIAL_INS: 6,
    RETURNED_BY_SOCIAL_INS: 7,
    CANCELLED: 8,
}

export const SERVICE_CODE = {
    BHXH: 602,
    BHYT: 603
}

export const PLANS = {
    RENEWAL: "ON",
    NEW: "TM",
    DECREASE: "GH",
    NEXT_PAYMENT: "DT",
    REPAY: "DL",
    MAKE_UP_PAYMENT: "DB",
}

export const PAYMENT_STATUS = {
    RECORDED: 0,
    WAIT_PAID: 1,
    PAID: 2,
    TE: 3,
    CANCEL: 4,
    PARTNER_PAID: 6
}

export const GENDER = {
    MALE: 0,
    FEMALE: 1
}

export const NATIONAL = {
    VN: "vn"
}

export const BIRTHDAY_VALUE = {
    FULL: 0,
    MONTH_AND_YEAR: 1,
    ONLY_YEAR: 2
}

export const PRODUCT_CODE = {
    BHXH: "BHXH602",
    BHYT: "BHYT603"
}

export const FAMILY_RELATIONSHIPS = [
    { value: "00", label: "Chủ hộ" },
    { value: "01", label: "Vợ" },
    { value: "02", label: "Chồng" },
    { value: "03", label: "Bố" },
    { value: "04", label: "Mẹ" },
    { value: "05", label: "Em" },
    { value: "06", label: "Anh" },
    { value: "07", label: "Chị" },
    { value: "08", label: "Con" },
    { value: "09", label: "Cháu" },
    { value: "10", label: "Ông" },
    { value: "11", label: "Bà" },
    { value: "12", label: "Cô" },
    { value: "13", label: "Dì" },
    { value: "14", label: "Chú" },
    { value: "15", label: "Thím" },
    { value: "16", label: "Bác" },
    { value: "17", label: "Cậu" },
    { value: "18", label: "Mợ" },
    { value: "19", label: "Con dâu" },
    { value: "20", label: "Con dể" },
    { value: "21", label: "Chắt" },
    { value: "99", label: "Khác" },
]

export const DOCUMENT_TYPES = [
    { value: "01", label: "Sổ hộ khẩu" },
    { value: "02", label: "Sổ tạm trú" },
    { value: "03", label: "Giấy tạm trú" },
    { value: "04", label: "Số UBND" },
    { value: "05", label: "Khác" },
]

export const FAMILY_RATE = [
    { value: 100, label: "100%" },
    { value: 70, label: "70%" },
    { value: 60, label: "60%" },
    { value: 50, label: "50%" },
    { value: 40, label: "40%" },
]

export const SOCIAL_INS_RATE = 22;
export const GOV_SUPPORT_AMOUNT = 66000;
export const MEDICAL_INS_RATE = 4.5;