export type Order = {
    id: string,
    items: OrderItem[],
    note?: string,
    purchaseOrderStatus: PurchaseOrderStatus,
    updatedAt: Date
}

export type OrderItem = {
    id: string,
    quantity: number
}

enum PurchaseOrderStatus {
    DRAFT = 1,
    SEND = 2,
    RECEIVED = 3,
    CANCELLED = 4
}