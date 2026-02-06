import { SellableItemUI } from "./SellableItem"

export class CreateSaleItemDTO {
    readonly productType: ProductType
    readonly productId: string
    readonly quantity: number

    constructor(item: SellableItemUI) {
        switch (item.type) {
            case 'KEY':
                this.productType = ProductType.KEY;
                break;
            case 'HEEL':
                this.productType = ProductType.HEEL;
                break;
            default:
                throw new Error(`Ismeretlen terméktípus: ${item.type}`);
        }
        this.productId = item.productId;
        this.quantity = item.quantity;
    }
}

export class CreateSaleDTO {
    items: CreateSaleItemDTO[] = []

    constructor(items: SellableItemUI[]) {
        items.forEach(x => {
            this.items.push(new CreateSaleItemDTO(x));
        });
    }
}

enum ProductType {
    KEY = 1,
    HEEL = 2
}