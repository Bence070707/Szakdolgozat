export interface Other {
    id: string;
    name: string;
    price: number;
    quantity: number;
    isArchived: boolean,
    archivedAt: Date,
    images: OtherImage[];
}

export interface OtherImage {
    id: number;
    url: string;
    publicId: string;
    otherId: string;
    isMain: boolean;
}
