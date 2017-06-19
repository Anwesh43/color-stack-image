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
        canvas.width = w
        canvas.height = h
        if(!this.colorStackContainer && this.colors.length>0) {
            this.colorStackContainer = new ColorStackContainer(this,this.colors,w,h)
        }
        const context = canvas.getContext('2d')
        context.clearRect(0,0,w,h)
        context.drawImage(this.img,0,0)
        this.colorStackContainer.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.img.src = this.src
        this.img.onload = () => {
            this.render()
        }
        this.img.onmousedown = (event) => {
            if(this.colorStackContainer) {
                this.colorStackContainer.startMoving()
            }
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
        context.fillStyle = this.color
        context.globalAlpha = 0.5
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
            console.log(this.w)
        }
    }
    stopped() {
        return this.dir == 0
    }
}
class ColorStackContainer {
    constructor(component,colors,w,h) {
        this.component = component
        this.initColorStacks(colors,w,h)
        this.index = 0
        this.dir = 1
        this.maxIndex = colors.length
        this.isAnimating = false
    }
    initColorStacks(colors,w,h) {
      var gapY = (h/colors.length),y = h
      this.colorstacks = colors.map((color)=>{
          y = y - gapY
          return new ColorStack(color,y,w,gapY)
      })
    }
    draw(context) {
        this.colorstacks.forEach((colorstack)=>{
            colorstack.draw(context)
        })
    }
    startMoving() {
        if(this.isAnimating == false) {
            this.colorstacks[this.index].startMoving(this.dir)
            const currColorStack = this.colorstacks[this.index]
            this.isAnimating = true
            const interval = setInterval(()=>{

                console.log(this.dir)
                this.component.render()
                currColorStack.update()
                if(currColorStack.stopped()  == true) {
                    clearInterval(interval)
                    this.isAnimating = false
                    this.index += this.dir
                    if(this.index == this.maxIndex) {
                        this.index = this.maxIndex -1
                        this.dir = -1
                        console.log(this.dir)
                    }
                    if(this.index == -1)  {
                        this.dir = 1
                        this.index = 0
                    }
                }
            },50)
        }
    }
}
customElements.define('color-stack-image',ColorStackImageComponent)
