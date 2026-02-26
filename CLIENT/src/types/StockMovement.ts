import { User } from "./User";

export type StockMovement = {
    id: string,
    productId: string,
    quantityBefore: number,
    quantityAfter: number,
    priceBefore: number,
    priceAfter: number,
    createdBy: string | null,
    createdAt: Date,
    status: StockMovementStatus,
    decidedAt: Date | null,
    user: User
};

enum StockMovementStatus
{
    PENDING = 1,
    ACCEPTED = 2,
    DENIED = 3
}