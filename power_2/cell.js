import { createElemWithAttribute } from './utils.js'

export class Cell {

    constructor(options) {
        this.options = Object.assign({}, {
            x: 0,
            y: 0,
            callback: undefined,
            show_signal: false
        }, options)
        this.cell = createElemWithAttribute('div', 'class', 'cell')
        this.cell.setAttribute('cell_y', this.options.y)
        this.cell.setAttribute('cell_x', this.options.x)
        this.cell.style.gridColumn = this.options.x + 1
        this.cell.style.gridRow = this.options.y + 1
        this.SetSignal(0)
        this.cell.addEventListener("mouseover", this.CellMouseHover.bind(this));
        this.cell.addEventListener("mouseleave", this.CellMouseLeave.bind(this));
    }

    CellMouseHover(event) {
        this.cell.style.borderColor = 'white'
        if (this.options.callback)
            this.options.callback("hover", event, this)
    }

    CellMouseLeave(event) {
        this.cell.style.borderColor = 'black'
        if (this.options.callback)
            this.options.callback("leave", event, this)
    }

    SetSignal(signal) {
        this.cell.setAttribute('signal', signal)
        this.signal = signal
    }

    display() {
        // implement in son
    }


    update() {
        this.display()
    }
}