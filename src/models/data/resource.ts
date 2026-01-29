export type Resource = {
    id: number;
    categoryId: number;
    name: string;
    data: string;
    icon: string;
}

export type Category = {
    Resources: Map<number, Resource>,
    id: number;
    name: string;
    userId: number;
    icon: string;
}
export type SetResourceCategory = {
    Resources: Array<Resource>,
    id: number;
    name: string;
    userId: number;
    icon: string;
}