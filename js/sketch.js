// Pathfinding A*

// TODO - Try to connect obsticles that are nextto eachother

function removeFromArray(arr, elt) {
    for (let i = arr.length - 1; i >= 0 ; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    let d = dist(a.i, a.j, b.i, b.j); // Distance between two points
    //let d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

let cols = 50;
let rows = 50;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];

let start;
let end;

let w, h;

let path = [];

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.prev = undefined;
    this.wall = false;

    if (random(1) < 0.4) {
        this.wall = true;
    }

    this.show = function(collor) {
        fill(collor);
        if (this.wall) {
            fill(0);
            noStroke();
            // rect(this.i * w, this.j * h, w - 1, h - 1);
            ellipse(this.i * w + w/2, this.j * h + h/2, w/2, h/2);
        }

    }

    this.addNeighbors = function(grid) {
        if (this.i < cols - 1) {
            this.neighbors.push(grid[this.i + 1][this.j]);
        }
        if (this.i > 0) {
            this.neighbors.push(grid[this.i - 1][this.j]);
        }
        if (this.j < rows - 1) {
            this.neighbors.push(grid[this.i][this.j + 1]);
        }
        if (this.j > 0) {
            this.neighbors.push(grid[this.i][this.j - 1]);
        }
        // Diagonal neightobs
        if (this.i > 0 && this.j > 0) {
            this.neighbors.push(grid[this.i - 1][this.j - 1]);
        }
        if (this.i < cols - 1 && this.j > 0) {
            this.neighbors.push(grid[this.i + 1][this.j - 1]);
        }
        if (this.i < 0 && this.j < rows - 1) {
            this.neighbors.push(grid[this.i - 1][this.j + 1]);
        }
        if (this.i < cols - 1 && this.j < rows - 1) {
            this.neighbors.push(grid[this.i + 1][this.j + 1]);
        }
    }
}

function setup() {
    createCanvas(400, 400);

    w = width / cols;
    h = height / rows;

    // Make 2D array
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // Create spots
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    // Add neighbors to spots
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    start.wall = false;
    end.wall = false;

    openSet.push(start);

    console.log(grid);

}

function draw() {

    if (openSet.length > 0) {

        let winner = 0;
        // Find the lowest cost
        for (let i = 0; i < openSet.length; i++) {
           if (openSet[i].f < openSet[winner].f) {
               winner = i;
           }
        }
        var current = openSet[winner];

        // If we found the end we are done!
        if (current == end) {
            noLoop();
            console.log("Done!");
        }

        removeFromArray(openSet, current);
        // openSet.remove(current);
        closedSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i  < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + 1;

                let newPath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }
                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.prev = current;
                }
            }
    
        }

        // Keep going
    } else {
        // No solution
        console.log("No solution!");
        noLoop();
        return;
    }

    background(255);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0 , 255, 0));
    }

    // Find the path
    let path = [];
    let temp = current;

    path.push(temp);

    while(temp.prev) {
        path.push(temp.prev);
        temp = temp.prev;
    }

    for (let i = 0; i < path.length; i++) {
        path[i].show(color(0 , 0, 255));
    }

    noFill();
    stroke(0 , 0, 255);
    strokeWeight(w/4);
    beginShape();
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w/2, path[i].j * h + h/2);
    }
    endShape();

}
