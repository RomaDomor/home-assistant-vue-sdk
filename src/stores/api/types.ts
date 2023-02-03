export type KeyedArray<Type> = {
	[key: string]: Type;
};

export enum EntityDomain {
	Light = "light",
	Switch = "switch",
	Fan = "fan",
	Sensor = "sensor",
	BinarySensor = "binary_sensor",
	Cover = "cover",
	Climate = "climate"
}

export interface Context {
	id: string;
	parent_id: string;
	user_id: string;
}
export interface Args {
	on?: boolean;
	brightness?: number;
	percentage?: number;
}
export interface Attributes {
	brightness?: number;
	color_mode?: string;
	percentage?: number;
	position?: number;
	device_class?: string;
	friendly_name?: string;
	fan_mode?: FanMode;
	hvac_mode?: HVACMode;
	temperature?: number;
}
export interface EntityState {
	attributes: Attributes;
	context: Context;
	entity_id: string;
	last_changed: Date;
	last_updated: Date;
	state: string;
}

export interface MessageEvent {
	event_type: string;
	origin: string;
	time_fired: Date;
	context: Context;
	data: {
		entity_id: string;
		old_state: EntityState;
		new_state: EntityState;
	};
}

export interface Message {
	id: number;
	type: string;
	event: MessageEvent;
	result: any;
}

import type { HassApi } from "homeassistant-ws";

// type EntityArgs =
// 	| [HassApi, string, string, string]
// 	| [HassApi, string, string, string, boolean]
// 	| [HassApi, string, string, string, number];
export type EventHandler = (e: KeyedArray<Entity>, c?: Entity) => void;
export type UpdateHandler = (e: Entity) => void;

export class Entity {
	private updateHandler?: UpdateHandler;
	private client: HassApi;

	public domain: EntityDomain = EntityDomain.Switch;
	public id: string;
	public friendly_name: string;

	static register(
		handler: UpdateHandler,
		domain: EntityDomain,
		...args: any[]
	): Entity {
		switch (domain) {
			case "light":
				return new Light(...args).setUpdateHandler(handler);
			case "switch":
				return new Switch(...args).setUpdateHandler(handler);
			case "fan":
				return new Fan(...args).setUpdateHandler(handler);
			case "sensor":
				return new Sensor(...args).setUpdateHandler(handler);
			case "binary_sensor":
				return new BinarySensor(...args).setUpdateHandler(handler);
			case "cover":
				return new Cover(...args).setUpdateHandler(handler);
			case "climate":
				return new Climate(...args).setUpdateHandler(handler);
			default:
				// console.log(args);
				return new Entity(...args).setUpdateHandler(handler);
		}
	}

	private setUpdateHandler(handler: UpdateHandler) {
		this.updateHandler = handler;
		return this;
	}

	constructor(client: HassApi, id: string, friendly_name: string) {
		this.client = client;
		// this.domain = domain;
		this.id = id;
		this.friendly_name = friendly_name;
	}

	public update(args: Args) {
		for (const key in args) {
			if (Object.prototype.hasOwnProperty.call(this, `_${key}`))
				this[`_${key}`] = args[key];
		}
		if (this.updateHandler !== undefined) this.updateHandler(this);
	}

	private async setHA(service: string, args?: Attributes) {
		await this.client.callService(this.domain.toString(), service, {
			entity_id: this.domain.toString() + "." + this.id,
			...(args !== undefined ? args : {})
		});
	}
}

export class Switch extends Entity {
	public domain: EntityDomain = EntityDomain.Switch;
	private _on: boolean;

	constructor(
		client: HassApi,
		id: string,
		on: string,
		friendly_name: string
	) {
		super(client, id, friendly_name);
		this._on = on == "on";
	}

	public toggle() {
		this.on = !this.on;
	}

	get on() {
		return this._on;
	}
	set on(value: boolean) {
		this.setHA(value ? "turn_on" : "turn_off");
	}
}

export class Light extends Switch {
	public domain: EntityDomain = EntityDomain.Light;
	private _brightness: number | undefined;

