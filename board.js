var Hexagon = require('./hexagon.js')

module.exports = function (ctx, gridSize, size, leftMargin, topMargin) {
  this.hexagons = [];
  this.locked = false;
  for (var j = 0; j < gridSize; j++) {
    for (var i = 0; i < gridSize; i++) {
      if (i%2 === 0) {
        this.hexagons.push(new Hexagon(ctx, leftMargin+1.5*i*size, topMargin+size*(1.7*j), size));
      } else {
        this.hexagons.push(new Hexagon(ctx, leftMargin+1.5*i*size, topMargin+(1.7*j+0.85)*size, size));
      }
      this.hexagons[j*gridSize+i].draw()
    }
  };
  this.lock = function () {
  // the objective of this function is to trim all the unnecessary cells from around the container
    this.hexagons.forEach(function(e) {
    //console.log(e)
      if (e.available === false) {
        e.visible = false;
        e.draw();
      }
    });
    this.locked = true;
    //console.log('Hi');
    console.log(this.analyze());
  };
  this.analyze = function () {
    var count = this.hexagons.reduce((count, hex) => count + (hex.visible === true), 0);
    var min = this.hexagons.reduce((min, hex, i) => Math.min(hex.visible ? i : gridSize*gridSize, min), gridSize*gridSize);
    var max = this.hexagons.reduce((max, hex, i) => Math.max(hex.visible ? i : 0, max), 0);
    minRow = parseInt(min/gridSize)+1;
    maxRow = parseInt(max/gridSize)+1;
    var minCol = this.hexagons.reduce((min, hex, i) => Math.min(hex.visible ? i%gridSize : gridSize, min), gridSize)+1;
    var maxCol = this.hexagons.reduce((max, hex, i) => Math.max(hex.visible ? i%gridSize : 0, max), 0)+1;
    return {count: count, minRow: minRow, maxRow: maxRow, minCol: minCol, maxCol: maxCol};
  };
}
