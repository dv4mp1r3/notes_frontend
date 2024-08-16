export default class Random {
    string(maxLen: string): string {
        const result: string = (Math.random() + 1).toString(36).substring(parseInt(maxLen));
        console.log('new str');
        console.log('string method called', result);
        return result;
    }
}