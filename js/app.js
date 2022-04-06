const { Engine, Render, Runner, World, Bodies, Body, Events} = Matter;

const width = window.innerWidth;
const height = window.innerHeight;

const cellsHorizontal = 5;
const cellsVertical = 5;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;



const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: width,
        height: height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);



// walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, {isStatic: true}),
    Bodies.rectangle(width / 2, height, width, 2, {isStatic: true}),
    Bodies.rectangle(0, height / 2, 2, height, {isStatic: true}),
    Bodies.rectangle(width, height / 2, 2, height, {isStatic: true})
];
World.add(world, walls);

// maze generation
const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;

}
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal-1).fill(false));

const horizontals = Array(cellsHorizontal-1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);


const stepThroughCell = (row, column) => {
    //if I have visited the cell at (row, column), then return early
    if (grid[row][column]){
        return;
    }

    //mark this cell as being visited 
   
    grid[row][column] = true;
  
    

    //assemble randomly ordered list of neighbors
    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);
  
    //for each neighbor...
    for (let neighbor of neighbors){
        const [nextRow, nextColumn, direction] = neighbor;
    //see if neighbor is out of bounds and check if we've visited neighbor
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;
        } 
        if (grid[nextRow][nextColumn]) {
            continue;
        }
    
    //remove wall from vertical
        if (direction === 'left'){
            verticals[row][column-1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        }

     //remove wall from horizontal   
        else if (direction === 'up'){
            horizontals[row-1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

    
        //move to new cell
        
        stepThroughCell(nextRow, nextColumn)

        
    }
};

//stepThroughCell(startRow, startColumn);
stepThroughCell(startRow,startColumn);

horizontals.forEach((row, rowIndex)=> {
    
    row.forEach((open, columnIndex)=> {
        if (open){return}
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY, 
            unitLengthX,
            1,
            {isStatic: true,
            label: 'wall'
            }
        );
        World.add(world, wall)
    })
});

verticals.forEach((row, rowIndex)=> {
    
    row.forEach((open, columnIndex)=> {
        if (open){return}
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2, 
            1,
            unitLengthY,
            {isStatic: true,
            label: 'wall'}
        );
        World.add(world, wall)
    })
});

//goal
const goal = Bodies.rectangle(
    width - unitLengthX / 2, 
    height - unitLengthY / 2,
    unitLengthX * .7,
    unitLengthY * .7,
    {
        label: 'goal',
        isStatic: true,
        render: {
            fillStyle: 'red'
        }
    }
)
World.add(world, goal);


//ball

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    {
        label: 'ball'
    }
   /*  {
        isStatic: true
    } */
)
World.add(world, ball);
document.addEventListener('keydown', evt => {
    const { x, y } = ball.velocity;
        console.log(x,y);
    if (startGameFlag){
        if (evt.keyCode === 87) {
            Body.setVelocity(ball, {x, y: y-3});
        }
        if (evt.keyCode === 68) {
            Body.setVelocity(ball, {x: x+3, y});
        }
        if (evt.keyCode === 83) {
            Body.setVelocity(ball, {x, y: y+3});
        }
        if (evt.keyCode === 65) {
            Body.setVelocity(ball, {x: x-3, y});
        }
    }

})

//win condition
Events.on(engine, 'collisionStart', evt => {
    evt.pairs.forEach((collision) => {
        const labels = ['ball', 'goal'];
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label) ){
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            })
            document.querySelector('.timer').classList.add('hidden')
           document.querySelector('.winner').classList.remove('hidden');
           timerFlag = true;
           resetGame();
           /* document.addEventListener('click', ()=>{
               location.reload();
           }) */
        }
    })
})
//relaod the page on end game 

const resetGame = () => {
    setTimeout(()=>{
        location.reload();
    },3000)
};

let startGameFlag = false;
let timerFlag = false;
//timer
var timer; 
var timeLeft = 10; // seconds

// What to do when the timer runs out
function gameOver() {

  // re-show the button, so they can start it again
  world.gravity.y = 1;
  world.bodies.forEach(body => {
    if (body.label === 'wall') {
        Body.setStatic(body, false);
    }
    })
  document.querySelector('.timer').classList.add('hidden')
  document.querySelector('.loser').classList.remove('hidden');
  World.remove(world, goal)
  resetGame();


  
}

function updateTimer() {
  timeLeft = timeLeft - 1;
  if(timeLeft >= 0)
    document.querySelector('.timer').innerHTML = `${timeLeft}`;
  else if (!timerFlag){
    gameOver();
  }
}

// The button has an on-click event handler that calls this
function start() {
  // setInterval is a built-in function that will call the given function
  // every N milliseconds (1 second = 1000 ms)
  timer = setInterval(updateTimer, 1000);
  document.querySelector('.rules').classList.add('hidden') 
}

/* const preGame = () => {
    setTimeout(()=>{
        start();
    },2000)
} */

document.addEventListener('click', () => {
    startGameFlag = true;
    start()}
    );

//things to add
//user input to set difficulty (generate more rows, columns, reduce time)