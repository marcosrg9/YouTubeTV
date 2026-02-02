export interface DataModel {
    /**
     * Resolución de la pantalla que se emulará.
     */
    resolution: "8k" | "4k" | "2k" | "1080p" | "720p",
    /**
     * Parámetros de estado de ventana.
    */
    keepSize: {
        /** Habilita la persistencia de parámetros de ventana. */
        enabled: boolean,
        /** Indica si la ventana se encuentra en pantalla completa. */
        fullScreen: boolean,
        /** Parámetros de dimensiones y posicionamiento. */
        bounds: {
            /** Posicionamiento en el eje horizontal. */
            x: number,
            /** Posicionamiento en el eje vertical. */
            y: number,
            /** Anchura de la ventana. */
            width: number,
            /** Altura de la ventana. */
            height: number
        }
    },
    /** Parámetros del servidor de descubrimiento. */
    DIAL: {
        /** Estado del servidor. */
        enabled: boolean,
        /** Nombre que se emitirá. */
        name: string
    },
    background: boolean,
    userAgent: {
        useCustomUA: boolean,
        customUA: string
    }
}