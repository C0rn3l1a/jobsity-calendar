import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

@Component({
    selector: 'color-selector',
    templateUrl: './color-selector.component.html',
    styleUrls: ['./color-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorSelectorComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ColorSelectorComponent),
            multi: true,
        }
    ]
})
export class ColorSelectorComponent implements OnInit {

    active = false

    palette = [
        'blue',
        'light-blue',
        'red',
        'purple',
        'yellow',
        'green',
        'orange',
    ]

    constructor() { }

    ngOnInit(): void {
    }

    @Input('disabled') disabled: boolean;

    _value
    set value(val) {
        this._value = val
        this.onChange(val)
        this.onTouch(val)
    }
    get value() { return this._value }

    writeValue(value: any) {
        this.value = value
    }

    /**
     * @description Este metodo guarda el callback asignado en el view para, lo gaurdamos en onChange para poder llamarlo internamente
     * @param fn 
     */
    registerOnChange(fn: any) {
        this.onChange = fn
    }
    onChange: any = () => { }

    /**
     * @description Este metodo guarda el callback asignado en el view para, lo gaurdamos en onTouch para poder llamarlo internamente
     * @param fn 
     */
    registerOnTouched(fn: any) {
        this.onTouch = fn
    }
    onTouch: any = () => { }

    /**
     * @description Este metodo se llama automaticamente cuando el estado cambia en el ngcontrol
     * @param {boolean} isDisabled
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    validate({ value }: FormControl) {
        // CUSTOM VALIDATIONS GO HERE
        return null
    }

}
