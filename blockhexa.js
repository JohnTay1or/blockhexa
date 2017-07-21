var Hexagon = require('./hexagon.js')
var Board = require('./board.js')

var c1 = document.getElementById("myCanvas");
var ctx1 = c1.getContext("2d");

var c2 = document.getElementById("pieceGenerator");
var ctx2 = c2.getContext("2d");

var c3 = document.getElementById("pieces");
ctx3 = c3.getContext("2d");

gridSize = 10;
size = 20;
leftMargin = 20;
topMargin = 20;

board = new Board(ctx1, 'board', gridSize, size, leftMargin, topMargin);

pieceGenerator = new Board(ctx2, 'piece', gridSize, size, leftMargin, topMargin);

pieces = [];

c1.addEventListener("mousedown", setBoard, false);
c2.addEventListener("mousedown", setPiece, false);

function setBoard(e) {
  var pos = getMousePos(c1, e);
  if (!board.locked) {
    var col = parseInt((pos.x-leftMargin+size)/(1.5*size)+0.5);
    if (col % 2 === 1) {
      var row = parseInt((pos.y-topMargin+0.85*size)/(1.7*size)+0.5);
    } else {
      var row = parseInt((pos.y-topMargin)/(1.7*size)+0.5);
    }
    board.hexagons[(row-1)*gridSize+col-1].available = !board.hexagons[(row-1)*gridSize+col-1].available;
    board.hexagons[(row-1)*gridSize+col-1].draw()
  }
}

function setPiece(e) {
  var pos = getMousePos(c2, e);
  if (!pieceGenerator.locked) {
    var col = parseInt((pos.x-leftMargin+size)/(1.5*size)+0.5);
    if (col % 2 === 1) {
      var row = parseInt((pos.y-topMargin+0.85*size)/(1.7*size)+0.5);
    } else {
      var row = parseInt((pos.y-topMargin)/(1.7*size)+0.5);
    }
    pieceGenerator.hexagons[(row-1)*gridSize+col-1].available = !pieceGenerator.hexagons[(row-1)*gridSize+col-1].available;
    pieceGenerator.hexagons[(row-1)*gridSize+col-1].draw()
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};