	constructor(
		client: HassApi,
		id: string,
		on: string,
		friendly_name: string,
		brightness: number | undefined
	) {
		super(client, id, on, friendly_name);
		this._brightness = brightness;
	}

	get brightness(): number | undefined {
		return this._brightness;
	}

	set brightness(value: number | undefined) {
		this.setHA(this._on ? "turn_on" : "turn_off", {
			brightness: value
		});
	}
}

export class Fan extends Switch {
	public domain: EntityDomain = EntityDomain.Fan;
	private _percentage: number | undefined;

	constructor(
		client: HassApi,
		id: string,
		on: string,
		friendly_name: string,
		percentage: number | undefined
	) {
		super(client, id, on, friendly_name);
		this._percentage = percentage;
	}

	get percentage(): number | undefined {
		return this._percentage;
	}

	set percentage(value: number | undefined) {
		this.setHA(this._on ? "turn_on" : "turn_off", {
			percentage: value
		});
	}
}

export class Sensor extends Entity {
	public domain: EntityDomain = EntityDomain.Sensor;
	private _state: string;

	constructor(
		client: HassApi,
		id: string,
		state: string,
		friendly_name: string
	) {
		super(client, id, friendly_name);
		this._state = state;
	}

	get state() {
		return this._state;
	}
}

export class BinarySensor extends Entity {
	public domain: EntityDomain = EntityDomain.BinarySensor;
	private _triggered: boolean;

	constructor(
		client: HassApi,
		id: string,
		friendly_name: string,
		triggered: boolean
	) {
		super(client, id, friendly_name);
		this._triggered = triggered;
	}

	get triggered() {
		return this._triggered;
	}
}

type CoverAction = "open" | "stop" | "close";
type CoverState = CoverAction & ("open" | "opening" | "closing" | "closed");
export class Cover extends Entity {
	public domain: EntityDomain = EntityDomain.Cover;
	private _state: CoverState;
	private _position: number;

	constructor(
		client: HassApi,
		id: string,
		state: CoverState,
		friendly_name: string,
		position: number
	) {
		super(client, id, friendly_name);
		this._state = state;
		this._position = position;
	}

	get state(): CoverState {
		return this._state;
	}

	set state(value: CoverAction) {
		this.setHA(`${value}_cover`);
	}

	get position(): number {
		return this._position;
	}

	set position(value: number) {
		this.setHA("set_position", {
			position: value
		});
	}
}

type HVACMode = "off" | "cool" | "heat" | "fan_only";
type HVACAction = "off" | "idle" | "cooling" | "heating" | "fan_only";
type FanMode = "low" | "medium" | "high";
export class Climate extends Entity {
	public domain: EntityDomain = EntityDomain.Climate;
	private _state: HVACMode;
	private _current_temperature: number;
	private _fan_mode?: FanMode;
	private _hvac_action?: HVACAction;
	private _temparature?: number;

	constructor(
		client: HassApi,
		id: string,
		state: HVACMode,
		friendly_name: string,
		current_temperature: number,
		fan_mode?: FanMode,
		hvac_action?: HVACAction,
		temperature: number
	) {
		super(client, id, friendly_name);
		this._state = state;
		this._current_temperature = current_temperature;
		this._fan_mode = fan_mode;
		this._hvac_action = hvac_action;
		this._temparature = temperature;
		// this._position = position;
	}

	get state(): HVACMode {
		return this._state;
	}

	set state(value: HVACMode) {
		this.setHA("set_hvac_mode", {
			hvac_mode: value
		});
	}

	get action(): HVACAction | undefined {
		return this._hvac_action;
	}

	get current_temperature(): number {
		return this._current_temperature;
	}

	get fan_mode(): FanMode | undefined {
		return this._fan_mode;
	}

	set fan_mode(value: FanMode | undefined) {
		this.setHA("set_fan_mode", {
			fan_mode: value
		});
	}

	get temperature(): number | undefined {
		return this._temparature;
	}

	set temperature(value: number | undefined) {
		this.setHA("set_temperature", {
			temperature: value
		});
	}

	// set position(value: number) {
	// 	this.setHA("set_position", {
	// 		position: value
	// 	});
	// }
}
