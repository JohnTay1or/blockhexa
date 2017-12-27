//var Hexagon = require('./hexagon.js')

var Solver = function (size, leftMargin, topMargin) {
  //console.log(size);
  this.size = size;
  this.leftMargin = leftMargin;
  this.topMargin = topMargin;
  //console.log(this.topMargin);
  this.solution = null;
};

Solver.prototype.solver = function () {
  console.log(this.insertPiece());
  //console.log('In solver');
};

Solver.prototype.insertPiece = function () {
  console.log(board.availableCnt());
  if (board.availableCnt() === 0) {
    return('Done');
  } else {
//  if (pieces.some(this.isAvailable)) {
    console.log('Dealing with piece: ' + this.getIndexOfAvailable());
    //console.log(board);
    //consider all available spaces on the board
    for (var i = 0; i < board.hexagons.length; i++) {
      //if (board.hexagons[i].available) {
        console.log('Consider board poistion' + i);
        //console.log(board.hexagons[i].row)
        //board.hexagons[i].available = false;
        var thisPiece = this.getIndexOfAvailable();
        if (pieces[thisPiece].allowed({row: pieces[thisPiece].hexagons[0].row, col: pieces[thisPiece].hexagons[0].col},
                                      {row: board.hexagons[i].row, col: board.hexagons[i].col},
                                      thisPiece)) {
          //Move piece
          //console.log(this.topMargin);
          pieces[thisPiece].topMargin = this.topMargin + board.hexagons[i].row * 0.85 * this.size;
          pieces[thisPiece].leftMargin = this.leftMargin + board.hexagons[i].col * 1.5 * this.size;
          console.log('piece is allowed');
          pieces.forEach(function (p, i) {
            //console.log('Drawing piece ' + i);
            p.draw();
          });
          //pieceGen.draw();
          pieces[thisPiece].available = false;
          //return this.insertPiece();
          if (this.insertPiece() === 'Done') {
            return 'Done';
          };
          pieces[thisPiece].available = true;
          board.clearPiece(thisPiece);
          board.draw();
          pieces.forEach(function (p, i) {
            //console.log('Drawing piece ' + i);
            p.draw();
          });
        } else {
          //console.log('piece is not allowed');
        }
      //}
    }
    //pieces[this.getIndexOfAvailable()].available = false;
    //this.insertPiece();
//  } else {
    //console.log(board.availableCnt)
    //if (board.availableCnt() === 0) {
    //  return('Done');
    //}// else {
    //  return('Not done')
    //}
//  }
  }
};

Solver.prototype.isAvailable = function(e, i, a) {
  return e.available === true;
}

Solver.prototype.getIndexOfAvailable = function() {
  for (var i = 0; i < pieces.length; i++) {
    if (pieces[i].available === true) {
      return i;
    }
  }

}

Solver.prototype.listAvailableHexagons = function() {
  board.hexagons.forEach(function(hex) {
    if (hex.available) {
      console.log({row: hex.row, col: hex.col});
    }
  });
  return null;
}

module.exports = Solver;
