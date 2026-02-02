import { dialog as electronDialog } from 'electron';
import { dialog as i18nDialog, dialogs } from '../i18n/i18n'
import main from '../main';

export abstract class Dialog {

    static showYesNoDialog(dialog: i18nDialog): Promise<boolean>;
    static showYesNoDialog(title: string, message: string, detail: string): Promise<boolean>;
    static showYesNoDialog(title: string | i18nDialog, message?: string, detail?: string): Promise<boolean> {

        return new Promise(async(resolve, reject) => {

            try {

                if(typeof title === 'object') {
                    
                } else {

                    if(!message) return;
                    
                    const { yes, no } = main.i18n.utils.yes_no_buttons;
                    const d = await electronDialog.showMessageBox({title, message, detail, buttons:[ yes, no ], cancelId: 1 })
    
                    if(d.response === 1) resolve(false);
                    else resolve(true)

                }
                

            } catch(err) {
                reject(err);
            }

        })

    }

    static showDialog(dialog: keyof dialogs): Promise<boolean>;
    static showDialog(title: string, message: string, detail: string, buttons: string[], cancelId: number): Promise<boolean>;
    static showDialog(dialog: keyof dialogs | string, message?: string, detail?: string, buttons?: string[], cancelId?: number): Promise<boolean> {

        // Esto permite que si los archivos de idiomas no se encuentran, el diálogo se cargue igualmente.
        try {

            const d = main.i18n.dialogs[dialog as keyof dialogs];
    
            if(d) {
                
                return electronDialog.showMessageBox({...d})
                .then(v => {
                    if(v.response === d.cancelId) return false
                    else return true;
                })
    
            } else throw null;
            
        } catch(err) {
            
            if(!dialog || !message || !detail || !buttons || !cancelId) return Promise.reject(new Error(''));

            return electronDialog.showMessageBox({ title: dialog, message, detail, buttons, cancelId })
            .then(v => {
                if(v.response === cancelId) return false;
                else return true;
            })
        }


    }

    

}