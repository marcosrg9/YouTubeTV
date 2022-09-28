/**
 * Mensaje de estado de fuera de conexión.
 * 
 * Cuando el renderizador se carga y la conexión con los servidores de YouTube
 * no está disponible, este script mostrará un mensaje de estado.
 */

const ipc = window.require('electron').ipcRenderer;
const styles = document.createElement('style');
const banner_cont = document.createElement('div');
const offline_picture = document.createElement('div');
const offline_message = document.createElement('div');
const offline_description = document.createElement('div');

const msgDB = {
    es: {
        msg: 'No tienes conexión',
        des: 'Parece que no se puede establecer la conexión con los servidores de YouTube.<br>Comprueba la conexión, así como los parámetros, enrutadores y concentradores.<br>Cuando se detecte conectividad, volveremos a intentarlo automaticamente.'
    },
    en: {
        msg: 'You\'re offline',
        des: 'It seems that the connection to the YouTube servers cannot be established.<br>Check the connection, as well as the parameters, routers and hubs.<br>When connectivity is detected, we will automatically try again.'
    }
}

let msg = msgDB.en;

Object.keys(msgDB).forEach(lang => {
    if (lang === navigator.language) msg = msgDB[lang];
});

styles.innerHTML = `
	* {
		font-family: -apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
	}

	body {
		background: #181818;
	}

	.connection_err {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		animation: fade-in 2s forwards;
	}

	.connection_err > .offline_message {
		font-size: 72pt;
		font-weight: 500;
		color: #959595;
	}

	.connection_err > .offline_description {
		font-size: 48pt;
		color: #525252;
		width: 2200px;
		text-align: center;
		margin-top: 40px;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`

offline_picture.innerHTML = '<svg viewbox="0 0 48 48" height="48" width="48" style="width: 200px; height: 200px"><path style="fill: #959595" d="m41.25 44.4-5.8-5.9H12.6q-3.95 0-6.7-2.7t-2.75-6.7q0-3.8 2.65-6.45Q8.45 20 11.9 19.8q-.05-.65.275-1.8t.875-1.85l-8.1-8.1L6.5 6.5l36.35 36.35ZM12.6 36.3h20.65L14.8 17.9q-.6.75-.9 1.875-.3 1.125-.3 2.225h-1q-3.05 0-5.15 2.025-2.1 2.025-2.1 5.025 0 3.05 2.125 5.15Q9.6 36.3 12.6 36.3Zm11.35-9.25Zm18.25 9.8-1.65-1.65q1-.8 1.55-1.8t.55-2.3q0-2.05-1.525-3.575Q39.6 26 37.5 26h-3.25v-4.05q0-4.3-2.975-7.275Q28.3 11.7 24 11.7q-1.4 0-2.875.4t-2.675 1.2l-1.55-1.65q1.85-1.15 3.5-1.65t3.55-.5q5.05 0 8.625 3.45t3.875 8.45v2.45h1.25q3.05.2 5.1 2.225t2.05 5.025q0 1.5-.625 3.05-.625 1.55-2.025 2.7Zm-12.7-12.6Z"/></svg>'
offline_message.innerHTML = msg.msg
offline_description.innerHTML = msg.des


document.body.appendChild(styles);
document.body.appendChild(banner_cont);

banner_cont.classList.add('connection_err');
offline_message.classList.add('offline_message');
offline_description.classList.add('offline_description');


banner_cont.appendChild(offline_picture);
banner_cont.appendChild(offline_message);
banner_cont.appendChild(offline_description);


// When online event fires, send a signal to the main process.
window.ononline = () => ipc.send('restored');