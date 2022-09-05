import { Cell } from "./cell.js"


let SIGNAL_MAX = 7

export class Light extends Cell {
    constructor(options) {
        super(options)
    }

    display() {
        if (this.signal > 0)
            this.cell.style.backgroundImage  = 'url(./img/lamp_on.png)'
        else
            this.cell.style.backgroundImage  = 'url(./img/lamp_off.png)'
    }

    update() {
        let adjacent_selectors = [ 
            `div[cell_x="${this.options.x}"][cell_y="${this.options.y+1}"]`,
            `div[cell_x="${this.options.x}"][cell_y="${this.options.y-1}"]`,
            `div[cell_x="${this.options.x-1}"][cell_y="${this.options.y}"]`,
            `div[cell_x="${this.options.x+1}"][cell_y="${this.options.y}"]`
        ]

        let find_signal = false
        adjacent_selectors.forEach(selector => {
            let adjacent_cell = document.querySelector(selector)
            if (adjacent_cell) {
                let adjacent_signal = adjacent_cell.getAttribute('signal')
                if (adjacent_signal > 0)
                    find_signal = true
            }
        });


        if (find_signal)
        this.SetSignal(1)
    else
        this.SetSignal(0)

        this.display()
    }
}

export class Wire extends Cell {
    constructor(options) {
        super(options)
    }

    display() {
        this.cell.style.backgroundColor = 'rgb(' + 255 * (this.signal) / SIGNAL_MAX + ',' + 0 + ',' + 0 + ')'
        this.cell.innerHTML=this.signal 
    }

    update() {
        let adjacent_selectors = [ 
            `div[cell_x="${this.options.x}"][cell_y="${this.options.y+1}"]`,
            `div[cell_x="${this.options.x}"][cell_y="${this.options.y-1}"]`,
            `div[cell_x="${this.options.x-1}"][cell_y="${this.options.y}"]`,
            `div[cell_x="${this.options.x+1}"][cell_y="${this.options.y}"]`
        ]

        let find_source = false
        adjacent_selectors.forEach(selector => {
            let adjacent_cell = document.querySelector(selector)


            if (adjacent_cell) {
                let adjacent_signal = adjacent_cell.getAttribute('signal')
                if (adjacent_signal > 0 && adjacent_signal > this.signal) {
                    this.SetSignal(adjacent_signal - 1)
                }
                if (adjacent_signal > this.signal)
                    find_source = true
            }
        });

        if (find_source == false)
            this.SetSignal(0)

        this.display()
    }
}

export class Torch extends Cell {
    constructor(options) {
        super(options)
        this.SetSignal(SIGNAL_MAX)
        this.uid = Date.now()
        console.log(this.uid)
    }

    display() {
        this.cell.style.backgroundImage  = 'url(./img/torch_on.png)'
    }

}