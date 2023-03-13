import * as PIXI from 'pixi.js';
import { Application, Sprite, Assets } from 'pixi.js';
import anime from 'animejs/lib/anime.es.js';

import TextInput from './text-input';
import VisualizerContext from './VisualizerContext';
import { CustomContainer } from './CustomContainer';


class CustomGraphics extends PIXI.Graphics {
    constructor(identifier: string) {
        super()
        this.identifier = identifier;
       }
       identifier 
  }

class CustomSprite extends PIXI.Sprite {
   
    constructor(texture: any, identifier: string) {
     super(texture)
     this.identifier = identifier;
    }

    identifier
  }

class Visualizer {

    listClicked
    mode = 'builder'
    scrollViewPort : PIXI.Container
    app
    spaceBetweenBubble
    verticalHeight
    contextSet : boolean = false
    currentContext : VisualizerContext
    BACKEND_URL : string
    scale:number =  0.35
    GlobalContainer : PIXI.Container = new PIXI.Container

    constructor(){
      
    
        this.scrollViewPort =  new PIXI.Container()
        this.app = new Application({width:1080, height:1920, backgroundAlpha:0, autoDensity:true});
        this.verticalHeight = 300
        this.GlobalContainer.scale.set(this.scale)
        this.spaceBetweenBubble = 40
        this.listClicked = 0
        switch (this.mode) {
            case 'builder':
                var drgParent = document.getElementById('draggable-children')
                var builderParentEl = document.getElementById('view')

                const dragover_handler = (ev: DragEvent) => {
                    ev.preventDefault();
                    ev.dataTransfer.dropEffect = "move";
                  }

                const drop_handler = (ev: DragEvent, Visualizer: Visualizer) => {
                    ev.preventDefault();
                    // Get the id of the target and add the moved element to the target's DOM
                    const data = JSON.parse(`${ev.dataTransfer.getData("config")}`);
                    const addedContext : VisualizerContext = {
                        type:data.type,
                        message: data.message,
                        children:[],
                        name : data.name,
                        callback: () => {},
                        container:null,
                        id:data.id
                    }

                    this.setContext(addedContext)
                   
                    //ev.target.appendChild(document.getElementById(data));
                  }

                const dragstart_handler = (ev : any) => {

                    ev.dataTransfer.setData("config", ev.target.getAttribute('data-config'));
                    ev.dataTransfer.effectAllowed = "move";
                  }

                drgParent.childNodes.forEach((el: any)=>{
                    el.draggable = true
                    el.ondragstart = (ev:any)=>{
                        dragstart_handler(ev)
                    }
                })
                builderParentEl.ondrop = (ev)=>{
                    drop_handler(ev, this)
                }

                builderParentEl.ondragover = (ev)=>{
                    dragover_handler(ev)
                }

                break;
            case 'inbox':
                this.BACKEND_URL = 'http://localhost:8081'

                navigator.serviceWorker.register('./service-worker.js');
        
                navigator.serviceWorker.ready
                .then(function(registration) {
                
                return registration.pushManager.getSubscription()
                .then(async function(subscription) {
        
                    if (subscription) {
                    return subscription;
                    }
        
                    
                    function urlBase64ToUint8Array(base64String: string) {
                            var padding = '='.repeat((4 - base64String.length % 4) % 4);
                            var base64 = (base64String + padding)
                            .replace(/\-/g, '+')
                            .replace(/_/g, '/');
                        
                            var rawData = window.atob(base64);
                            var outputArray = new Uint8Array(rawData.length);
                        
                            for (var i = 0; i < rawData.length; ++i) {
                            outputArray[i] = rawData.charCodeAt(i);
                            }
                            return outputArray;
                        }
        
                    const response = await fetch(`${this.BACKEND_URL}/vapidPublicKey`);
                    const vapidPublicKey = await response.text();
                    console.log('HERE '+ vapidPublicKey)
                
                    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        
                    return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                    });
                });
                }).then(function(subscription) {
                // Send the subscription details to the server using the Fetch API.
                fetch(`${this.BACKEND_URL}/register`, {
                    method: 'post',
                    headers: {
                    'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                    subscription: subscription
                    }),
                });
        
                });
                break;
            default:
                break;
        } 
    }

    getContext(){
        return this.currentContext
    }

    setContext (context: VisualizerContext, Visualizer : Visualizer = this){
        if(Visualizer.contextSet == true){
          
            Visualizer.scrollViewPort.removeChildren()
            this.currentContext.children.push(context)
            let childCount = 0

            var newChat = Visualizer.createChatBubble({
                buttons:  this.currentContext.children.map((child: VisualizerContext, i : number) =>{
                    childCount = i
                    return {
                        text:child.name,
                    }
                }) ,
                text: this.currentContext.message
            },)

            newChat.y = Visualizer.verticalHeight 
            newChat.x = 120
           
            Visualizer.scrollViewPort.addChild(newChat)
            for (let index = 0; index <= childCount; index++) {
                var childContainer = newChat.children[index+1] as PIXI.Container
                if(this.currentContext.children[index].callback != undefined){
                    childContainer.onpointertap = ()=>{
                        this.currentContext.children[index].callback()
                    }
                }
                this.currentContext.children[index].container = childContainer
              
            }

            this.currentContext.container = newChat

            if( this.currentContext.callback != undefined){
                Visualizer.currentContext.container.interactive = true
                Visualizer.currentContext.container.cursor = 'pointer'
                Visualizer.currentContext.container.onpointertap = () => {
                    this.currentContext.callback()
                }
            }
           

          
        }else {
            switch (context.type) {
                case 'agent.selection':
                    var chat = Visualizer.createChatBubble({
                        buttons:[],
                        text: context.message
                    },)
                    
                    chat.y = Visualizer.verticalHeight 
                    chat.x = 120
                    Visualizer.scrollViewPort.addChild(chat)
                    Visualizer.contextSet = true
                    
                    Visualizer.currentContext = context
                    Visualizer.currentContext.container = chat

                    if(context.callback != undefined){
                        Visualizer.currentContext.container.interactive = true
                        Visualizer.currentContext.container.cursor = 'pointer'
                        Visualizer.currentContext.container.onpointertap = () => {
                            context.callback()
                        }
                    }
                    break;
                case 'agent.text':
                    var chat = Visualizer.createChatBubble({
                        text:"Hello",
                        
                    })
                   
                    chat.y = Visualizer.verticalHeight 
                    chat.x = 120
                    Visualizer.verticalHeight+= chat.height + Visualizer.spaceBetweenBubble
                    Visualizer.scrollViewPort.addChild(chat)
                    break;
            
                default:
                    break;
            }
        }
    }

    editContext (id:string, field:string, value: any) {
        if(id != undefined){
            if(field != undefined){

                switch (field) {
                    case 'message':
                        if (this.currentContext.id == id){
                            this.currentContext.message = value
                            let Text = this.currentContext.container.children[0].children[1] as PIXI.Text
                            Text.text = value
                        } else {
                            var index = this.currentContext.children.findIndex((cx)=> cx.id == id)
                            this.currentContext.children[index].message = value
                        }
                        break;
                    case 'name':
                        if (this.currentContext.id == id){
                            this.currentContext.name = value
                            
                        } else {
                            var index = this.currentContext.children.findIndex((cx)=> cx.id == id)
                            this.currentContext.children[index].name = value
                            console.log('Here is the index '+ index)
                            console.log( this.currentContext.children[index])
                            console.log( this.currentContext.children[index].container.children[1])

                            //The Parent Container is the Button and Text is the 2nd Child hence 1 
                            let Text =  this.currentContext.children[index].container.children[1] as PIXI.Text
                            Text.text = value
                        }
                        break;
                    case 'callback':
                        var index = this.currentContext.children.findIndex((cx)=> cx.id == id)
                        this.currentContext.children[index].name = value
                        //console.log( this.currentContext.children[index].container.children[1])

                        //The Parent Container is the Button and Text is the 2nd Child hence 1 
                        let Button = this.currentContext.children[index].container
                        Button.interactive = true
                        Button.onpointertap = ()=>{
                            value()
                        }
     
                        break;
                    default:
                        break;
                }
               
            }
        }
    }

    createChatBubble = (params: any) => {
            
        var padding = 35
        var id = params.id??'default'
        var edge = 40
        var containerDefaultWidth = 80
        var containerDefaultHeight : number;
        var globalDefaultHeight = 45
        var edgeRadius = 25
        var margin = 40
        var maxButtonWidth = 720
        var buttons = params.buttons??[]
    

        const container = new CustomContainer(id, params)
       

        const listPopUp = (params : any) => {
            const container = new CustomGraphics('list')
            var buttons = params.buttons
            container.beginFill(0xFFFFFF)
            var listHeight = (buttons.length * 140) + 320
            var listY =  this.app.view.height - listHeight

            container.drawRoundedRect(50, listY, this.app.view.width-100, listHeight, 150)
            container.endFill()
        
            var title = new PIXI.Text('options', new PIXI.TextStyle({
                fontSize:40,
                fontWeight:'bold'
            }))
            title.y = listY + 30
            title.x = 50
            title.x += (container.width/2) - (title.width/2)
            container.addChild(title)

            const listItem = (params : any) => {
                var container = new PIXI.Container()
                var title = new PIXI.Text(params.title, new PIXI.TextStyle({
                    fontSize:38,
                    fontWeight:'500',
                    
                }))
                var description = new PIXI.Text(params.description,new PIXI.TextStyle({
                    fontSize:28,
                    fontWeight:'500',
                    fill:0x616161
                }) )
                description.y = 52
                var radio = new PIXI.Graphics()
            
                radio.lineStyle(6)
                radio.drawCircle(0, 0, 20)
                radio.x = this.app.view.width - 325
                radio.y = 35
                var line = new PIXI.Graphics()
                line.lineStyle(1, 0xE0E0E0)
                line.lineTo(800, 0)
                line.y = 104

                container.addChild(title, description, radio, line)
                container.y = listY + 140
                container.y+= (params.i * 124)
                container.x = 130
                return  container

            }

            container.addChild(...buttons.map((button: { text: any; }, i: number)=> {
                return listItem({
                    title:button.text,
                    description:'First description',
                    i:i
                })
            }))
            this.GlobalContainer.addChildAt(container, this.GlobalContainer.children.findIndex((child : any) => child.identifier == 'frame'))
            const locked = container.height
            console.log('Initial value of y ' + container.y)
            var target = {
                y:-500,
                height:0
            }

            anime({
                targets:target,
                easing: 'spring(1, 80, 10, 0)',
                y:0,
                update:() => {
                    this.app.ticker.addOnce(()=>{
                        container.position.y = target.y
                    })
                }
            })

        }   

        const createChat = (params : any) => {
            const style = new PIXI.TextStyle({
                fontSize:40,
                wordWrap:true,
                wordWrapWidth:680
            })
            var button = params.button
            var buttonHeight = 0
            button != undefined ? buttonHeight = 95 : buttonHeight = 0
            var chat = new PIXI.Graphics()
            var text = new PIXI.Text(params.text, style)
            var container = new PIXI.Container()
            var bounds = text.getBounds()
            containerDefaultHeight = globalDefaultHeight + bounds.height + buttonHeight
            buttons.length > 0 ? containerDefaultWidth = maxButtonWidth :
            containerDefaultWidth+=bounds.width + 200
            text.x = edge + padding
            text.y = padding
            chat.lineStyle(2, 0xFFFFFF, 1);
            chat.beginFill(0xFFFFFF)
            chat.moveTo(0, 0)
            chat.lineTo(containerDefaultWidth, 0)
            chat.arcTo(containerDefaultWidth+edgeRadius, 10, containerDefaultWidth+edgeRadius, 20, edgeRadius)
            //height
            chat.lineTo(containerDefaultWidth+edgeRadius, containerDefaultHeight)
            chat.arcTo(containerDefaultWidth+edgeRadius, containerDefaultHeight+edgeRadius, containerDefaultWidth, containerDefaultHeight+edgeRadius, edgeRadius)
        
            chat.lineTo(70, containerDefaultHeight + edgeRadius)
            chat.arcTo(edge, containerDefaultHeight + edgeRadius, edge, containerDefaultHeight, edgeRadius)
        
            //chat tip
            chat.lineTo(40, 50)
            chat.lineTo(0, 0)
            chat.endFill()

            container.addChild(chat)
            container.addChild(text)
            if(button){
                var line = new PIXI.Graphics()

                line.lineStyle(1, 0xBDBDBD)
                line.lineTo(containerDefaultWidth - 10, 0)
                line.y = text.y + text.height + 25
                line.x = 40
                container.addChild(line)

                const buttonStyle = new PIXI.TextStyle({
                    fontSize:38,
                    fill:'#2196F3'
                })

                var listText = new PIXI.Text('View Options', buttonStyle)
                listText.y = line.y + line.height + 20
                listText.x+=70
                
                const iconTexture = PIXI.Sprite.from('https://storage.googleapis.com/otarkie-pay-dev.appspot.com/cdn/menu.png')
                iconTexture.y =  line.y + line.height + 10
                var scale = 0.3
                iconTexture.scale.x = scale
                iconTexture.scale.y = scale
                const buttonContainer = new PIXI.Container()
                buttonContainer
                buttonContainer.addChild(listText, iconTexture)
                buttonContainer.x = 30
                buttonContainer.x = (containerDefaultWidth/2) - (buttonContainer.width/2)
                buttonContainer.interactive = true
                buttonContainer.cursor = 'pointer'
                buttonContainer.onpointerdown = () => {
                    
                    console.log(this.listClicked)
                    if (this.listClicked == 0){
                        console.log('CALLED')
                        listPopUp({buttons:buttons})
                        this.listClicked = 1
                    } else {
                        this.GlobalContainer.removeChildAt(this.GlobalContainer.children.findIndex((child : any) => child.identifier == 'list'))
                        this.listClicked = 0
                    }
                    
                }
                container.addChild(buttonContainer)

            }
        
            return container
        }
        
        const createButton = (params: any) => {
            var button = new PIXI.Graphics()
            var width = params.width
            var text = params.text
            
            const buttonStyle = new PIXI.TextStyle({
                fontSize:40,
                fill:'#2196F3'
            })

            var buttonText = new PIXI.Text(text, buttonStyle)
            var buttonBounds = buttonText.getBounds()
        
            button.beginFill(0xFFFFFF)
            button.drawRoundedRect(40, containerDefaultHeight + margin, width, 100, 25)
            button.endFill()
        
            var bB = button.getBounds()
            buttonText.x = (bB.width/2) - (buttonBounds.width)/2 + 25
            buttonText.y = bB.y + (bB.height)/2 - 25

            var container = new PIXI.Container()
            container.addChild(button)
            container.addChild(buttonText)
            container.interactive = true
            container.onpointertap = (event)=> {

                switch (this.mode) {
                    case 'inbox':
                        var chat = this.createChatBubble({
                            text:text,
                            type:'reply'
                        })
        
                        chat.y = this.verticalHeight 
                        chat.x = 120
                        this.verticalHeight+= chat.height + this.spaceBetweenBubble
                        this.scrollViewPort.addChild(chat)
                        break;
                
                    default:
                        break;
                }

                


            }

            container.cursor = 'pointer'
            return container
        }

        const chatReplyBubble = (params: any) => {
            var chat = new PIXI.Graphics()
            var text = new PIXI.Text(params.text, new PIXI.TextStyle({
                fontSize:40,
                wordWrap:true,
                wordWrapWidth:660
            }))
            var containerDefaultWidth = 80
            var container = new PIXI.Container()
            var bounds = text.getBounds()
            var buttonHeight = 0
            button != undefined ? buttonHeight = 95 : buttonHeight = 0
            var containerDefaultHeight = globalDefaultHeight + bounds.height + buttonHeight
            containerDefaultWidth+=bounds.width + 20
            text.x = edge 
            text.y = padding
        
            chat.beginFill(0xE7FEE3)
            chat.moveTo(edgeRadius, 0)
            chat.lineTo(containerDefaultWidth + 20, 0)
            chat.lineTo(containerDefaultWidth - 20, 40)
            chat.lineTo(containerDefaultWidth - 20, containerDefaultHeight)
            chat.arcTo(containerDefaultWidth - 20, containerDefaultHeight+edgeRadius, containerDefaultWidth - 40, containerDefaultHeight+edgeRadius, edgeRadius)
            chat.lineTo(edgeRadius, containerDefaultHeight+edgeRadius)
            chat.arcTo(0, containerDefaultHeight+edgeRadius, 0, containerDefaultHeight - edgeRadius, edgeRadius)
            chat.lineTo(0, containerDefaultHeight - edgeRadius)
            chat.arcTo(0, 0, edgeRadius, 0, edgeRadius)

        
            container.addChild(chat)
            container.addChild(text)

            container.x = this.app.view.width - (container.width + 250)
            return container
        }

        
        switch (params.type) {
            case 'reply':
            var chat = chatReplyBubble(
                {
                    text:params.text
                }
            )
                break;
                
            default:

                var chat = createChat({
                    text:params.text
                })
                break;
        }  

        switch (buttons.length) {
            case 0:
                container.addChild(chat)
                break;
            case 1:
                var button = createButton({
                    width:maxButtonWidth,
                    text:buttons[0].text
                })
               
                container.addChild(chat, button)
                break;
            case 2:
                var button1 = createButton({
                    width:(maxButtonWidth/2) - 5,
                    text:buttons[0].text
                })
                var button2 = createButton({
                    width:(maxButtonWidth/2) - 5,
                    text:buttons[1].text
                })
                button2.x+= maxButtonWidth/2
              
                container.addChild(chat, button1, button2)
                break;
            case 3:
                var button1 = createButton({
                    width:(maxButtonWidth/2) - 5,
                    text:buttons[0].text
                })
                var button2 = createButton({
                    width:(maxButtonWidth/2) - 5,
                    text:buttons[1].text
                })
                var button2 = createButton({
                    width:(maxButtonWidth/2) - 5,
                    text:buttons[1].text
                })
                button2.x+= maxButtonWidth/2

                var button3 = createButton({
                    width:(maxButtonWidth),
                    text:buttons[2].text
                })
            
                button3.y += button2.getBounds().height + 10

                container.addChild(chat, button1, button2, button3)
                
                break;
            default:
            var chat = createChat({
                    text:params.text,
                    button:'View Options'
                })
            container.addChild(chat)
                
                break;
        }

        return container
    
    } 

    attach() {
        
        var parent = document.getElementById('view') 
        var p = this.app.view as HTMLCanvasElement
        parent.appendChild(p)
       
        var backgroundTexture = PIXI.Texture.from('https://storage.googleapis.com/otarkie-pay-dev.appspot.com/cdn/ZWbv3h.jpg');
        var background = new Sprite(backgroundTexture)
        background.width = this.app.view.width - 100
        background.height = this.app.view.height
        background.x+=50
        var mask = new PIXI.Graphics()
        mask.beginFill()
        mask.drawRoundedRect(0, 0, this.app.view.width,this.app.view.height, 100)
        mask.endFill();
        background.mask = mask
        background.alpha = 0.2

        var frameTexture = PIXI.Texture.from('https://storage.googleapis.com/otarkie-pay-dev.appspot.com/cdn/iphone.png')
        var frame = new CustomSprite(frameTexture, 'frame')
        frame.width = this.app.view.width
        frame.height = this.app.view.height

        var backgroundColor = new PIXI.Graphics()
        backgroundColor.beginFill(0xE5DDD5)
        backgroundColor.drawRoundedRect(50, 0, this.app.view.width - 100,this.app.view.height, 250)
        backgroundColor.endFill()

        
        this.GlobalContainer.addChild(backgroundColor)
        this.GlobalContainer.addChild(background)


        const scrollController = ()=>{
            
        
            this.GlobalContainer.hitArea = this.app.screen;
        
            // Make the slider
            const sliderWidth = 20;
            const sliderHeight = this.app.view.height - 400
            console.log(sliderHeight)
            const slider = new PIXI.Graphics()
                .beginFill(0xFAFAFA)
                .drawRect(0, 0, 0.1, sliderHeight);
            
            slider.x = this.app.view.width - 130;
            slider.y = 200

            const scrollBar = () => {
                var bar = new PIXI.Graphics()
                var height = ((this.app.view.height) / (this.scrollViewPort.height + 800)) * sliderHeight
                console.log(height)
                var position = 200
                bar.beginFill(0x616161)
                bar.drawRoundedRect(0, 0, 30, height, 25)
                bar.endFill()

                bar.alpha = 0.7
        
                bar.interactive = true
                bar.cursor = 'pointer'
        
                return bar
                
            }

            
            // Draw the handle
            const handle = scrollBar()
            handle.x = sliderWidth / 2;
            handle.interactive = true;
            handle.cursor = 'pointer'
        
            background.interactive = true;
            background.addEventListener('touchmove', onDrag);
            
            handle
                .on('pointerdown', onDragStart)
                .on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd);
        
            function onDragStart() {
                this.GlobalContainer.interactive = true;
                this.GlobalContainer.addEventListener('pointermove', onDrag);
            }
            
            // Stop dragging feedback once the handle is released.
            function onDragEnd(e: any) {
                this.GlobalContainer.interactive = false;
                this.GlobalContainer.removeEventListener('pointermove', onDrag);
            }
            
        
            function onDrag(e: any) {
                const handleHeight = handle.height;
                // Set handle y-position to match pointer, clamped to (4, screen.height - 4).
                
                var pointerY = slider.toLocal(e.global).y
                handle.y = Math.max(0, Math.min(
                    pointerY,
                    sliderHeight - handleHeight,
                ));
        
                this.scrollViewPort.y =  - Math.abs(Math.max(0, Math.min(
                    pointerY,
                    sliderHeight - handleHeight,
                )) * (0.9)
            ) 
            }
            
            if(this.scrollViewPort.height + 400 > this.app.view.height){
                slider.addChild(handle);
                this.GlobalContainer.addChild(slider);
            }
        
        
        }

        var chats = []
    
        // this.scrollViewPort.addChild(...chats.map((config) => {
        //     var chat = this.createChatBubble(config)
        //     chat.y = this.verticalHeight 
        //     chat.x = 120
        //     this.verticalHeight+= chat.height + this.spaceBetweenBubble

        //     return chat
        // }))

        scrollController()

        var input = new TextInput({
            input: {
                fontSize: '40px',
                paddingLeft:'42px',
                padding: '36px',
                width: '630px',
                color: '#26272E'
            },
            box: {
                default: {fill: 0xffffff, rounded: 100, stroke: {color: 0xE0E0E0, width: 4}},
                focused: {fill: 0xffffff, rounded: 100, stroke: {color: 0xABAFC6, width: 3}},
                disabled: {fill: 0xDBDBDB, rounded: 100}
            }
        })

        var sendButton = new PIXI.Container()
        var buttonCircle = new PIXI.Graphics()

        var sendIcon = PIXI.Sprite.from('https://storage.googleapis.com/otarkie-pay-dev.appspot.com/cdn/send.png')
        sendIcon.scale.x = 0.34
        sendIcon.scale.y = 0.34

        buttonCircle.beginFill(0x02A884)
        buttonCircle.drawCircle( 0, 0, 60)
        buttonCircle.endFill()
        sendButton.addChild(buttonCircle, sendIcon)
        sendButton.x = this.app.view.width - 180
        sendButton.y = this.app.view.height - 150
        sendButton.interactive = true
        sendButton.cursor = 'pointer'

        sendButton.onpointertap = () =>{
            if(input.text.length > 0){
               
                switch (this.mode) {
                    case 'inbox':
                        var chat = this.createChatBubble({
                            text:input.text,
                            type:'reply'
                        })
                
                        chat.y = this.verticalHeight 
                        chat.x = 120
                        this.verticalHeight+= chat.height + this.spaceBetweenBubble
                        this.scrollViewPort.addChild(chat)
        
                        const payload = input.text;
                        const delay = 5;
                        const ttl = 5;
                        
                        fetch(`${this.BACKEND_URL}/sendNotification`, {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            payload: payload,
                            delay: delay,
                            ttl: ttl,
                        }),
                        });
                        break;
                
                    default:
                        break;
                }
                //this.editContext("xx", "name", input.text)
                //this.editContext("xx", "callback", ()=> { alert("Hey there")})
                input.text = ''
            
            }
        
        }
        
        sendIcon.x  = -32
        sendIcon.y = -32
        //this.GlobalContainer.addChild(sendIcon)
        input.placeholder = 'Message'
        input.x = 480
        input.y = this.app.view.height - 150
        input.pivot.x = input.width/2
        input.pivot.y = input.height/2
        
        this.GlobalContainer.addChild(this.scrollViewPort)
        this.GlobalContainer.addChild(sendButton)
        this.GlobalContainer.addChild(input)

        this.GlobalContainer.addChild(frame)
        this.app.stage.addChild(this.GlobalContainer)
        
        navigator.serviceWorker.addEventListener('message', (event)=>{
            var data = event.data
            
            console.log('Message received '+ event.data.message)
            var chat = this.createChatBubble({
                buttons:[{text:'Looks good'}, {text:'Not for me'}, {text:'Muchachos'}],
                text: event.data.message
            })
            chat.y = this.verticalHeight 
            chat.x = 120
            this.verticalHeight+= chat.height + this.spaceBetweenBubble
            this.scrollViewPort.addChild(chat)
        })

    }

}

export default Visualizer