//w ramach popracowania nad tym projektem mozna na koniec dodac przycisk ktory odswiezy i bedzie mozna zarac od pocztku 
const {Engine, Render, Runner, World, Bodies, Body, Events} = Matter; 

//tutaj mozemy zmieniac wymiar naszego labiryntu
//bylo podane jaka liczba komorek, teraz sie zmienia w zalezonosci od wielkosci przegladarki
const cellsVertical = 16;
const cellsHorizontal = 16;
const width = window.innerWidth;
const height = window.innerHeight; 

const unitLenghX = width/cellsHorizontal;
const unitLenghY = height/cellsVertical;

const engine = Engine.create();
//disabling Gravity
engine.world.gravity.y = 1;

const {world} = engine;
const render = Render.create({
    element: document.body, 
    engine: engine,
    options:{
        //robi wypelnione w srodu
        wireframes: false, 
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);




/*
 BUILDING A MAZE

 Creating a grid of cells 
 pick a random starting cell 
 for that cell build a randomly- oriented list of neighbours 
 if a neighbour has been visited before, remove from the list 
 for each remaning neighbour, move to it and remove the wall beetween those two cells
 repeat for this new neighbour

 ****GRID****
 2D ARRAY

  __ __ __
 |__|__|__|
 |__|__|__|
 |__|__|__|

 |  --> HORIZONTAL
 __ --> VERTICAL


 */


//walls
const walls =[
    Bodies.rectangle(width/2, 0, width, 2,{isStatic: true}),
    Bodies.rectangle(width/2, height, width, 2, {isStatic: true}),
    Bodies.rectangle(0, height/2, 2, height,{isStatic: true}),
    Bodies.rectangle(width, height/2, 2, height,{isStatic: true})
    
];
World.add(world, walls);

// ***Maze generation***


/* takie cos nie prowadzi do niczego dobrego 
const grid = [];

for (let i =0; i<3; i++){
    grid.push([]);
    for( let j =0; j<3; j++ ){
        grid[i].push(false)
    }
}
*/



//ustawienie losowosci przechodzienia i sprawdzania danej komorki 
const shuffle = (arr) => {
    let counter = arr.length;

    while(counter >0){
        const index = Math.floor(Math.random() *counter);

        counter--;

        //swapping of elements to randomize the order it's all 
        //temp - short for temporary  - is temporary arr at vcounter wen update the value at index of counter 
        const temp = arr[counter];

        //update the counter at array
        arr[counter]= arr[index];
        //update the element at index to be whatever was previously at counter
        arr[index] = temp;
    }
    return arr;

};


// musimy stworzyc nasz labirynt - na nim bedziemy sprawdzac czy dane pole bylo juz odwiedzone i bedzemy sprawdzac 
//poziome i pionowe kreski
const grid = Array(cellsVertical)
//creates array of "cells" length with null items inside
.fill(null)
//powstaje array of arrays, powstaje kwadrat cells x cells z wartosciami false
.map(()=>Array(cellsHorizontal).fill(false));



//to sa kreski naszego labiryntu, musimy ustalic ktore sa tam a ktorych nie ma 
// kresli sa poziome(horizontals) i pionowe (veticals)
// jak wyzej musimy zrobic array fo arrays
const verticals = Array(cellsVertical)
.fill(null)
.map(()=>Array(cellsHorizontal-1).fill(false));

const horizontals = Array(cellsVertical-1)
.fill(null)
.map(()=>Array(cellsHorizontal).fill(false));



//generowanie losowego starying point

const startRow = Math.floor(Math.random()* cellsVertical);
const startColumn = Math.floor(Math.random()* cellsHorizontal);




const stepThoughCell = (row, column) =>{

//tutaj wlasciwie sprawdzamy czy dana komorka zostala odwiedzona
//if the cell at [row, column] is visited, then return

    if(grid[row][column]){
        return;
    }
//mark this cell as being visited

    grid[row][column] = true;

//asamble randomly-oriented  list of neighbours

//'up', 'right', down, left, determines what direction we are going to go 

    const neighbors = shuffle([
        [row-1, column, 'up'],
        [row, column +1, 'right'],
        [row+1, column, 'down'],
        [row, column -1, 'left']
    ]);

    //for each neighbor

    for (let neighbor of neighbors){
        const[nextRow, nextColumn, direction] = neighbor;
        //see if that neighbour is out of bounds
        if(nextRow<0 ||
            nextRow>=cellsVertical ||
             nextColumn<0 ||
              nextColumn>=cellsHorizontal){
            continue;
        }

         // if we have visited that neighbour , continue to next neighbor

         if(grid[nextRow][nextColumn]){
            continue;
         }


        //remove a wall from eigher horizontals or verticals
         //pracujemy na array of horizonals lub array of verticals 

         //depending upon the direction we are going we have to adjust the indices of what we are of what wall we are trying to update
        if(direction ==='left'){
            verticals[row][column -1] = true;

        }else if(direction ==='right'){
            verticals[row][column] = true;
        }else if(direction ==='up'){
            horizontals[row-1][column] = true;

        }else if(direction ==='down'){
            horizontals[row][column] = true;

        }

        // Validating Wall Structure
      

    

   

    // Visit that next cell 
    stepThoughCell(nextRow,nextColumn);
}

};


stepThoughCell(startRow,startColumn);


//najpirws sprawdzamy czy nasza horizontal jest (false), czy jej nie ma (true)
horizontals.forEach((row, rowIndex)=>{
    row.forEach((open, columnIndex)=>{
        if(open){
            return;
        }

        const wall = Bodies.rectangle(

        columnIndex * unitLenghX  + unitLenghX/2,
        rowIndex * unitLenghY + unitLenghY,
        unitLenghX,
        10,
        {
            label:'wall',
            isStatic:true,
            render:{
                fillStyle:'blue'
            }
        }
        );

        World.add(world, wall);
    });
});

verticals.forEach((row, rowIndex) =>{
    row.forEach((open, columnIndex)=>{
        if(open){
            return;
        }
        const wall = Bodies.rectangle(

            columnIndex*unitLenghX+unitLenghX,
            rowIndex * unitLenghY + unitLenghY/2,
            10,
            unitLenghY,
            {
                label:'wall',
                isStatic:true,
                render:{
                    fillStyle:'blue'
                }
            }
            );
    
            World.add(world, wall);
        

    });
});


//adding goal, gdzie user ma sie dostac

const goal = Bodies.rectangle(

    width-unitLenghX/2,
    height-unitLenghY/2,

    unitLenghX*0.7,
    unitLenghY*0.7,
    {
        label:'goal',
        isStatic:true,
        render:{
            fillStyle:'green'
        }
    }
);
World.add(world, goal);

//ball jak wyglada pileczka
const ballRadius = Math.min(unitLenghX, unitLenghY) /4;

const ball = Bodies.circle(
    unitLenghX/2,
    unitLenghY/2,
    ballRadius,
    {
        label: 'ball',
        render:{
            fillStyle:'red'
        }
    }
 
);

World.add(world, ball);

//ruszanie pileczka 

document.addEventListener('keydown', event =>{
const {x,y} = ball.velocity;


    if(event.keyCode === 87){
        //take the current velocity and subtract five to it and set the velocity
        Body.setVelocity(ball,{x, y:y - 5 });
    }
    if(event.keyCode === 68){
        Body.setVelocity(ball,{x:x+5, y});
   
    }
    if(event.keyCode === 83){
     
        Body.setVelocity(ball,{x, y:y+5});
    }
    if(event.keyCode === 65){
     
        Body.setVelocity(ball,{x:x-5, y});
    }
});

//Win Condition 

Events.on(engine, 'collisionStart', event =>{
    event.pairs.forEach(collision =>{
        const labels =['ball', 'goal'];

        if (labels.includes(collision.bodyA.label)&& labels.includes(collision.bodyB.label)){
           document.querySelector('.winner').classList.remove('hidden');
           
            //przyrwocenie grawitacji 
            world.gravity.y = 1;
            world.bodies.forEach(body =>{
                if (body.label ==='wall'){
                    Body.setStatic(body, false);
                }
            })
        }
        
    });
});