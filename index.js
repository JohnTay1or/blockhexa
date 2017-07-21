(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./board.js":2,"./hexagon.js":3}],2:[function(require,module,exports){
var Hexagon = require('./hexagon.js')
var Piece = require('./piece.js')

var Board = function (ctx, type, gridSize, size, leftMargin, topMargin) {
  this.type = type;
  this.hexagons = [];
  this.pieces = [];
  this.locked = false;
  for (var j = 0; j < gridSize; j++) {
    for (var i = 0; i < gridSize; i++) {
      if (i%2 === 0) {
        this.hexagons.push(new Hexagon(ctx, leftMargin+1.5*i*size, topMargin+size*(1.7*j), size, false, 'yellow'));
      } else {
        this.hexagons.push(new Hexagon(ctx, leftMargin+1.5*i*size, topMargin+(1.7*j+0.85)*size, size, false, 'yellow'));
      };
      this.hexagons[j*gridSize+i].draw()
    };
  };
};

Board.prototype.lock = function () {
  // the objective of this function is to trim all the unnecessary cells from around the container
  this.hexagons.forEach(function(e) {
  //console.log(e)
    if (e.available === false) {
      e.visible = false;
      e.draw();
    }
  });
  this.locked = true;
  if (this.type === 'piece') {
    pieces.push(new Piece(this.hexagons, this.analyze()));
  }

};

Board.prototype.analyze = function () {
  var count = this.hexagons.reduce((count, hex) => count + (hex.visible === true), 0);
  var min = this.hexagons.reduce((min, hex, i) => Math.min(hex.visible ? i : gridSize*gridSize, min), gridSize*gridSize);
  var max = this.hexagons.reduce((max, hex, i) => Math.max(hex.visible ? i : 0, max), 0);
  minRow = parseInt(min/gridSize)+1;
  maxRow = parseInt(max/gridSize)+1;
  var minCol = this.hexagons.reduce((min, hex, i) => Math.min(hex.visible ? i%gridSize : gridSize, min), gridSize)+1;
  var maxCol = this.hexagons.reduce((max, hex, i) => Math.max(hex.visible ? i%gridSize : 0, max), 0)+1;
  return {count: count, minRow: minRow, maxRow: maxRow, minCol: minCol, maxCol: maxCol};
};

module.exports = Board;

},{"./hexagon.js":3,"./piece.js":4}],3:[function(require,module,exports){
var Hexagon = function (ctx, x, y, size, available, color) {
  this.x = x; //the x-cord of the top left corner of the hexagon
  this.y = y; //the y-cord of the top left corner of the hexagon
  this.size = size; // the distance between the 2 top corners of the rectangle
  this.available = available; //determines the status of the cell; changed when cell is clicked
  this.color = color;
  this.visible = true; //determines if the cell should be drawn
  this.ctx = ctx;
};

Hexagon.prototype.draw = function () {
  this.ctx.beginPath();
  this.ctx.lineWidth="2";
  if (this.visible) {
    this.ctx.strokeStyle="grey";
  } else {
    this.ctx.strokeStyle="white";
  }
  this.ctx.beginPath();
  this.ctx.moveTo(this.x, this.y);
  this.ctx.lineTo(this.x+this.size, this.y);
  this.ctx.lineTo(this.x+1.5*this.size, this.y+0.85*this.size);
  this.ctx.lineTo(this.x+this.size, this.y+1.7*this.size);
  this.ctx.lineTo(this.x, this.y+1.7*this.size);
  this.ctx.lineTo(this.x-0.5*this.size, this.y+0.85*this.size);
  this.ctx.closePath();
  if (this.visible) {
    if (this.available) {
      this.ctx.fillStyle = 'black';
    } else {
      this.ctx.fillStyle = this.color;
    }
  } else {
    this.ctx.fillStyle = 'white';
  }
  this.ctx.fill();
  this.ctx.stroke();
};

module.exports = Hexagon;

},{}],4:[function(require,module,exports){
var Hexagon = require('./hexagon.js')

var Piece = function (hexagons, analysis) {
  this.hexagons = [];
  var pieceColCount = analysis.maxCol-analysis.minCol+1;
  //console.log(pr)
  for (j = analysis.minRow-1; j < analysis.maxRow; j++) {
    for (i = analysis.minCol-1; i < analysis.maxCol; i++) {
      //console.log('j ' + j);
      //console.log('i ' + i);
      //console.log('here')
      //console.log(hexagons[i*gridSize+j].visible);
      if (i%2 === 0) {
        this.hexagons.push(new Hexagon(ctx3, leftMargin+1.5*(i-analysis.minCol+1)*size, topMargin+size*(1.7*(j-analysis.minRow+1)), size, null, 'red'));
      } else {
        this.hexagons.push(new Hexagon(ctx3, leftMargin+1.5*(i-analysis.minCol+1)*size, topMargin+size*(1.7*(j-analysis.minRow+1)+0.85), size, null, 'red'));
      };

      this.hexagons[(j-analysis.minRow+1)*pieceColCount+i-analysis.minCol+1].visible = hexagons[j*gridSize+i].visible;
      //console.log(hexagons[(j+analysis.minRow-1)*gridSize+i+analysis.minCol-1].visible);
      //if (this.hexagons[j*pieceColCount+i].visible) {
        //console.log('hi')
        //this.hexagons[j*pieceColCount+i].draw()
      //}
      this.hexagons.forEach(function(hex) {
        hex.draw();
      })
    }

  }
  //console.log(hexagons);
  //console.log(analysis);
};

Piece.prototype.draw = function () {
};

module.exports = Piece;

},{"./hexagon.js":3}]},{},[1]);
