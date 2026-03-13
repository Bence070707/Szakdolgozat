export interface Heel {
    id: string;
    code: string;
    price: number;
    quantity: number;
    isArchived: boolean,
    archivedAt: Date,
    images: HeelImage[];
}

export interface HeelImage {
    id: number;
    url: string;
    publicId: string;
    heelId: string;
    isMain: boolean;
}

