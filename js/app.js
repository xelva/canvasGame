const { Engine, Render, Runner, World, Bodies, } = Matter;

const width = 600;
const height = 600;
const cells = 3;


const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width: width,
        height: height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);



// walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 40, {isStatic: true}),
    Bodies.rectangle(width / 2, height, width, 40, {isStatic: true}),
    Bodies.rectangle(0, height / 2, 40, height, {isStatic: true}),
    Bodies.rectangle(width, height / 2, 40, height, {isStatic: true})
];
World.add(world, walls);

// maze generation
const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter --;
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
}
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
console.log(grid);

const vertical = Array(cells).fill(null).map(() => Array(cells-1).fill(false));


const horizontal = Array(cells-1).fill(null).map(() => Array(cells).fill(false));


const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

console.log(startRow, startColumn);

const stepThroughCell = (row, column) => {
    //if I have visited the cell at (row, column), then return early
    if (grid[row][column]){
        return;
    }

    //mark this cell as being visited 
    grid[row][column] = true;

    //assemble randomly ordered list of neighbors
    const neighbors = shuffle([
        [row - 1, column],
        [row, column + 1],
        [row + 1, column],
        [row, column - 1]
    ]);
    console.log(neighbors);
  

    //for each neighbor...

    //see if neighbor is out of bounds

    //check if we've visited neighbor

    //pick a random cell that hasn't been visited remove wall from vert or horizontal

    //move to new cell
};

//stepThroughCell(startRow, startColumn);
stepThroughCell(1, 1);