import { main } from './main.js';


export abstract class UIElement extends HTMLElement {

    protected _value: string;
    protected elements: HTMLElement[] = [];
    protected onChangeCallbacks: (()=>void)[] = [];

    constructor() {
        super();
    }

    /**
     * Abstracción de elemento HTML para escucha de eventos
     * @param _key 
     * @param _value 
     */
    protected _init( value: any) {
        this._value = value;
    }

    public blur() {
        this.elements.forEach(e => {
            e.classList.remove('hover');
            if(e.firstElementChild instanceof HTMLInputElement) e.firstElementChild.blur();
        });
    }

    public focus() {
        this.blur();
        this.elements[0]?.classList.add('hover');
        this.elements[0]?.focus();
        if(this.elements[0]?.firstChild instanceof HTMLInputElement) {
            this.elements[0]?.firstChild.focus();
        }
    }

    public setFocus(index: number) {
        if(!this.elements[index]) return;
        this.blur();
        this.elements[index]?.classList.add('hover');
    }

    public focusPrevious(): boolean {

        for(let i = 0; i < this.elements.length; i++) {
            if(this.elements[i]?.classList.contains('hover')) {
                if(i == 0) return false;
                this.blur();
                this.setFocus(i - 1);
                return true;
            }
        }
        return false;
    }

    public focusNext(): boolean {
        for(let i = 0; i < this.elements.length; i++) {
            if(this.elements[i]?.classList.contains('hover')) {
                if(i + 1 > this.elements.length - 1) return false;
                this.setFocus(i + 1);
                return true;
            }
        }
        return false;
    }

    public focusLast() {
        this.blur();
        this.setFocus(this.elements.length - 1);
    }

    public set onChange(callback: () => void) {
        this.onChangeCallbacks[this.onChangeCallbacks.length] = callback;
    }

    protected changeEvent() {
        this.onChangeCallbacks.forEach(e => e());
    }

}

export class UISelectElement extends UIElement {

    private element_name: string = (Math.random() * 1000000).toString().split('.')[0] as string;
    protected selected: string | boolean;

    public init(selected: string | boolean, options: typeof selected[], message: string = "") {
        
        this._init(selected);
        this.selected = selected;

        const p = document.createElement('p');
        p.innerText = message;
        this.appendChild(p);

        for(let opt of options) {

            const div = document.createElement('div');
            div.classList.add('optselector');
            if(typeof selected === 'boolean' && opt === selected) div.classList.add('selected');
            else if(typeof selected === 'string' && typeof opt === 'string' && selected.toLowerCase() == opt.toLowerCase()) {
                div.classList.add('selected');
            }

            const label = document.createElement('label');

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = this.element_name;
            input.value = opt as string;
            input.checked = opt == selected;
            div.onclick = () => this.select(div);

            const span = document.createElement('span');
            const { boolean_enabled_disabled } = main.i18n.utils
            //if(typeof opt === 'boolean') span.innerHTML = resolveBooleanMessage(ES_ES_LANG.booleanEnabledDisabled, opt);
            if(typeof opt === 'boolean') span.innerHTML = opt ? boolean_enabled_disabled['true'] : boolean_enabled_disabled['false'];
            else span.innerHTML = opt;

            label.appendChild(input);
            label.appendChild(span);

            div.appendChild(label);

            this.appendChild(div);
            this.elements[this.elements.length] = div;

        }
    }

    public get value(): typeof this.selected {
        if(this.selected === 'true' || this.selected === 'false')
            return this.selected == 'true' ? true : false
        return this.selected;
    }

    public select(el: HTMLDivElement | null = null) {

        this.elements.forEach(e => {
            e.classList.remove('selected');
            (e!.firstChild as HTMLInputElement).checked = false;
        })

        // Nota: blur no puede ir antes que findIndex para hover.

        if(!el) {
            const next = this.elements.findIndex(e => e.classList.contains('hover'));
            if(next != -1 && this.elements[next] != null)
                el = this.elements[next] as HTMLDivElement;
            else return;
        }

        el.classList.add('selected');
        (el!.firstChild as HTMLInputElement).checked = true;

        this.selected = (el.firstChild!.firstChild as HTMLInputElement).value;

        this.changeEvent();
    }

}

export class UITextElement extends UIElement {


    public init(value: string, message: string = "") {
        
        if(message.length > 0) {
            const p = document.createElement('p');
            p.innerText = message;
            this.appendChild(p);
        }

        const div = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        div.appendChild(input);
        this.appendChild(div);

        input.onfocus = this.select.bind(this);
        input.onblur = this.onBlur.bind(this);

        this.elements[0] = div;

    }

    private select(...e: any) {
        this.elements[0]?.classList.add('hover')
    }

    private onBlur() {
        this.blur();
        this.changeEvent();
    }

    public get value(): string {
        return (this.elements[0]?.children[0] as HTMLInputElement).value;
    }
}

if(!customElements.get('ui-select-element'))
    customElements.define('ui-select-element', UISelectElement);
if(!customElements.get('ui-text-element'))
    customElements.define('ui-text-element', UITextElement);