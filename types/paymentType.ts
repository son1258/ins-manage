export type PaymentProps = {
    batchPayments: {},
    selectedItems: Item[],
    excludedItems: Item[],
    totalAmount: number,
    isPaymentAllDate: boolean,
    isSynced: boolean
}

export type Item = {
    id: string,
    amount: number
}