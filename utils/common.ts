import dayjs from "dayjs";

export const formatVND = (amount: number | string) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(value)) return "0";
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
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