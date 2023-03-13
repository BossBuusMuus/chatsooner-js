import * as PIXI from 'pixi.js';
export default interface VisualizerContext {
    type: string,
    children: Array<VisualizerContext>,
    message:string,
    name:string,
    container : PIXI.Container,
    callback: () => void,
    id:string
}