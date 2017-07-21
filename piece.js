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
