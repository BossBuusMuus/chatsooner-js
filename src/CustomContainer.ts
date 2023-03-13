import * as PIXI from 'pixi.js';
export class CustomContainer extends PIXI.Container {
    constructor(identifier: string, configuaration: Object) {
        super()
        this.identifier = identifier;
        this.configuaration = configuaration
       }
   
       identifier
       configuaration
}