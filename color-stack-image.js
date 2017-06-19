class ColorStackImageComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
        const children = this.children
        this.initColors(children)
    }
    initColors(children) {
        this.colors = []
        this.y = 0
        for(var i=0;i<children.length;i++) {
            const child = children[i]
            this.colors.push(child.innerHTML)
        }
    }
    render() {
        const w = this.img.width,h = this.img.height
        const canvas = document.createElement('canvas')
        if(!this.colorstacks && this.colors.length > 0) {
            var gapY = (h/this.colors.length),y = h+gapY
            this.colorstacks = this.colors.map((color)=>{
                y = y - gapY
                return new ColorStack(color,y,w,gapY)
            })
        }
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.drawImage(this.img,0,0)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.img.src = this.src
        this.img.onload = () => {
            this.render()
        }
    }
}
class ColorStack {
    constructor(color,y,w,h) {
        this.color = color
        this.dir = 0
        this.w = 0
        this.y = y
        this.h = h
        this.maxW = w
    }
    draw(context) {
        context.save()
        context.globalAlpha = 0.5
        context.fillStyle = this.color
        context.fillRect(0,this.y,this.w,this.h)
        context.restore()
    }
    startMoving(dir) {
        this.dir = dir
    }
    update() {
        this.w += (this.maxW/5)*(this.dir)
        if(this.w > this.maxW) {
            this.dir = 0
            this.w = this.maxW
        }
        if(this.w < 0) {
            this.dir = 0
            this.w = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
}
