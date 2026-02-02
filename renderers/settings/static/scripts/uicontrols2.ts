import { UIElement, UISelectElement } from "./uielement2.js";
import { UIRenderer } from "./uirenderer.js";


export class UIControls {

    /** Indica si las opciones avanzadas deben mostrarse. */
    private advanced: boolean = false;
    /** Indicativo para reducir la velocidad de pulsación. */
    private wait: boolean = false;
    /** Mapa de eventos de teclado. */
    private keyMap = {
        KeyA:       this.onKeyA.bind(this),
        ArrowUp:    this.onKeyArrowUp.bind(this),
        ArrowDown:  this.onKeyArrowDown.bind(this),
        ArrowRight: this.onKeyArrowRight.bind(this),
        ArrowLeft:  this.onKeyArrowLeft.bind(this),
        Enter:      this.onKeyEnter.bind(this),
        Space:      this.onKeyEnter.bind(this)
    }
    
    private sidebarLength: number = 0;
    private sidebar: Element = document.querySelector('.sidebar')!;

    private uiRenderer: UIRenderer;


    constructor() {

        this.listenKeyEvents();
        this.sidebarLength = this.calcVisibleLength();

    }

    private listenKeyEvents() {
        document.onkeydown = this.keyListener.bind(this);
    }

    private listenMouseEvents() {

        const sections = ['resolution', 'keepSize', 'dial', 'background'];

        sections.forEach(e => {
            (document.querySelector(`#${e}`) as HTMLDivElement).onclick = () => this.uiRenderer.focusSection(e as any)
        });

    }

    private calcSidebarLength(): number {
        return this.sidebar.childElementCount - 1;
    }

    private calcVisibleLength(): number {

        const total = this.calcSidebarLength();
        let counter = 0;
        
        for(let i = 1; i < total; i++)
            if (!this.sidebar.children.item(i)?.classList.contains('hidden')) counter++;
        
        console.log(counter - 1)
        return counter - 1;
    }

    private keyListener(event: KeyboardEvent) {

        if(this.wait) return;
        this.wait = true;
        setTimeout(() => this.wait = false, 100);
        
        const key: string = event.code as unknown as string;

        if(!this.keyMap[key as keyof typeof this.keyMap]) return;
        
        this.keyMap[key as keyof typeof this.keyMap](event);

    }

    private onKeyA(e: KeyboardEvent) {

        if(e.altKey && !this.advanced) {
            document.querySelectorAll('.hidden').forEach(e => e.classList.remove('hidden'));
            this.advanced = true;
            this.sidebarLength = this.calcSidebarLength();
        }

    }

    private onKeyArrowDown(e: KeyboardEvent) {
        this.uiRenderer.down();
    }

    private onKeyArrowUp(e: KeyboardEvent) {
        this.uiRenderer.up()
    }

    private onKeyArrowRight(e: KeyboardEvent) {
        this.uiRenderer.right();
    }

    private onKeyArrowLeft(e: KeyboardEvent) {
        this.uiRenderer.left();
    }

    private onKeyEnter(e: KeyboardEvent) {
        this.uiRenderer.simulateClick();
    }

    public attachRenderer(renderer: UIRenderer) {
        if(this.uiRenderer != null) return;
        this.uiRenderer = renderer;
        this.listenMouseEvents();
    }

}