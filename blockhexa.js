var Hexagon = require('./hexagon.js')
var HexGrid = require('./hexgrid.js')
var ColorPicker = require('./colorpicker.js')

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

/*var c2 = document.getElementById("pieceGenerator");
var ctx2 = c2.getContext("2d");

var c3 = document.getElementById("pieces");
ctx3 = c3.getContext("2d");*/

var gridRows = 14;
var gridCols = 5;
var size = 20;
var leftMargin = 40;
var topMargin = 40;

/*var hex1 = new Hexagon (context, 0, 0, true, null, null, 'yellow');
var hex2 = new Hexagon (context, 1, 1, true, null, null, 'green');
var hex3 = new Hexagon (context, 2, 0, true, null, null, 'red');
var hex4 = new Hexagon (context, 3, 1, true, null, null, 'green');
hex1.draw(80, 40, size);
hex2.draw(80, 40, size);
hex3.draw(80, 40, size);
hex4.draw(80, 40, size);*/

board = new HexGrid(context, 'board', gridRows, gridCols, size, leftMargin, topMargin);

pieceGen = new HexGrid(context, 'pieceGen', gridRows, gridCols, size, 2*leftMargin + 1.5*gridCols*size, topMargin);

colorPicker = new ColorPicker(context, 3*leftMargin + 2*1.5*gridCols*size, topMargin);
pieces = [];
/*pieceGenerator = new Board(ctx2, 'piece', gridSize, size, leftMargin, topMargin);

pieces = [];*/

canvas.addEventListener("mousedown", getMousePos, false);
/*canvas.addEventListener("mousedown", setBoard, false);
c2.addEventListener("mousedown", setPiece, false);*/

function getMousePos(event) {
  var pos = getMousePosOnCanvas(canvas, event);
  //console.log(pos);
  if (board.includesPos(pos)) {
    board.clickHandler(pos);
  } else if (pieceGen.includesPos(pos)) {
    pieceGen.clickHandler(pos);
  } else if (colorPicker.includesPos(pos)) {
    colorPicker.clickHandler(pos);
  } else {
    var onPiece = false
    pieces.forEach(function (piece, i) {
      if (piece.includesPos(pos)) {
        //console.log('On piece: ' + i );
        piece.clickHandler(pos)
        onPiece = true
      }
    })
    if (!onPiece) {
      console.log('OffBoard');
    }
  }
}

/*function setPiece(e) {
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
}*/

function getMousePosOnCanvas(canvas, event) {
  //console.log(e.clientX);
  //console.log(e.clientY);
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};
