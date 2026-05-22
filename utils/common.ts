import dayjs from "dayjs";

export const formatVND = (amount: number | string) => {
    if (amount === "" || amount === null || amount === undefined) return "";
    const cleaned = typeof amount === 'string' 
        ? amount.replace(/\./g, "").replace(/[^0-9]/g, "") 
        : amount;
    const value = typeof cleaned === 'string' ? parseFloat(cleaned) : cleaned;
    if (isNaN(value)) return "";
    return new Intl.NumberFormat('vi-VN').format(value);
};

export const calculateEndDate = (startDate: any, rangeTime: any, time: any) => {
    switch(time){
        case 'day': 
            return dayjs(startDate).add(rangeTime, 'day').format('DD/MM/YYYY');
        case 'month': 
            return dayjs(startDate).add(rangeTime, 'month').format('DD/MM/YYYY');
        case 'year': 
            return dayjs(startDate).add(rangeTime, 'year').format('DD/MM/YYYY');
        default: 
            break;
    }
}

export const validateNumericField = (value: string, length: number) => {
    return /^\d+$/.test(value) && value.length === length;
};