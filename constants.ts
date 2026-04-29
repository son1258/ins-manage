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

export const DECLARATION_STATUS = {
    RECORDED: 1,
    PENDING_PAYMENT: 2,
    PAID: 3,
    RECORD_CREATED: 4,
    SUBMITTED: 5,
    APPROVED_BY_SOCIAL_INS: 6,
    RETURNED_BY_SOCIAL_INS: 7,
    CANCELLED_DECLARATION: 8,
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
    PAID: 1,
    PARTNER_PAID: 6
}

export const PAYMENT_REQUEST_STATUS = {
    PAID: 0,
    UNPAID: 1
}

export const GENDER = {
    MALE: 0,
    FEMALE: 1
}

export const NATIONAL = {
    VN: 'vn'
}

export const BIRTHDAY_VALUE = {
    FULL: 0,
    MONTH_AND_YEAR: 1,
    ONLY_YEAR: 2
}