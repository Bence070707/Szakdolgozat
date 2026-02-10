export class KeyOrder {
    id: string;
    silcaCode: string;
    errebiCode: string;
    jmaCode: string;
    quantity: number;
    quantityToOrder:number

    constructor(
        id: string,
        silcaCode: string,
        errebiCode: string,
        jmaCode: string,
        quantity: number,
        quantityToOrder: number
    ) {
        this.id = id;
        this.silcaCode = silcaCode;
        this.errebiCode = errebiCode;
        this.jmaCode = jmaCode;
        this.quantity = quantity;
        this.quantityToOrder = quantityToOrder;
    }
}
