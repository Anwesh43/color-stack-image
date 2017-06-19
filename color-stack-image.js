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
