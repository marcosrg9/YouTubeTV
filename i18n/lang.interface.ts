export interface langModel {

    /** Ventana de error de intepretación de la persistencia de datos. */
    parseErrorDialogMessage: {
        message: string,
        okBtn: string,
        cancelBtn: string
    }
    booleanEnabledDisabled: {
        true: string,
        false: string
    }

}

interface bool {
    true: string,
    false: string
}

export const resolveBooleanMessage = (dict: bool, value: boolean) => {
    return value ? dict.true : dict.false
}

export interface dialog {
    title: string,
    message: string,
    detail: string,
    buttons: string[],
    cancelId: number
}

export interface dialogs {
    load_settings_corrupt: dialog,
    update_available: dialog
}