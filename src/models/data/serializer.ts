export default interface Serializer {
    serializeArray<T>(data: ArrayLike<any>): Array<T>

    serialize<T>(data: any): T
}