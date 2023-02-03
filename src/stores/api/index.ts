import hass, { type HassApi } from "homeassistant-ws";
import {
	Entity,
	type EventHandler,
	type KeyedArray,
	type Message,
	type EntityState,
	EntityDomain
} from "./types";

export class API {
	private protocol: "ws" | "wss";
	private host: string;
	private port: number;
	private token: string;

	private eventHandler?: EventHandler;
	private _entities?: KeyedArray<Entity>;

	get entities(): KeyedArray<Entity> | undefined {
		return this._entities;
	}
	set entities(value: KeyedArray<Entity> | undefined) {
		if (this.eventHandler !== undefined) this.eventHandler(value!);
		this._entities = value;
	}

	constructor(
		protocol: "ws" | "wss",
		host: string,
		port: number,
		token: string
	) {
		this.protocol = protocol;
		this.host = host;
		this.port = port;
		this.token = token;
	}

	public initSockets() {
		hass({
			protocol: this.protocol,
			host: this.host,
			port: this.port,
			token: this.token
		}).then(this.initLogic.bind(this));
	}

	public entityUpdateHandler(e: Entity) {
		if (this.eventHandler !== undefined)
			this.eventHandler(this._entities!, e);
	}

	private initLogic(client: HassApi) {
		client.on("message", (msg: Message) => {
			switch (msg.type) {
				case "result": {
					if (this.entities != null) return;
					const r: [EntityState] = msg.result!;

					const entObj: KeyedArray<Entity> = {};

					r.forEach((e) => {
						const attrs = Object.entries(e.attributes).filter(
							([key]) =>
								[
									"friendly_name",
									"brightness",
									"percentage",
									"current_position",
									"current_temperature",
									"fan_mode",
									"hvac_action",
									"temperature"
								].indexOf(key) !== -1
						);

						if (e.entity_id.split(".")[0] == "climate")
							console.log(e);
						entObj[e.entity_id] = Entity.register(
							this.entityUpdateHandler.bind(this),
							e.entity_id.split(".")[0] as EntityDomain,
							...[
								client,
								e.entity_id.split(".")[1],
								e.state
							].concat(
								Object.values(
									Object.fromEntries([
										...attrs.filter(
											([key]) => key == "friendly_name"
										),
										...attrs.filter(
											([key]) => key != "friendly_name"
										)
									])
								)
							)
						);
					});

					this.entities = entObj;
					break;
				}
				case "event": {
					const e = msg.event!;

					if (e.event_type !== "state_changed") return;

					if (this.entities == null) return;

					const nState = e.data.new_state;
					this.entities[e.data.entity_id].update({
						on: nState.state == "on",
						...nState.attributes
					});

					break;
				}
			}
		});
		client.getStates();
	}

	public setHandler(handler: EventHandler) {
		this.eventHandler = handler;
	}
}
