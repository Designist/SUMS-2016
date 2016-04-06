var canvas;
var ctx; // canvas object to which functions like fillRect are applied
var timer;
/* Defines a matrix with dimension dim and fills it with zeroes. This matrix
   is used to store the directions of arrows at each point on the grid. */
var matrix = [];
var gradient = [];
// var dim = 500; // matrix size, currently 500x500
// var center = Math.floor(dim / 2.0);
// var n = Math.ceil(500.0 / dim); // the size of squares in the visualization
// var particle = true; // whether or not a particle exists in the matrix
// var loc = [center,center]; // location of current particle
var exits = 0; // number of times a particle exits the matrix
var returns = 0; // number of times a particle returns to the origin


function update_speed() {
  var form_elements = document.getElementById("config_form").elements;
  speed = form_elements["speed"].value;
}

function reset() {
  clearInterval(timer);
  timer = 0;
  exits = 0;
  returns = 0;
  matrix = [];
  gradient = [];
  ctx.fillStyle = 'rgb('+255+','+255+','+255+')';
  ctx.fillRect(0, 0, 500, 500);
  ctr.innerHTML = "Exits: " + exits + " | Returns to Origin: " + returns;
}

function configure(num) {
  if (num == 0) {
    for (var i = 0; i < dim; i++) {
      matrix[i] = [];
      gradient[i] = [];
      for (var j = 0; j < dim; j++) {
        matrix[i][j] = 0;
        gradient[i][j] = 255;
      }
    }
  }
  if (num == 1) {
    for (var i = 0; i < dim; i++) {
      matrix[i] = [];
      gradient[i] = [];
      for (var j = 0; j < dim; j++) {
        matrix[i][j] = (j % 2) * 2;
        gradient[i][j] = 255;
      }
    }
  }
  if (num == 2) {
    for (var i = 0; i < dim; i++) {
      matrix[i] = [];
      gradient[i] = [];
      for (var j = 0; j < dim; j++) {
        matrix[i][j] = (j % 4);
        gradient[i][j] = 255;
      }
    }
  }
  if (num == 3) {
    for (var i = 0; i < dim; i++) {
      matrix[i] = [];
      gradient[i] = [];
      for (var j = 0; j < dim; j++) {
        matrix[i][j] = Math.floor(100 * Math.random()) % 4;
        gradient[i][j] = 255
      }
    }
  }
}

/* An array of loc of sand grains, represented by their lattice points.
   Initialized as empty, but may look like [[24,24], [32,45]] after update has
   been repeatedly called. */

function nearest_divisor(num) {
  divisors = [50, 100, 125, 250, 500];
  var best_dif = 500;
  var best_div = 50;
  for (var i = 0; i < divisors.length; i++) {
    if (Math.abs(divisors[i] - num) < best_dif) {
      best_div = divisors[i];
      best_dif = Math.abs(divisors[i] - num);
    }
  }
  return best_div;
}

function init() {
  var matrix = [];
  clearInterval(timer);
  timer = 0;
  var form_elements = document.getElementById("config_form").elements;
  con = form_elements["config"].value;
  walk = form_elements["walk"].value;
  speed = form_elements["speed"].value;
  var surface = 0;
  dim = nearest_divisor(form_elements["size"].value); // matrix size, currently 500x500
  center = Math.floor(dim / 2.0);
  n = (500.0 / dim); // the size of squares in the visualization
  particle = true; // whether or not a particle exists in the matrix
  loc = [center,center]; // location of current particle
  configure(con);
  canvas = document.getElementById("canvas");
  ctr = document.getElementById("counter");
  ctx = canvas.getContext("2d");
  if (surface == 0) {
    timer = setInterval(update, 1); // calls update every millisecond
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
  for (var i = 0; i < speed; i++) {
    if (particle == false) {
      loc = [center,center];
      particle = true;
      exits += 1;
    }
    var x = loc[0]; // the x-coordinate of the sand grain
    var y = loc[1]; // the y-coordinate of the sand grain
    /* A series of if statements checks the direction of the arrow at the
       loc of the current grain of sand. It fills the */
    var ran = Math.floor(Math.random() * 4)
    if (((matrix[x][y]%4 == 0) && (walk == 0)) || (ran == 0) && (walk == 1)) { // UP
      /* These nested if statements remove any grains of sand that are about
         to exit the matrix. */
      if (y > 0) {
        loc = [x, y-1];
      }
      else {
        particle = false;
      }
      matrix[x][y]++; // changes arrow direction
      if(gradient[x][y]>=0){gradient[x][y]--;}
      ctx.fillStyle = 'rgb('+ gradient[x][y] +','+ gradient[x][y] +','+ gradient[x][y] +')'; // sets fill color
      ctx.fillRect(x*n, y*n, n, n); // visualization for arrow direction
    }
    else if (((matrix[x][y]%4 == 1) && (walk == 0)) || (ran == 1) && (walk == 1)) { // LEFT
      if (x > 0) {
        loc = [x-1, y];
      }
      else {
        particle = false;
      }
      matrix[x][y]++;
      if(gradient[x][y]>=0){gradient[x][y]--;}
      ctx.fillStyle = 'rgb('+gradient[x][y]+','+gradient[x][y]+','+gradient[x][y]+')';
      ctx.fillRect(x*n, y*n, n, n);
    }
    else if (((matrix[x][y]%4 == 2) && (walk == 0)) || (ran == 2) && (walk == 1)) { // DOWN
      if (y < dim - 1) {
        loc = [x, y+1];
      }
      else {
        particle = false;
      }
      matrix[x][y]++;
      if(gradient[x][y]>=0){gradient[x][y]--;}
      ctx.fillStyle = 'rgb('+gradient[x][y]+','+gradient[x][y]+','+gradient[x][y]+')';
      ctx.fillRect(x*n, y*n, n, n);
    }
    else if (((matrix[x][y]%4 == 3) && (walk == 0)) || (ran == 3) && (walk == 1)) { // RIGHT
      if (x < dim - 1) {
        loc = [x+1, y];
      }
      else {
        particle = false;
      }
      matrix[x][y]++;
      if(gradient[x][y]>=0){gradient[x][y]--;}
      ctx.fillStyle = 'rgb('+gradient[x][y]+','+gradient[x][y]+','+gradient[x][y]+')';
      ctx.fillRect(x*n, y*n, n, n);
    }
    if (loc.toString() == [center, center].toString()) {
      returns += 1;
    }
    ctr.innerHTML = "Exits: " + exits + " | Returns to Origin: " + returns;
  }
}
