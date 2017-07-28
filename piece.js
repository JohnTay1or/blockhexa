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
  this.drawBoundingBox();
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

Piece.prototype.drawBoundingBox = function () {
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
};

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
  var col = Math.round((pos.x-this.boundingBox.minX-0.25*this.size)/(1.5*this.size)-0.5);
  if (col % 2 === 0) {
    var row = 2*Math.round((pos.y-this.boundingBox.minY)/(1.7*this.size)-0.5);
  } else {
    var row = 2*Math.round((pos.y-this.boundingBox.minY-0.85*this.size)/(1.7*this.size)-0.5)+1;
  }
  //console.log('col ' + col);
  //console.log('row ' + row);
  if (this.topMargin === this.origTopMargin) {
    this.leftMargin = 40;
    this.topMargin = 40;
    this.draw();
  } else {
    this.leftMargin = this.origLeftMargin;
    this.topMargin = this.origTopMargin;
    this.draw();
    board.draw();
  }

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
