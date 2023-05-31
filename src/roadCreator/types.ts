export type Events = {
    onmousedown: MouseEvent,
    onmouseup: MouseEvent,
    onmousemove: MouseEvent,
    onclick: MouseEvent,
}

export type Constructor = {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}

export type Data = {
    roads: Road[];
}

export type Road = {
    from: [number, number];
    to: [number, number];
    curve?: [number, number];
}