export class DataWatcher<T extends object> {

    /**
     * Observa los eventos de escritura de un objeto.
     * @param target Objeto que será observado.
     * @param cb Función que llamará cuando se escriba en el objeto.
     * @param path Ruta hacia la propiedad
     */
    constructor(private target: T,
                private cb: (Path: string[], privatevalue: any) => any,
                private path: string[] = []) {
        
        return new Proxy(this.target, { get: this.get.bind(this), set: this.set.bind(this) }) as DataWatcher<T>;
                    
    }

    public get(target: T, p: string | symbol, receiver: any): any {
        const val = Reflect.get(target, p, receiver);
        if(typeof val === 'object' && val != null) return new DataWatcher(val, this.cb, [...this.path, String(p)]);
        return val;
    }

    private set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
        const success = Reflect.set(target, p, newValue, receiver);
        if(success) this.cb([...this.path, String(p)], newValue);
        return success;
    }

}