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
  var available = true;
  for (var i = 0; i < this.origGridRows; i++) {
    for (var j = 0; j < this.origGridCols; j++) {
      if ( (i+j)%2 === 0 ) {
        visible = true;
        available = true;
        dummy = false;
      } else {
        visible = false;
        available = false;
        dummy = true;
      };
      initHex.push(new Hexagon(this.context, i, j, visible, false, available, 'yellow', dummy));
    };
  };
  return initHex;
};

HexGrid.prototype.complete = function (done) {
  //console.log(done)
  // the objective of this function is to trim all the unnecessary cells from around the container
  if (!this.completed) {
    var self = this;
    this.minimize();

    if (this.type === 'pieceGen') {
      var analysis = this.analyze();
      if (analysis.count > 0) {
        pieces.push(new Piece(this.context, this.hexagons, analysis, this.size));
        this.hexagons = this.init();
        this.gridRows = this.origGridRows;
        this.gridCols = this.origGridCols;
        this.draw();
      }
    }
    if (done && this.type === 'pieceGen') {
      this.hexagons.forEach(function (hex) {
        hex.available = false;
      });
    }
    if (done /*&& this.type === 'pieceGen'*/) {
      this.completed = true;
      //this.hexagons = [];
      canvasState.valid = false;
      canvasState.draw();
      /*if (this.type === 'pieceGen') {
        colorPicker.hide();
      }*/
    };
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
  //console.log(stats);
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
        hex.available = false;
      }
      self.minHexagons.push(hex);
    }
  });
  this.hexagons = this.minHexagons;
  this.draw();
}

HexGrid.prototype.draw = function () {
  var self = this;
  /*this.context.fillStyle = 'white';
  this.context.fillRect(this.boundingBox.minX, this.boundingBox.minY,
                        this.boundingBox.maxX-this.boundingBox.minX,
                        this.boundingBox.maxY-this.boundingBox.minY)temporary*/
  //this.context.fill();
  this.hexagons.forEach(function (hex) {
    hex.draw(self.leftMargin, self.topMargin, self.size)
  });
  //this.context.save();
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
  if (!this.hexagons[0].dummy) {
    if (col % 2 === 0) {
      var row = 2*Math.round((pos.y-this.boundingBox.minY)/(1.7*this.size)-0.5);
    } else {
      var row = 2*Math.round((pos.y-this.boundingBox.minY-0.85*this.size)/(1.7*this.size)-0.5)+1;
    }
  } else {
    if (col % 2 === 0) {
      var row = 2*Math.round((pos.y-this.boundingBox.minY-0.85*this.size)/(1.7*this.size)-0.5)+1;
    } else {
      var row = 2*Math.round((pos.y-this.boundingBox.minY)/(1.7*this.size)-0.5);
    }
  }
  if (!this.completed) {
    this.hexagons[row*this.gridCols+col].used = !this.hexagons[row*this.gridCols+col].used;
    if (this.hexagons[row*this.gridCols+col].used) {
      if (this.type === 'board') {
        this.hexagons[row*this.gridCols+col].color = 'black';
      } else {
        this.hexagons[row*this.gridCols+col].color = colorPicker.selectedColor;
      }
    } else {
      this.hexagons[row*this.gridCols+col].color = 'yellow';
    }
    //this.hexagons[row*this.gridCols+col].draw(this.leftMargin, this.topMargin, this.size);
  }
  canvasState.valid=false;
  canvasState.draw();
  return {row: row, col: col};
}

module.exports = HexGrid;
