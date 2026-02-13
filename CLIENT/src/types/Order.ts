export type Order = {
    id: string,
    items: OrderItem[],
    note?: string,
    supplierEmail: string,
    purchaseOrderStatus: PurchaseOrderStatus,
    updatedAt: Date
    createdAt: Date
}

export type OrderItem = {
    id: string,
    quantity: number
}

export enum PurchaseOrderStatus {
    DRAFT = 1,
    SEND = 2,
    RECEIVED = 3,
    CANCELLED = 4
}