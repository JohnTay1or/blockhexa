//var Hexagon = require('./hexagon.js')

var Solver = function () {
  this.solution = null;
};

Solver.prototype.solver = function () {
  console.log(pieces);
  this.insertPiece();
  //console.log('In solver');
};

Solver.prototype.insertPiece = function () {
  if (pieces.some(this.isAvailable)) {
    console.log(this.getIndexOfAvailable());
    pieces[this.getIndexOfAvailable()].available = false;
    this.insertPiece();
  } else {
    console.log('Done');
  }
};

Solver.prototype.isAvailable = function(e, i, a) {
  return e.available === true;
}

Solver.prototype.getIndexOfAvailable = function() {
  for (i=0; i < pieces.length; i++) {
    if (pieces[i].available === true) {
      return i;
    }
  }

}

module.exports = Solver;
