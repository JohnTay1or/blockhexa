var Hexagon = require('./hexagon.js')

var Piece = function (context, hexagons, analysis, size) {
  //console.log(board);
  this.context = context;
  this.available = true;
  this.topMargin = board.topMargin + board.boundingBox.maxY;
  if (pieces.length === 0) {
    this.leftMargin = board.leftMargin;
  } else {
    //console.log(pieces[pieces.length-1].leftMargin);
    //console.log(pieces[pieces.length-1].boundingBox.maxX);
    //console.log(pieces.length);
    this.leftMargin = board.leftMargin + pieces[pieces.length-1].boundingBox.maxX;
  }
  this.origTopMargin = this.topMargin;
  this.origLeftMargin = this.leftMargin;
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
};

Piece.prototype.draw = function () {
  var self = this;
  //console.log(pos);
  /*this.context.fillStyle = 'white';
  this.context.fillRect(this.boundingBox.minX, this.boundingBox.minY,
                        this.boundingBox.maxX-this.boundingBox.minX,
                        this.boundingBox.maxY-this.boundingBox.minY)*/
  this.hexagons.forEach(function (hex) {
    //console.log(self.leftMargin);
    //console.log(self.topMargin);
    //console.log(self.size);
    //hex.draw(self.leftMargin, self.topMargin, self.size)
    hex.draw(self.origLeftMargin, self.origTopMargin, self.size, true);
    hex.draw(self.leftMargin, self.topMargin, self.size, false);
  })
};

Piece.prototype.allowed = function (pieceOffset, boardOffset, pieceIndex) {
  //console.log(pieceOffset);
  //console.log(boardOffset);
  //console.log('Top left cell of the board: ' + (boardOffset.row - pieceOffset.row) + ' ' + (boardOffset.col - pieceOffset.col));
  var self = this;
  var topRow = boardOffset.row - pieceOffset.row;
  var leftCol = boardOffset.col - pieceOffset.col;

  function indexInRange(element, i , array) {
    var row = parseInt(i/self.gridCols);
    var col = i%self.gridCols;
    if (element.used) {
      if (topRow >= 0 && (topRow + self.gridRows) <= board.gridRows &&
        leftCol >= 0 && (leftCol + self.gridCols) <= board.gridCols) {
      //var boardIndex = (topRow+row)*board.gridCols+leftCol+col;
      //console.log(boardIndex);
      //console.log(board.hexagons.length-1);
      //return boardIndex < board.hexagons.length;
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  function isAvailable(element, i , array) {
    var row = parseInt(i/self.gridCols);
    var col = i%self.gridCols;
    if (element.used) {
      boardIndex = (topRow+row)*board.gridCols+leftCol+col;
      if (board.hexagons[boardIndex].available) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  function setUnavailable(element, i , array) {
    var row = parseInt(i/self.gridCols);
    var col = i%self.gridCols;
    if (element.used) {
      boardIndex = (topRow+row)*board.gridCols+leftCol+col;
      board.hexagons[boardIndex].available = false;
      board.hexagons[boardIndex].pieceIndex = pieceIndex;
      //console.log(pieceIndex);
    }
  };

  if (this.hexagons.every(indexInRange)) {
    if (this.hexagons.every(isAvailable)) {
      this.hexagons.forEach(setUnavailable);
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  };
};

/*Piece.prototype.drawBoundingBox = function () {
  var self = this;
  this.context.save();
  this.context.strokeStyle = 'black';
  this.context.lineWidth="1";
  this.context.setLineDash([5, 3]);
  this.context.rect(this.boundingBox.minX, this.boundingBox.minY,
                        this.boundingBox.maxX-this.boundingBox.minX,
                        this.boundingBox.maxY-this.boundingBox.minY);
  this.context.stroke();
  this.context.restore();
};*/

Piece.prototype.includesPos = function (pos) {
  if (pos.x > this.boundingBox.minX &&
  pos.x < this.boundingBox.maxX &&
  pos.y > this.boundingBox.minY &&
  pos.y < this.boundingBox.maxY) {
    return true;
  } else {
    return false;
  }
};

Piece.prototype.clickHandler = function (pos) {
  //I am using zero indexing on rows and columns
  //console.log('Am I here');
  //console.log(this.hexagons[0].dummy);
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
  return {row: row, col: col};
  //console.log('col ' + col);
  //console.log('row ' + row);
  /*if (this.topMargin === this.origTopMargin) {
    this.leftMargin = 40;
    this.topMargin = 40;
    this.draw();
  } else {
    this.leftMargin = this.origLeftMargin;
    this.topMargin = this.origTopMargin;
    this.draw();
    board.draw();
  }*/

  /*if (!this.completed) {
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
    this.hexagons[row*this.gridCols+col].draw(this.leftMargin, this.topMargin, this.size);
  }*/
}

module.exports = Piece;
