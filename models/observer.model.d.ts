export declare class DataWatcher<T extends object> {
    private target;
    private cb;
    private path;
    /**
     * Observa los eventos de escritura de un objeto.
     * @param target Objeto que será observado.
     * @param cb Función que llamará cuando se escriba en el objeto.
     * @param path Ruta hacia la propiedad
     */
    constructor(target: T, cb: (Path: string[], privatevalue: any) => any, path?: string[]);
    get(target: T, p: string | symbol, receiver: any): any;
    private set;
}
//# sourceMappingURL=observer.model.d.ts.map