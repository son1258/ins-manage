export type PaymentProps = {
    batchPayments: {},
    selectedItems: Item[],
    excludedItems: Item[],
    totalAmount: number,
    isPaymentAllDate: boolean
}

export type Item = {
    id: string,
    amount: number
}