import * as PIXI from 'pixi.js';
import { ICanvas } from 'pixi.js';
import anime from 'animejs/lib/anime.es.js';
import VisualizerContext from './VisualizerContext';
import TextInput from './text-input';
import { CustomContainer } from './CustomContainer';




/**
 * Visualizer version 0.10. This class is meant to allow frontend developers to
 * focus on their applications logic without having to worry about constraining backend logic.
 * One of the most important concepts to is that of the VisualizerContext, which how you set 
 * @example
 * interface VisualizerContext {
    type: string,
    children: Array<VisualizerContext>,
    message:string,
    name:string,
    container : PIXI.Container,
    callback: () => void,
    id:string
}
 */
export declare class Visualizer {

    listClicked : boolean
    mode : string
    scrollViewPort : PIXI.Container
    app : ICanvas
    spaceBetweenBubble : number
    verticalHeight : number
    contextSet : boolean
    currentContext : VisualizerContext
    BACKEND_URL : string
    scale: number

    /**
     * 
     * @param context 
       @param Visualizer 
     * 
     * This is how you set the view on the visualizer when it is in the "builder" mode.
     * The most important thing to note is the Visualizer context which is the required
     * when calling this method
       @see VisualizerContext 
     * @example
        * interface VisualizerContext {
            type: string,
            children: Array<VisualizerContext>,
            message:string,
            name:string,
            container : PIXI.Container,
            callback: () => void,
            id:string
        }
        var visualizer = new Visualizer()
        visualizer.attach()

        const context : VisualizerContext = {
            id:'Les go',
            name:'Bonjour',
            message:'Esa vu bleau',
            callback:()=>{
                alert('Its sorted')
            },
            type:'agent.selection',
            children:[]
        }
        visualizer.setContext(context)
        //Subsequent calls to visualizer.setContext()
        //creates the children of the of the parent context which is the
        //first call to setContext. The below code works in Vanilla JS
        visualizer.setContext({
            id:'Les go 2',
            name:'Bonjour 2',
            message:'Esa vu bleau 2',
            callback:()=>{
                alert('Its sorted')
            },
            type:'agent.selection',
            children:[]
        })
     
     */
    setContext(context: VisualizerContext, Visualizer?: Visualizer) : void

    /**
     * 
     * @param id 
     * @param field 
     * @param value 
     * 
     * value can be a string or function
     */
    
    editContext(id: string, field:string, value: any) : void

    getContext() : VisualizerContext

    createChatBubble(params: any) : CustomContainer

    /**
     * Attachs view to the DOM
     */
    attach() : void
}