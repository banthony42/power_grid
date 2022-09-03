
let GRID_ROW = 5
let GRID_COL = 5

function createElemWithAttribute(element, attribute, value ) {
    let new_element = document.createElement(element)
    new_element.setAttribute(attribute, value)
    return new_element
}

class Cell {

    constructor(x, y, signal_max, show_signal=false) {
        this.cell = createElemWithAttribute('div', 'class', 'cell')
        this.cell.setAttribute('cell_y', y)
        this.cell.setAttribute('cell_x', x)
        this.x = x
        this.y = y
        this.show_signal = show_signal
        this.cell.style.gridColumn = x +1
        this.cell.style.gridRow = y + 1
        this.cell.addEventListener("mouseover", this.CellMouseHover.bind(this));
        this.cell.addEventListener("mouseleave", this.CellMouseLeave.bind(this));

        this.SetSignal(0)
        this.signal_max = signal_max
    }

    CellMouseHover(event) {
        this.SetSignal(this.signal_max)
    }

    CellMouseLeave(event) {
        this.SetSignal(0)
    }

    SetSignal(signal) {
        this.cell.setAttribute('signal', signal)
        this.signal = signal
    }

    update() {
        let signal = this.cell.getAttribute('signal')
        if (signal > 0) {
            this.cell.style.backgroundColor = 'rgb(' + 255 * (signal) / this.signal_max + ',' + 0 + ',' + 0 + ')'
            if (this.show_signal)
                this.cell.innerHTML=signal 
        }
        else {
            this.cell.innerHTML= ""
            this.cell.style.backgroundColor = 'transparent'
        }
    }
}

class Power {
    constructor(options) {
        this.options = Object.assign({}, {
            columns: 5,
            rows: 5,
            signal_max: 2,
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
    }

    populate_grid() {
        let grid = document.querySelector('.grid')
        for (let y = 0; y < this.options.columns; y++) {
            for (let x = 0; x < this.options.rows; x++) {
                let item = new Cell(x, y, this.options.signal_max, this.options.show_signal)
                grid.appendChild(item.cell)
                this.cells.push(item)
            }
        }
        return grid
    }

    power_up(x, y) {
        // not compatible with rectangle grid
        this.cells[(y*this.options.columns)+x].SetSignal(this.options.signal_max)
    }

    is_neighbor(cell_a, cell_b) {

        if (this.options.circle_neigbor)
        {
            let delta = Math.pow(cell_b.x - cell_a.x, 2) + Math.pow(cell_b.y - cell_a.y, 2)
            if (delta < Math.pow(this.options.signal_max, 2))
                return Math.round(Math.sqrt(delta));
        }

        for (let i = 1 ; i < this.options.signal_max ; i++) {  
            if (cell_a.x + i == cell_b.x && cell_a.y == cell_b.y)
                return i;
            if (cell_a.x - i == cell_b.x && cell_a.y == cell_b.y)
                return i;
            if (cell_a.x == cell_b.x && cell_a.y + i == cell_b.y)
                return i;
            if (cell_a.x == cell_b.x && cell_a.y - i == cell_b.y)
                return i;
        }
        return 0;
    }

    update() {
        let targeted_cell = this.cells.filter(cell => cell.signal == this.options.signal_max)

        this.cells.forEach(cell => {
            if (targeted_cell && targeted_cell.length > 0) {
                if (! (targeted_cell[0].x == cell.x && targeted_cell[0].y == cell.y)) {
                    let offset = this.is_neighbor(targeted_cell[0], cell)
                    if (offset > 0)
                        cell.cell.setAttribute('signal', targeted_cell[0].signal - offset)
                    else
                        cell.cell.setAttribute('signal', 0)
                }
            }
            else
                cell.cell.setAttribute('signal', 0)

            cell.update()
        })
    }

    start() {
        window.setInterval(this.update.bind(this), 50)
    }
}

// Rectangle grid not working
let sandbox = new Power({
    columns: 20,
    rows: 20,
    signal_max: 7,
    cell_size: 35,
    circle_neigbor: true,
    show_signal: true
})

sandbox.start()

// Bug when moving the mouse
// sandbox.power_up(19, 2)