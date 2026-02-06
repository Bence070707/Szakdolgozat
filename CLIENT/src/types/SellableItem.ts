export interface SellableItemUI {
    productId: string;
    type: 'KEY' | 'HEEL';

    imageUrl?: string;

    quantity: number;
    unitPrice: number;
}

export class KeyToSellUI implements SellableItemUI {
    productId: string;
    type: 'KEY' = 'KEY';

    imageUrl?: string;

    quantity: number;
    unitPrice: number;

    silcaCode: string;
    errebiCode?: string;
    jmaCode?: string;

    constructor(key: any) {
        this.productId = key.id;
        this.silcaCode = key.silcaCode;
        this.imageUrl = key.imageUrl ?? 'fallback.jpg';

        this.unitPrice = key.price;
        this.quantity = key.quantity;

        this.errebiCode = key.errebiCode;
        this.jmaCode = key.jmaCode;
    }

}

export class HeelToSellUI implements SellableItemUI {
    productId: string;
    code: string;
    type: 'HEEL' = 'HEEL';

    imageUrl?: string;

    quantity: number;
    unitPrice: number;


    constructor(heel: any) {
        this.productId = heel.id;
        this.code = heel.code;
        this.imageUrl = heel.imageUrl ?? 'fallback.jpg';

        this.unitPrice = heel.price;
        this.quantity = heel.quantity;
    }
}