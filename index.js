(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Hexagon = require('./hexagon.js')
var HexGrid = require('./hexgrid.js')

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

/*var c2 = document.getElementById("pieceGenerator");
var ctx2 = c2.getContext("2d");

var c3 = document.getElementById("pieces");
ctx3 = c3.getContext("2d");*/

var gridRows = 12;
var gridCols = 6;
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
  } else {
      console.log('OffBoard');
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

},{"./hexagon.js":2,"./hexgrid.js":3}],2:[function(require,module,exports){
var Hexagon = function (context, row, col, visible, used, available, color, dummy) {
  this.context = context; //the context onto which we will draw the hexagon
  this.row = row; //the row of the haxagon (0 indexed)
  this.col = col; //the colummn of the hexagon (0 indexed)
  this.visible = visible; //determines if the cell should be drawn
  this.used = used; //determines if the cell is used in a board or peice. State often toggled when cell is clicked
  this.available = available; //relevant only in boards to detemine if a hexagon is already filled or not
  this.color = color;
  this.dummy = dummy;
};

Hexagon.prototype.draw = function (xOffset, yOffset, size) {
  //console.log(xOffset);
  //the x and y offsets determine the postion of the centre of the 0 hexagon
  //the other hexagons positions use the col and row to determine the position relative to cell 0
  if ( !this.dummy ) {
    this.context.beginPath();
    this.context.moveTo(xOffset+(-0.5+this.col*1.5)*size, yOffset+(-1+this.row)*0.85*size);
    this.context.lineTo(xOffset+(0.5+this.col*1.5)*size, yOffset+(-1+this.row)*0.85*size);
    this.context.lineTo(xOffset+(1+this.col*1.5)*size, yOffset+this.row*0.85*size);
    this.context.lineTo(xOffset+(0.5+this.col*1.5)*size, yOffset+(1+this.row)*0.85*size);
    this.context.lineTo(xOffset+(-0.5+this.col*1.5)*size, yOffset+(1+this.row)*0.85*size);
    this.context.lineTo(xOffset+(-1+this.col*1.5)*size, yOffset+this.row*0.85*size);
    this.context.closePath();

    this.context.lineWidth="2";
    if (this.visible) {
      this.context.strokeStyle="grey";
    } else {
      this.context.strokeStyle="white";
    }
    this.context.stroke();

    if (this.visible) {
      this.context.fillStyle = this.color;
      //console.log('I should be a color');
    } else {
      //console.log('I should be white');
      this.context.fillStyle = 'white';
    }
    this.context.fill();
  }
};

module.exports = Hexagon;

},{}],3:[function(require,module,exports){
var Hexagon = require('./hexagon.js');
var Piece = require('./piece.js')

var HexGrid = function (context, type, gridRows, gridCols, size, leftMargin, topMargin) {
  this.context = context;
  this.type = type;
  this.gridRows = gridRows;
  this.gridCols = gridCols;
  this.origGridRows = gridRows;
  this.origGridCols = gridCols;
  this.size = size;
  this.leftMargin = leftMargin;
  this.topMargin = topMargin;
  this.hexagons = [];
  //this.pieces = [];
  this.completed = false;
  this.boundingBox = {
    minX: leftMargin-size-2,
    minY: topMargin-0.85*size-2,
    maxX: leftMargin+gridCols*1.5*size-0.5*size+2,
    maxY: topMargin+gridRows*0.85*size+2};
  this.hexagons = this.init();
  this.draw()
  /*var visible = false;
  var dummy = false;
  for (var i = 0; i < gridRows; i++) {
    for (var j = 0; j < gridCols; j++) {
      if ( (i+j)%2 === 0 ) {
        visible = true;
        dummy = false;
      } else {
        visible = false;
        dummy = true;
      }
      this.hexagons.push(new Hexagon(context, i, j, visible, false, null, 'yellow', dummy));
      //if ( visible ) {
        this.hexagons[i*gridCols+j].draw(leftMargin, topMargin, size);
      //}
    };
  };*/
};

HexGrid.prototype.init = function () {
  var initHex = [];
  var visible = false;
  var dummy = false;
  for (var i = 0; i < this.origGridRows; i++) {
    for (var j = 0; j < this.origGridCols; j++) {
      if ( (i+j)%2 === 0 ) {
        visible = true;
        dummy = false;
      } else {
        visible = false;
        dummy = true;
      };
      initHex.push(new Hexagon(this.context, i, j, visible, false, null, 'yellow', dummy));
    };
  };
  return initHex;
};

HexGrid.prototype.complete = function (done) {
  //console.log(done)
  // the objective of this function is to trim all the unnecessary cells from around the container
  var self = this;
  this.minimize();

  if (this.type === 'pieceGen') {
    var analysis = this.analyze();
    pieces.push(new Piece(this.context, this.hexagons, analysis, this.size));
    this.hexagons = this.init();
    this.gridRows = this.origGridRows;
    this.gridCols = this.origGridCols;
    this.draw();
  }
  if (done && this.type === 'pieceGen') {
    this.completed = true;
    this.hexagons = [];
    this.draw();
  };
};

HexGrid.prototype.analyze = function () {
  var self = this;
  var count = this.hexagons.reduce((count, hex) => count + (hex.used === true), 0);
  //console.log(self.gridRows);
  var min = this.hexagons.reduce((min, hex, i) => Math.min(hex.used ? i : self.gridRows*self.gridCols, min), self.gridRows*self.gridCols);
  //console.log(min)
  var max = this.hexagons.reduce((max, hex, i) => Math.max(hex.used ? i : 0, max), 0);
  minRow = parseInt(min/self.gridCols);
  maxRow = parseInt(max/self.gridCols);
  var minCol = this.hexagons.reduce((min, hex, i) => Math.min(hex.used ? i%self.gridCols : self.gridCols, min), self.gridCols);
  var maxCol = this.hexagons.reduce((max, hex, i) => Math.max(hex.used ? i%self.gridCols : 0, max), 0);
  return {count: count, minRow: minRow, maxRow: maxRow, minCol: minCol, maxCol: maxCol};
};

HexGrid.prototype.minimize = function () {
  var self = this;
  var stats = this.analyze();
  this.gridRows = stats.maxRow - stats.minRow + 1;
  this.gridCols = stats.maxCol - stats.minCol + 1;
  //console.log(stats);
  this.minHexagons = [];
  this.hexagons.forEach(function(hex) {
    //console.log(stats.minRow);
    //console.log(hex.row);
    if (hex.row >= stats.minRow && hex.row <= stats.maxRow
    && hex.col >= stats.minCol && hex.col <= stats.maxCol) {
      hex.row = hex.row - stats.minRow;
      hex.col = hex.col - stats.minCol;
      if (!hex.used) {
        hex.visible = false;
      }
      self.minHexagons.push(hex);
    }
  });
  this.hexagons = this.minHexagons;
  this.draw();
}

HexGrid.prototype.draw = function () {
  var self = this;
  this.context.fillStyle = 'white';
  this.context.fillRect(this.boundingBox.minX, this.boundingBox.minY,
                        this.boundingBox.maxX-this.boundingBox.minX,
                        this.boundingBox.maxY-this.boundingBox.minY)
  this.hexagons.forEach(function (hex) {
    hex.draw(self.leftMargin, self.topMargin, self.size)
  })
}

HexGrid.prototype.includesPos = function (pos) {
  if (pos.x > this.boundingBox.minX &&
  pos.x < this.boundingBox.maxX &&
  pos.y > this.boundingBox.minY &&
  pos.y < this.boundingBox.maxY) {
    return true;
  } else {
    return false;
  }
};

HexGrid.prototype.clickHandler = function (pos) {
  var col = Math.round((pos.x-this.boundingBox.minX-0.25*this.size)/(1.5*this.size)-0.5);
  if (col % 2 === 0) {
    var row = 2*Math.round((pos.y-this.boundingBox.minY)/(1.7*this.size)-0.5);
  } else {
    var row = 2*Math.round((pos.y-this.boundingBox.minY-0.85*this.size)/(1.7*this.size)-0.5)+1;
  }
  if (!this.completed) {
    this.hexagons[row*this.gridCols+col].used = !this.hexagons[row*this.gridCols+col].used;
    if (this.hexagons[row*this.gridCols+col].used) {
      this.hexagons[row*this.gridCols+col].color = 'black';
    } else {
      this.hexagons[row*this.gridCols+col].color = 'yellow';
    }
    this.hexagons[row*this.gridCols+col].draw(this.leftMargin, this.topMargin, this.size);
  }
}

module.exports = HexGrid;

},{"./hexagon.js":2,"./piece.js":4}],4:[function(require,module,exports){
var Hexagon = require('./hexagon.js')

var Piece = function (context, hexagons, analysis, size) {
  //console.log(board);
  this.context = context;
  this.topMargin = board.topMargin + board.boundingBox.maxY;
  if (pieces.length === 0) {
    this.leftMargin = board.leftMargin;
  } else {
    //console.log(pieces[pieces.length-1].leftMargin);
    //console.log(pieces[pieces.length-1].boundingBox.maxX);
    //console.log(pieces.length);
    this.leftMargin = board.leftMargin + pieces[pieces.length-1].boundingBox.maxX;
  }
  this.hexagons = hexagons;
  this.analysis = analysis;
  this.gridCols = analysis.maxCol - analysis.minCol + 1;
  //console.log(this.gridCols);
  this.gridRows = analysis.maxRow - analysis.minRow + 1;
  //console.log(this.gridRows);
  this.size = size;
  this.boundingBox = {
    minX: this.leftMargin-size-2,
    minY: this.topMargin-0.85*size-2,
    maxX: this.leftMargin+this.gridCols*1.5*size-0.5*size+2,
    maxY: this.topMargin+this.gridRows*0.85*size+2
  };
  this.draw();
  //var pieceColCount = analysis.maxCol-analysis.minCol+1;
  //console.log(pr)
  /*for (j = analysis.minRow-1; j < analysis.maxRow; j++) {
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
  */
};

Piece.prototype.draw = function () {
  var self = this;
  this.context.fillStyle = 'white';
  this.context.fillRect(this.boundingBox.minX, this.boundingBox.minY,
                        this.boundingBox.maxX-this.boundingBox.minX,
                        this.boundingBox.maxY-this.boundingBox.minY)
  this.hexagons.forEach(function (hex) {
    //console.log(self.leftMargin);
    //console.log(self.topMargin);
    //console.log(self.size);
    hex.draw(self.leftMargin, self.topMargin, self.size)
  })
};

module.exports = Piece;

},{"./hexagon.js":2}]},{},[1]);
