import * as PIXI from "pixi.js";

export const createPixiApp = () => {
    const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
    app.stage.x = window.innerWidth / 2
    app.stage.y = window.innerHeight / 2

    document.body.appendChild(app.view)

    const lineTop = new PIXI.Graphics()
    lineTop.lineStyle(1, 0xAA0000, 1)
    lineTop.moveTo(0, -100)
    lineTop.lineTo(0, 100)
    app.stage.addChild(lineTop)

    const lineGor = new PIXI.Graphics()
    lineGor.lineStyle(1, 0xAA0000, 1)
    lineGor.moveTo(-100, 0)
    lineGor.lineTo(100, 0)
    app.stage.addChild(lineGor)


    window.onresize = () => {
        app.width = window.innerWidth
        app.height = window.innerHeight
        app.stage.x = window.innerWidth / 2
        app.stage.y = window.innerHeight / 2
    }

    return {
        add: item => {
            app.stage.addChild(item)
        }
    }
}

