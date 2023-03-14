# Chatsooner-JS

The official Chatsooner Javascript package is here!

## Get Started

1. Run `npm install chatsooner` in your terminal

## Quick Start

2. 

```

import Visualizer from 'chatsooner'

interface VisualizerContext {
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
```


Subsequent calls to 

``` 
visualizer.setContext(context) 
```

creates children on the first `setContext(context)`

To get the current context call `getContext()`

