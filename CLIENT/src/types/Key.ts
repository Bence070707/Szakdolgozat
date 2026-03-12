export interface Key {
    id: string;
    priceType: KeyPriceType;
    silcaCode: string;
    errebiCode: string;
    jmaCode: string;
    price: number;
    quantity: number;
    isArchived: boolean,
    archivedAt: Date,
    images: KeyImage[];
}

export interface KeyImage {
    id: number;
    url: string;
    publicId: string;
    keyId: string;
    isMain: boolean;
}

export enum KeyPriceType {
    TYPE1 = 1,
    TYPE2 = 2,
    TYPE3 = 3
}
