import { Cell } from "./cell.js"
import { Torch, Light, Wire, Repeater } from "./item.js"

class Power {
    constructor(options) {
        this.options = Object.assign({}, {
            columns: 5,
            rows: 5,
            cell_size: 50,
            circle_neigbor: false,
            show_signal: false
        }, options)

        this.cells = []
        this.grid = this.populate_grid()
        this.grid.style.setProperty('grid-template-columns', 'repeat(' + this.options.columns + ', '+ this.options.cell_size+'px)')
        this.grid.style.setProperty('grid-template-rows', 'repeat(' + this.options.rows + ', '+ this.options.cell_size+'px)')
        this.grid.setAttribute('height', this.options.rows * this.options.cell_size)
        this.grid.setAttribute('width', this.options.columns * this.options.cell_size)

        document.addEventListener("keydown", this.keydown_listener.bind(this));
    }

    populate_grid() {
        let grid = document.querySelector('.grid')
        for (let y = 0; y < this.options.columns; y++) {
            for (let x = 0; x < this.options.rows; x++) {
                let item = new Cell({
                    x:x,
                    y:y,
                    callback: this.cell_callback.bind(this)
                })
                grid.appendChild(item.cell)
                this.cells.push(item)
            }
        }
        return grid
    }

    keydown_listener(event) {
            if (this.targeted_cell) {
                console.log(`key=${event.key},code=${event.code}`)
                if (event.key == 1)
                    sandbox.set_cell(this.targeted_cell.options.x, this.targeted_cell.options.y, "Torch")
                else if (event.key == 2)
                    sandbox.set_cell(this.targeted_cell.options.x, this.targeted_cell.options.y, "Wire")
                else if (event.key == 3)
                    sandbox.set_cell(this.targeted_cell.options.x, this.targeted_cell.options.y, "Light")
                else if (event.key == 4)
                    sandbox.set_cell(this.targeted_cell.options.x, this.targeted_cell.options.y, "Empty")
                else if (event.key == 5)
                    sandbox.set_cell(this.targeted_cell.options.x, this.targeted_cell.options.y, "Repeater")
            }

    }

    cell_callback(type, event, cell) {
        this.targeted_cell = cell
    }

    update() {
        this.cells.forEach(cell => {
            cell.update()
        })
    }

    set_cell(x, y, type, signal = undefined) {
        let index = (y*this.options.columns)+x

        this.grid.removeChild(this.cells[index].cell)
        this.cells[index] = null
        if (type == "Torch")
            this.cells.splice(index, 1, new Torch({x: x, y:y, callback: this.cell_callback.bind(this)}))
        else if (type == "Light")
            this.cells.splice(index, 1, new Light({x: x, y:y, callback: this.cell_callback.bind(this)}))
        else if (type == "Wire")
            this.cells.splice(index, 1, new Wire({x: x, y:y, callback: this.cell_callback.bind(this)}))
        else if (type == "Empty") {
            this.cells.splice(index, 1, new Cell({x: x, y:y, callback: this.cell_callback.bind(this)}))
        }
        else if (type == "Repeater")
            this.cells.splice(index, 1, new Repeater({x: x, y:y, callback: this.cell_callback.bind(this)}))

        this.grid.appendChild(this.cells[index].cell)

        if (signal != undefined)
            this.cells[index].SetSignal(signal)
    }

    start() {
        window.setInterval(this.update.bind(this), 100)
    }
}

// Rectangle grid not working
let sandbox = new Power({
    columns: 20,
    rows: 20,
    cell_size: 30,
    circle_neigbor: true,
    show_signal: true
})

sandbox.start()