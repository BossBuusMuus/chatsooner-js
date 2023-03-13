
import * as PIXI from 'pixi.js';

/**
 * This a close copy to a typical Chatsooner bot form.
 * @field type: Any of the acceptable form types
 * @field message: The message to be displayed
 * @field name: This is the name of the form and also the display value
 * of a button
 * @field callback: The callback you want to be executed when a user clicks this view
 * on the builder
 * @field id: unique value to be referenced in setContext
 */

export declare interface VisualizerContext {
    type: string,
    children: Array<VisualizerContext>,
    message:string,
    name:string,
    container : PIXI.Container,
    callback: () => void,
    id:string
}