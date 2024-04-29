import Serializer from "./serializer";

export default class JsonSerializer implements Serializer {
    serializeArray<T>(data: ArrayLike<any>): T[] {
        const result = Array<T>();
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            if(el === null || typeof el !== 'object') {
                continue;
            }
            result.push(this.fillObejct(data[i]));
        }
        return result;
    }
    serialize<T>(data: any): T {
        throw new Error("Method not implemented.");
    }

    
    private fillObejct<T>(source: any) : T {
        throw new Error('Not implemented yet');
    }
}