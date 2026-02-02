import Agent from 'auto-launch';
import app from '../package.json';

class AutoLaunch {

	private readonly appName: string = app['productName'];

	private _enabled: boolean = false;
	private readonly agent: Agent = new Agent({ name: this.appName, isHidden: true });

	constructor() {

		this.agent.isEnabled()
		.then(enabled => this._enabled = enabled == true)
		.catch(() => this._enabled = false)

	}

	public async enable(): Promise<boolean> {

		if(this._enabled) return Promise.resolve(true);

		return this.agent.enable()
		.then(() => {
			this._enabled = true;
			return true
		})
		.catch(() => {
			return false
		})

	}

	public async disable(): Promise<void> {

		if(!this._enabled) return Promise.resolve();

		return this.agent.disable()
		.then(() => {
			this._enabled = false;
		})

	}

	public get enabled(): boolean { return this._enabled }


}