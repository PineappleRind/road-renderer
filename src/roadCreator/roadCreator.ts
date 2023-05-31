import type { Constructor, Data, Events } from "./types";
import * as events from "./events";

export default class RoadCreator {
    events: Events;
    data: Data;
    constructor({ canvas, ctx }: Constructor) {
        this.data = { roads: [] };
        this.events = events as Events;
        
    }
}