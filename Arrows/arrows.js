// BEGIN CANVAS INITIALIZATION
var canvas;
var ctx;
var timer;

canvas = document.getElementById("canvas");
ctr = document.getElementById("counter");
ctx = canvas.getContext("2d");
// END CANVAS INITIALIZATION

/* Defines a matrix with dimension dim and fills it with zeroes. This matrix
   is used to store the directions of arrows at each point on the grid. */
var matrix = [];
var n = 500.0 / 11.0;

function update_speed() {
  var form_elements = document.getElementById("config_form").elements;
  speed = form_elements["speed"].value;
}

// BEGIN ARROW VISUALIZATION FUNCTIONS
var arrow = [
    [ 2, 0 ],
    [ -8, -3 ],
    [ -8, 3]
];

function drawFilledPolygon(shape) {
    ctx.beginPath();
    ctx.moveTo(shape[0][0],shape[0][1]);

    for(p in shape)
        if (p > 0) ctx.lineTo(shape[p][0],shape[p][1]);

    ctx.lineTo(shape[0][0],shape[0][1]);
    ctx.fill();
};

function translateShape(shape,x,y) {
    var rv = [];
    for(p in shape)
        rv.push([ shape[p][0] + x, shape[p][1] + y ]);
    return rv;
};

function rotatePoint(ang,x,y) {
    return [
        (x * Math.cos(ang)) - (y * Math.sin(ang)),
        (x * Math.sin(ang)) + (y * Math.cos(ang))
    ];
};

function rotateShape(shape,ang) {
    var rv = [];
    for(p in shape)
        rv.push(rotatePoint(ang,shape[p][0],shape[p][1]));
    return rv;
};

function drawLineArrow(x1,y1,x2,y2) {
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  var ang = Math.atan2(y2-y1,x2-x1);
  drawFilledPolygon(translateShape(rotateShape(arrow,ang),x2,y2));
};

// END ARROW VISUALIZATION

function paint() {
  for (var x = 0; x < 11; x++) {
    for (var y = 0; y < 11; y++) {
      drawLineArrow(x*n,y*n,x*n,y*n-15);
    }
  }
  ctx.fillStyle = "rgb(255,0,0)";
  ctx.beginPath();
  ctx.arc(5*n,5*n,4,0,2*Math.PI);
  ctx.stroke();
  ctx.fill();
}

function reset() {
  clearInterval(timer);
  timer = 0;
  exits = 0;
  returns = 0;
  matrix = [];
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(0, 0, 500, 500);
}

function configure() {
  for (var i = 0; i < dim; i++) {
    matrix[i] = [];
    for (var j = 0; j < dim; j++) {
      matrix[i][j] = 0;
    }
  }
}

/* An array of loc of sand grains, represented by their lattice points.
   Initialized as empty, but may look like [[24,24], [32,45]] after update has
   been repeatedly called. */

function init() {
  clearInterval(timer);
  timer = 0;
  var form_elements = document.getElementById("config_form").elements;
  speed = form_elements["speed"].value;
  var surface = 0;
  dim = 11;
  center = Math.floor(dim / 2.0);
  particle = true; // whether or not a particle exists in the matrix
  loc = [center,center]; // location of current particle
  configure();
  if (surface == 0) {
    timer = setInterval(update, 100 * speed); // calls update every millisecond
  }
  else if (surface == 1) {
    timer = setInterval(update_cylinder, 1);
  }
  else if (surface == 2) {
    timer = setInterval(update_mobius, 1);
  }
  else if (surface == 3) {
    timer = setInterval(update_sphere, 1);
  }
  else if (surface == 4) {
    timer = setInterval(update_torus, 1);
  }
  else if (surface == 5) {
    timer = setInterval(update_klein, 1);
  }
  else if (surface == 6) {
    timer = setInterval(update_rpp, 1);
  }
  return timer;
}

function update() {
  /* Since setInterval is already set to the smallest amount of time possible,
     we use a for loop to run additional iterations of update() every
     millisecond. */
  for (var i = 0; i < 1; i++) {
    if (particle == false) {
      loc = [center,center];
      particle = true;
    }
    var x = loc[0]; // the x-coordinate of the sand grain
    var y = loc[1]; // the y-coordinate of the sand grain
    /* A series of if statements checks the direction of the arrow at the
       loc of the current grain of sand. */
    if (matrix[x][y] == 0) { // UP-NORTH
      /* These nested if statements remove any grains of sand that are about
         to exit the matrix. */
      if (y > 0) {
        loc = [x, y-1];
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.arc(x*n,(y-1)*n,4,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
      }
      else {
        particle = false;
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.arc(center * n,center * n,4,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
        exits += 1;
      }
      matrix[x][y] = 1; // changes arrow direction
      ctx.fillStyle = "rgb(255,0,0)";
      ctx.beginPath();
      ctx.stroke();
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillRect(x*n-17, y*n-17, 34, 34);
      ctx.fillStyle = "rgb(0,0,0)";
      drawLineArrow(x*n,y*n,x*n-15,y*n);
    }
    else if (matrix[x][y] == 1) { // LEFT-WEST
      if (x > 0) {
        loc = [x-1, y];
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.arc((x-1)*n,y*n,4,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
      }
      else {
        particle = false;
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.arc(center * n,center * n,4,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
        exits += 1;
      }
      matrix[x][y] = 2;
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillRect(x*n-17, y*n-17, 34, 34);
      ctx.fillStyle = "rgb(0,0,0)";
      drawLineArrow(x*n,y*n,x*n,y*n+15);
    }
    else if (matrix[x][y] == 2) { // DOWN
      if (y < dim - 1) {
        loc = [x, y+1];
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.arc(x*n,(y+1)*n,4,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
      }
      else {
        particle = false;
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.arc(center * n,center * n,4,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
        exits += 1;
      }
      matrix[x][y] = 3;
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillRect(x*n-17, y*n-17, 34, 34);
      ctx.fillStyle = "rgb(0,0,0)"
      drawLineArrow(x*n,y*n,x*n+15,y*n);
    }
    else if (matrix[x][y] == 3) { // RIGHT
      if (x < dim - 1) {
        loc = [x+1, y];
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.arc((x+1)*n,y*n,4,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
      }
      else {
        particle = false;
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.arc(center * n,center * n,4,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
        exits += 1;
      }
      matrix[x][y] = 0;
      ctx.rect(20,20,150,100);
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillRect(x*n-17, y*n-17, 34, 34);
      ctx.fillStyle = "rgb(0,0,0)";
      drawLineArrow(x*n,y*n,x*n,y*n-15);
    }

    if (loc.toString() == [center, center].toString()) {
      returns += 1;
    }
    ctr.innerHTML = "Exits: " + exits + " | Returns to Origin: " + returns;
  }
}
