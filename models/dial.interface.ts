import { App } from 'peer-dial';

/** DIAL Apps object declaration */
export interface Apps { [key: string]: App };

/** Aplicación DIAL sin evento de lanzamiento. */
export interface DialAppWithoutLaunch {

    /** App name */
    name:       string
    /** App name */
    state:      string
    allowStop:  boolean
    pid:        null

}

/** Aplicación DIAL con evento de lanzamiento. */
export interface DialApp extends DialAppWithoutLaunch {

    launch: (url: string) => void;

}