var Hexagon = require('./hexagon.js')

var Piece = function (hexagons, analysis) {
  this.hexagons = [];
  for (i = analysis.minRow-1; i < analysis.maxRow; i++) {
    for (j = analysis.minCol-1; j < analysis.maxCol; j++) {
      console.log(hexagons[i*gridSize+j].available);
      this.hexagons.push(new Hexagon(ctx3, leftMargin+1.5*i*size, topMargin+size*(1.7*j), size, this.available));
      this.hexagons[0].draw()
    }
  }
  //console.log(hexagons);
  //console.log(analysis);
};

Piece.prototype.draw = function () {
};

module.exports = Piece;
