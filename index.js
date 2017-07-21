// orderModule gets the value of 'exports'
//var orderModule = require('./order-module');
//console.log(orderModule.getOrderId()); // evaluates to 123

var c1 = document.getElementById("myCanvas");
var ctx1 = c1.getContext("2d");

var c2 = document.getElementById("pieceGenerator");
var ctx2 = c2.getContext("2d");



function Hexagon(ctx, x, y, size) {
  this.x = x; //the x-cord of the top left corner of the hexagon
  this.y = y; //the y-cord of the top left corner of the hexagon
  this.size = size; // the distance between the 2 top corners of the rectangle
  this.available = false; //determines the color of the cell; changed when cell is clicked
  this.visible = true; //determines of the cell should be drawn
  this.draw = function () {
    ctx.beginPath();
    ctx.lineWidth="2";
    if (this.visible) {
      ctx.strokeStyle="grey";
    } else {
      ctx.strokeStyle="white";
    }
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x+this.size, this.y);
    ctx.lineTo(this.x+1.5*this.size, this.y+0.85*this.size);
    ctx.lineTo(this.x+this.size, this.y+1.7*this.size);
    ctx.lineTo(this.x, this.y+1.7*this.size);
    ctx.lineTo(this.x-0.5*this.size, this.y+0.85*this.size);
    ctx.closePath();
    if (this.visible) {
      if (this.available) {
        ctx.fillStyle = 'black';
      } else {
        ctx.fillStyle = 'yellow';
      }
    } else {
      ctx.fillStyle = 'white';
    }
    ctx.fill();
    ctx.stroke();
  };
};

function Board(ctx, gridSize, size, leftMargin, topMargin) {
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
  }
}

gridSize = 10;
size = 20;
leftMargin = 20;
topMargin = 40;

board = new Board(ctx1, gridSize, size, leftMargin, topMargin);

pieceGenerator = new Board(ctx2, gridSize, size, leftMargin, topMargin);

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

function lockBoard() {
// the objective of this function is to trim all the unnecessary cells from around the container
  board.hexagons.forEach(function(e) {
  //console.log(e)
    if (e.available === false) {
      e.visible = false;
      e.draw();
    }
  });
  board.locked = true;
  console.log(analyzeHexagons(board.hexagons));
};

function createPiece() {
// the objective of this function is to trim all the unnecessary cells from around a peice
  pieceGenerator.hexagons.forEach(function(e) {
    if (e.available === false) {
      e.visible = false;
      e.draw();
    }
  });
  pieceGenerator.locked = true;
  var stats = analyzeHexagons(pieceGenerator.hexagons);
  console.log('Hi');
};

function Piece() {
  this.hexagons = [];
}

function analyzeHexagons(hexagons) {
  var count = hexagons.reduce((count, hex) => count + (hex.visible === true), 0);
  var min = hexagons.reduce((min, hex, i) => Math.min(hex.visible ? i : gridSize*gridSize, min), gridSize*gridSize);
  var max = hexagons.reduce((max, hex, i) => Math.max(hex.visible ? i : 0, max), 0);
  minRow = parseInt(min/gridSize)+1;
  maxRow = parseInt(max/gridSize)+1;
  var minCol = hexagons.reduce((min, hex, i) => Math.min(hex.visible ? i%gridSize : gridSize, min), gridSize)+1;
  var maxCol = hexagons.reduce((max, hex, i) => Math.max(hex.visible ? i%gridSize : 0, max), 0)+1;
  return {count: count, minRow: minRow, maxRow: maxRow, minCol: minCol, maxCol: maxCol};
};

  /*var margin = 5;
  var cellSize = 50;

  var moveInProgress = false;
  var otherIndex = null;
  var solved = false;

  var settingColors = false;
  var currentColorIndex = 0;

  var settingMoves = false;
  var currentMoveIndex = 0;

  //var

  var colors = ['orange', 'yellow', 'green', 'red', 'blue', 'purple', 'cyan'];

  moves = [];


  function ColorSet(row, color) {
    this.row = row;
    this.color = color;
    this.selected = false;
    this.draw = function () {
      //console.log('this.col: ' + this.col + 'this.row' + this.row);
      var margin = 5;
      var cellSize = 50;
      ctx.fillStyle = this.color;
      ctx.fillRect((boardSize + 6)*cellSize+margin, (this.row-1)*cellSize+margin, 50-2*margin, 50-2*margin);
      if (this.selected) {
        ctx.beginPath();
        ctx.lineWidth="2";
        ctx.strokeStyle="black";
        ctx.rect((boardSize + 6)*cellSize, (this.row-1)*cellSize, 50, 50);
        ctx.stroke();
      };
    };
  };

  function MoveSet(row, moves) {
    this.row = row;
    this.moves = moves;
    this.selected = false;
    this.draw = function () {
      //console.log('this.col: ' + this.col + 'this.row' + this.row);
      var margin = 5;
      var cellSize = 50;
      ctx.fillStyle = 'lightgrey';
      ctx.fillRect((boardSize + 8)*cellSize+margin, (this.row-1)*cellSize+margin, 50-2*margin, 50-2*margin);
      for (var i = 0; i < this.moves; i++) {
        ctx.beginPath();
        if (this.moves == 1) {
          ctx.arc((boardSize + 8)*cellSize+25, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 2 && i == 0) {
          ctx.arc((boardSize + 8)*cellSize+20, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 2 && i == 1) {
          ctx.arc((boardSize + 8)*cellSize+30, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 3 && i == 0) {
          ctx.arc((boardSize + 8)*cellSize+25, (this.row-1)*cellSize+20, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 3 && i == 1) {
          ctx.arc((boardSize + 8)*cellSize+20, (this.row-1)*cellSize+30, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 3 && i == 2) {
          ctx.arc((boardSize + 8)*cellSize+30, (this.row-1)*cellSize+30, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 4 && i == 0) {
          ctx.arc((boardSize + 8)*cellSize+20, (this.row-1)*cellSize+20, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 4 && i == 1) {
          ctx.arc((boardSize + 8)*cellSize+30, (this.row-1)*cellSize+20, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 4 && i == 2) {
          ctx.arc((boardSize + 8)*cellSize+20, (this.row-1)*cellSize+30, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 4 && i == 3) {
          ctx.arc((boardSize + 8)*cellSize+30, (this.row-1)*cellSize+30, 3, 0, 2 * Math.PI, false);
        } else if ((this.moves == 5 || this.moves == 6) && i == 0) {
          ctx.arc((boardSize + 8)*cellSize+15, (this.row-1)*cellSize+15, 3, 0, 2 * Math.PI, false);
        } else if ((this.moves == 5 || this.moves == 6) && i == 1) {
          ctx.arc((boardSize + 8)*cellSize+15, (this.row-1)*cellSize+35, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 5 && i == 2) {
          ctx.arc((boardSize + 8)*cellSize+25, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 6 && i == 2) {
          ctx.arc((boardSize + 8)*cellSize+15, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if ((this.moves == 5 || this.moves == 6) && i == 3) {
          ctx.arc((boardSize + 8)*cellSize+35, (this.row-1)*cellSize+15, 3, 0, 2 * Math.PI, false);
        } else if ((this.moves == 5 || this.moves == 6) && i == 4) {
          ctx.arc((boardSize + 8)*cellSize+35, (this.row-1)*cellSize+35, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 6 && i == 5) {
          ctx.arc((boardSize + 8)*cellSize+35, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        };
        ctx.fillStyle = 'black';
        ctx.fill();
      };
      if (this.selected) {
        ctx.beginPath();
        ctx.lineWidth="2";
        ctx.strokeStyle="black";
        ctx.rect((boardSize + 8)*cellSize, (this.row-1)*cellSize, 50, 50);
        ctx.stroke();
      };
    };
  };

  function Row(row, color) {
    this.row = row;
    this.color = color;
    this.draw = function () {
      //console.log('this.col: ' + this.col + 'this.row' + this.row);
      var margin = 5;
      var cellSize = 50;
      ctx.fillStyle = this.color;
      ctx.fillRect((boardSize+1)*cellSize+margin, (this.row-1)*cellSize+margin, 50-2*margin, 50-2*margin);
    };
  };

  function Cell(row, col, color, moves) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.moves = moves;
    this.ok = false;
    this.selected = false;
    this.draw = function () {
      if (this.moves > 0 || this.color == board.rows[this.row-1].color) {
        ctx.fillStyle = this.color;
      } else {
        ctx.fillStyle = 'black';
      };
      ctx.fillRect((this.col-1)*cellSize+margin, (this.row-1)*cellSize+margin, 50-2*margin, 50-2*margin);
      for (var i = 0; i < this.moves; i++) {
        ctx.beginPath();
        if (this.moves == 1) {
          ctx.arc((this.col-1)*cellSize+25, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 2 && i == 0) {
          ctx.arc((this.col-1)*cellSize+20, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 2 && i == 1) {
          ctx.arc((this.col-1)*cellSize+30, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 3 && i == 0) {
          ctx.arc((this.col-1)*cellSize+25, (this.row-1)*cellSize+20, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 3 && i == 1) {
          ctx.arc((this.col-1)*cellSize+20, (this.row-1)*cellSize+30, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 3 && i == 2) {
          ctx.arc((this.col-1)*cellSize+30, (this.row-1)*cellSize+30, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 4 && i == 0) {
          ctx.arc((this.col-1)*cellSize+20, (this.row-1)*cellSize+20, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 4 && i == 1) {
          ctx.arc((this.col-1)*cellSize+30, (this.row-1)*cellSize+20, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 4 && i == 2) {
          ctx.arc((this.col-1)*cellSize+20, (this.row-1)*cellSize+30, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 4 && i == 3) {
          ctx.arc((this.col-1)*cellSize+30, (this.row-1)*cellSize+30, 3, 0, 2 * Math.PI, false);
        } else if ((this.moves == 5 || this.moves == 6) && i == 0) {
          ctx.arc((this.col-1)*cellSize+15, (this.row-1)*cellSize+15, 3, 0, 2 * Math.PI, false);
        } else if ((this.moves == 5 || this.moves == 6) && i == 1) {
          ctx.arc((this.col-1)*cellSize+15, (this.row-1)*cellSize+35, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 5 && i == 2) {
          ctx.arc((this.col-1)*cellSize+25, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 6 && i == 2) {
          ctx.arc((this.col-1)*cellSize+15, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        } else if ((this.moves == 5 || this.moves == 6) && i == 3) {
          ctx.arc((this.col-1)*cellSize+35, (this.row-1)*cellSize+15, 3, 0, 2 * Math.PI, false);
        } else if ((this.moves == 5 || this.moves == 6) && i == 4) {
          ctx.arc((this.col-1)*cellSize+35, (this.row-1)*cellSize+35, 3, 0, 2 * Math.PI, false);
        } else if (this.moves == 6 && i == 5) {
          ctx.arc((this.col-1)*cellSize+35, (this.row-1)*cellSize+25, 3, 0, 2 * Math.PI, false);
        };
        ctx.fillStyle = 'black';
        ctx.fill();
      };
      if (this.selected) {
        ctx.beginPath();
        ctx.lineWidth="2";
        ctx.strokeStyle="black";
        ctx.rect((this.col-1)*cellSize, (this.row-1)*cellSize, 50, 50);
        ctx.stroke();
      };
    };
  };


  function Board() {
    this.cells = [];
    this.rows = [];
    this.colorSet = [];
    this.moveSet = [];
    this.locked = false;
    this.init = function () {
      boardSize = parseInt($('#boardSize').val());
      for (var i = 1; i <= boardSize; i++) {
        for (var j = 1; j <= boardSize; j++) {
          board.cells.push(new Cell(i, j, 'black', 0));
        };
        board.rows.push(new Row(i, 'black'));
        board.colorSet.push(new ColorSet(i, colors[i-1]));
        board.moveSet.push(new MoveSet(i, i));
      };
    };
    this.draw = function () {
      for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
          var cellIndex = i*boardSize + j;
            board.cells[cellIndex].draw();
        };
        board.rows[i].draw();
        drawRowMoveCount(i);
        detectProblems(i);
        board.colorSet[i].draw();
        board.moveSet[i].draw();
      };

      var anomalyCount = 0;
      for (var i = 0; i < boardSize; i++) {
        drawColMoveCount(i);
        anomalyCount += drawColColorCount(i);
      };
      drawStatistics(anomalyCount);
      drawMoreStatistics();
    };
  };

  function drawMoreStatistics () {
    for (var tarRow = 0; tarRow < boardSize; tarRow++) {
      var targetColor = board.rows[tarRow].color;
      if (targetColor != 'black') { //scan the board for this color and accumulate moves
        var thisColor = 0;
        var thisColorNeeds = 0;
        for (var col = 0; col < boardSize; col++) {
          var firstinCol = -1;
          for (var row = 0; row < boardSize; row++) {
            if (board.cells[row*boardSize+col].color == targetColor) {
              thisColor += board.cells[row*boardSize+col].moves;
              if (row == tarRow) {
                thisColorNeeds += firstinCol + 1;
              } else {
                thisColorNeeds += firstinCol + 2;
              };
              firstinCol = 0;
            };
          };
        };
      };
      ctx.font = "10px Comic Sans MS";
      ctx.fillStyle = "black";
      ctx.fillText(targetColor.substring(0,3) + ': ' + thisColor + ' : ' + thisColorNeeds + ' : ' + (thisColor-thisColorNeeds),
       (boardSize+9)*cellSize+18, tarRow*cellSize+35);
    };
  };

  function drawStatistics(anomalyCount) {
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText('Cell Ok: ' + getOkCellCount(), 18, (boardSize+1)*cellSize+(boardSize+3)*15);
    ctx.fillText('Row Ok: ' + getOkRowCount(), 18, (boardSize+1)*cellSize+(boardSize+5)*15);
    ctx.fillText('Column Anomaly Count: ' + anomalyCount, 18, (boardSize+1)*cellSize+(boardSize+7)*15);
    ctx
    //drawOkRowCount();
    //drawColAnomalyCount();
  };

  function getNotOkColCount() {
    var notOkColCount = 0;
    for (var col = 0; col < boardSize; col++) {
      for (var i = 0; i < boardSize; i++) {
        var colorCount = 0;
        for (var j = 0; j < boardSize; j++) {
          if (board.cells[j*boardSize + col].color == board.rows[i].color) {
           colorCount++;
          };
        };
        if (colorCount != 1) {
          notOkColCount++;
        };
      };
    };
    return notOkColCount;
  };

  function getOkCellCount() {
    var okCellCount = 0;
    board.cells.forEach(function(entry) {
      if (entry.ok) {
        okCellCount++;
      };
    });
    return okCellCount;
  };

  function getOkRowCount() {
    var okRowCount = 0;
    board.cells.forEach(function(entry) {
      if (entry.color == board.rows[entry.row-1].color) {
        okRowCount++;
      };
    });
    return okRowCount;
  };

  function detectProblems(i) {
    var rowCorrectColor = true;
    var text = '';
    //Are all columns in a row the correct color
    for (var j = 0; j < boardSize; j++) {
      if (board.cells[i*boardSize + j].color != board.rows[i].color) {
        rowCorrectColor = false;
        break;
      };
    };

    if (rowCorrectColor) {
      var moveCount = 0;
      for (var j = 0; j < boardSize; j++) {
        moveCount += board.cells[i*boardSize+j].moves;
      };
    }
    if (rowCorrectColor && moveCount%2 == 1) {
      text = 'Odd number of moves in this row';
    } else {
      text = 'Ok';
    };

    var rowContainsError = false;
    for (var j = 0; j < boardSize; j++) {
      if (board.cells[i*boardSize+j].moves == 0 && board.cells[i*boardSize+j].color != board.rows[i].color) {
        rowContainsError = true;
        break;
      };
    };
    if (rowContainsError) {
      text = 'Row is incorrect';
    }

    //looking for single dot that cannot move to its target
    for (var j = 0; j < boardSize; j++) {
      var targetRow = parseInt(getRowWithColor(board.cells[i*boardSize+j].color)+1);
      if (board.cells[i*boardSize+j].moves == 1 && board.cells[(targetRow-1)*boardSize+j].moves == 0) {
        rowContainsError = true;
        break;
      };
    };
    if (rowContainsError) {
      text = 'Target Row is unavailable';
    }

    ctx.font = "10px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText(text, (boardSize+3)*cellSize+18, i*cellSize+35);
    if (text == 'Ok') {
      return false;
    } else {
      return true;
    };
  };

  function detectCellProblems(i) {
    //Can I fix this cell?
    var problem = false;
    var targetColor = board.rows[parseInt(i/boardSize)].color
    //console.log(targetColor);
    if (board.cells[i].color != targetColor) {
      problem = true;
      //console.log(i + 'is incorrect color');
      //Is there a cell in this column that is the right color
      for (var j = i%boardSize; j < boardSize*boardSize; j += boardSize) {
        if (board.cells[j].color == targetColor && board.cells[j].moves > 0) {
          //console.log(i + 'can be column fixed');
          problem = false;
        };
      };
      //Is there a cell in this row that is the right color
      //console.log(parseInt(i/boardSize)*boardSize + ' ' + parseInt(i/boardSize+1)*boardSize);
      for (var j = parseInt(i/boardSize)*boardSize; j < parseInt(i/boardSize+1)*boardSize; j++) {
        //console.log(board.cells[j].color+board.cells[j].moves);
        if (board.cells[j].color == targetColor && board.cells[j].moves > 0) {
          //console.log(i + 'can be row fixed');
          problem = false;
        };
      };
      //Is there a cell on the board with more than 1 move
      for (var j = 0; j < boardSize*boardSize; j++) {
        if (board.cells[j].color == targetColor && board.cells[j].moves > 1) {
          //console.log(i + 'can fixed by 2 moves');
          problem = false;
        };
      };
    };
    if (problem) {
      //console.log(i + 'has a problem');
      return true;
    } else {
      return false;
    };
  };

  function drawColColorCount(col) {
    var anomalyCount = 0;
    for (var i = 0; i < boardSize; i++) {
      var colorCount = 0;
      for (var j = 0; j < boardSize; j++) {
        if (board.cells[j*boardSize + col].color == board.rows[i].color) {
         colorCount++;
        };
      };
      if (colorCount != 1) {
        anomalyCount++;
        ctx.font = "10px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.fillText(board.rows[i].color.substring(0,3) + ': ' + colorCount, col*cellSize+18, (boardSize+1)*cellSize+(i+1)*15);
      };
    };
    return anomalyCount;
  };

  function drawColMoveCount(i) {
    var moveCount = 0;
    for (var j = 0; j < boardSize; j++) {
      moveCount += board.cells[j*boardSize+i].moves;
    };
    //console.log(moveCount);
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText(moveCount, i*cellSize+18, (boardSize)*cellSize+35);
  };

  function drawRowMoveCount(i) {
    var moveCount = 0;
    for (var j = 0; j < boardSize; j++) {
      moveCount += board.cells[i*boardSize+j].moves;
    };
    //console.log(moveCount);
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText(moveCount, (boardSize+2)*cellSize+18, i*cellSize+35);
  };

  function moveAllowed(cellIndex) {
    //console.log('otherIndex: ' + otherIndex + 'cellIndex: ' + cellIndex);
    if (board.cells[cellIndex].moves > 0 && board.cells[otherIndex].moves > 0) {
      return true;
    } else {
      return false;
    };
  };*/

/*			var pos = getMousePos(c, e);
    console.log('pos.x ' +pos.x);
    console.log('pos.y ' +pos.y);
    if (settingColors) {
      if (pos.x > (boardSize + 6)*cellSize && pos.x < (boardSize + 7)*cellSize && pos.y > 0 && pos.y < boardSize*cellSize) {
        board.colorSet[currentColorIndex].selected = false;
        currentColorIndex = parseInt(pos.y/cellSize)
        board.colorSet[currentColorIndex].selected = true;
      } else if (pos.x > (boardSize+1)*cellSize && pos.x < (boardSize+4)*cellSize && pos.y > 0 && pos.y < boardSize*cellSize) { //must be on the board
        //var cellIndex = parseInt(pos.y/cellSize)*boardSize + parseInt(pos.x/cellSize);
        var rowIndex = parseInt(pos.y/cellSize)
        board.rows[rowIndex].color = colors[currentColorIndex];
      } else if (pos.x > 0 && pos.x < boardSize*cellSize && pos.y > 0 && pos.y < boardSize*cellSize) { //must be on the board
        var cellIndex = parseInt(pos.y/cellSize)*boardSize + parseInt(pos.x/cellSize);
        //console.log(cellIndex);
        board.cells[cellIndex].color = colors[currentColorIndex];
        board.cells[cellIndex].moves = 1;
      };

    } else if (settingMoves) {
      if (pos.x > (boardSize + 8)*cellSize && pos.x < (boardSize + 9)*cellSize && pos.y > 0 && pos.y < boardSize*cellSize) {
        board.moveSet[currentMoveIndex].selected = false;
        currentMoveIndex = parseInt(pos.y/cellSize)
        board.moveSet[currentMoveIndex].selected = true;
      } else if (pos.x > 0 && pos.x < boardSize*cellSize && pos.y > 0 && pos.y < boardSize*cellSize) { //must be on the board
        var cellIndex = parseInt(pos.y/cellSize)*boardSize + parseInt(pos.x/cellSize);
        //console.log(cellIndex);
        board.cells[cellIndex].moves = currentMoveIndex + 1;
      };

    } else {
      if (pos.x > 0 && pos.x < boardSize*cellSize && pos.y > 0 && pos.y < boardSize*cellSize) { //must be on the board
        var cellIndex = parseInt(pos.y/cellSize)*boardSize + parseInt(pos.x/cellSize);
        if (moveInProgress && cellIndex == otherIndex) {
          board.cells[cellIndex].selected = false;
          moveInProgress = false;
          otherIndex = null;
        } else if (moveInProgress && moveAllowed(cellIndex)) {
          move(otherIndex, cellIndex);
        } else if (board.cells[cellIndex].moves > 0) {
          board.cells[cellIndex].selected = true;
          moveInProgress = true;
          otherIndex = cellIndex;
        };
      };
    };
  };

  /*function move(index1, index2) {
    moves.push([index1, index2, 0, 0, 0, 0]);
    var tempColor = board.cells[index1].color;
    board.cells[index1].color = board.cells[index2].color;
    board.cells[index2].color = tempColor;
    var tempMoves = board.cells[index1].moves;
    board.cells[index1].moves = board.cells[index2].moves-1;
    board.cells[index2].moves = tempMoves-1;
    board.cells[index1].selected = false;
    moveInProgress = false;
    otherIndex = null;
    if (board.cells[index1].moves == 0 && board.cells[index1].color == board.rows[parseInt(index1/boardSize)].color) {
      board.cells[index1].ok = true;
    };
    if (board.cells[index2].moves == 0 && board.cells[index2].color == board.rows[parseInt(index2/boardSize)].color) {
      board.cells[index2].ok = true;
    };
    moves[moves.length-1][2] = getOkCellCount();
    moves[moves.length-1][3] = getOkRowCount();
    moves[moves.length-1][4] = getNotOkColCount();
    if (moves.length > 1)
    moves[moves.length-1][5] = moves[moves.length-1][2] + moves[moves.length-1][3] - moves[moves.length-1][4]
      - (moves[moves.length-2][2] + moves[moves.length-2][3] - moves[moves.length-2	][4])
    if (boardSolved()) {
      $('#result').html('The board is solved.');
    } else {
      $('#result').empty();
    }
    listAllMoves();
    displayMoves();
  };

  function boardSolved () {
    for (var i = 0; i < board.cells.length; i++) {
      if (!board.cells[i].ok) {
        return false;
      };
    };
    return true;
  };*/


  /*function start() {
    interval = setInterval(loop, intervalDelay);
  };

  function loop() {
    //console.log('Looping');
    ctx.clearRect(0, 0, c.width, c.height);
    board.draw();
    //listMoves(otherIndex);
  };

  function stop() {
    clearInterval(interval);
  };

  function listAllMoves() {
    //console.log('Move List');
    $('#mandatoryMoves').empty();
    $('#mandatoryMoves').append('<p>Mandatory Move List</p>');
    for (var i = 0; i < boardSize * boardSize; i++) {
      listMoves(i);
    }
  }
  function listMoves(otherIndex) {
    //How many moves are available? If one, is the cell the right color?
    if (otherIndex != null) {
      var rowIndex = parseInt(otherIndex/boardSize);
      var colIndex = parseInt(otherIndex%boardSize);
      if (board.cells[otherIndex].moves == 1) {
        //console.log('One move available');
        if (board.cells[otherIndex].color == board.rows[parseInt(otherIndex/boardSize)].color) {
          //console.log('Row: ' + parseInt(rowIndex+1) + ' Col: ' + parseInt(colIndex+1) + 'must move horizontally');
        } else {
          var targetRow = parseInt(getRowWithColor(board.cells[otherIndex].color)+1);
          //console.log('Row: ' + parseInt(rowIndex+1) + ' Col: ' + parseInt(colIndex+1) + 'must move vertically to row ' + targetRow);
          var targetIndex = (targetRow-1)*boardSize + colIndex;
          if (board.cells[targetIndex].moves == 1) {
            $('#mandatoryMoves').append('<p>Vertial Swap: Col: ' + indexToCol(otherIndex) +
            ' Row: ' + indexToRow(otherIndex) +
            ' to Row: ' + targetRow + '</p>');
            //console.log('Vertial Swap: Col: ' + indexToCol(otherIndex) +
            //' Row: ' + indexToRow(otherIndex) +
            //' to Row: ' + targetRow);
          };
        };
      } else {
        //console.log(board.cells[otherIndex].moves + ' moves available');
      };
    };
  };

  function getRowWithColor(color) {
    for (var i = 0; i < boardSize; i++) {
      if (board.rows[i].color == color) {
        return i;
      };
    };
  };

  function indexToRow (cellIndex) {
    return parseInt(cellIndex/boardSize)+1;
  };

  function indexToCol (cellIndex) {
    return cellIndex%boardSize+1;
  };

  function displayMoves() {
    $('#moves').empty();
    $('#moves').append('<p>History Of All Moves</p>');
    for (var i = 0; i < moves.length; i++) {
      if (indexToCol(moves[i][0]) == indexToCol(moves[i][1])) {
        $('#moves').append('<p><pre>Vertical Swap:   Col: ' + indexToCol(moves[i][0]) +
        ' Row: ' + indexToRow(moves[i][0]) +
        ' to Row: ' + indexToRow(moves[i][1]) +
        '         Cell Ok: ' + moves[i][2] + ' Row Ok: ' + moves[i][3] + ' Col Not Ok: ' + moves[i][4] +
        ' Diff: ' + moves[i][5] + '</pre></p>');
      } else if (indexToRow(moves[i][0]) == indexToRow(moves[i][1])) {
        $('#moves').append('<p><pre>Horizontal Swap: Row: ' + indexToRow(moves[i][0]) +
        ' Col: ' + indexToCol(moves[i][0]) +
        ' to Col: ' + indexToCol(moves[i][1]) +
        '         Cell Ok: ' + moves[i][2] + ' Row Ok: ' + moves[i][3] + ' Col Not Ok: ' + moves[i][4] +
        ' Diff: ' + moves[i][5] + '</pre></p>');
      };
    };
  };

  function undoMove() {
    if (moves.length > 0) {
      //console.log(moves);
      var index1 = moves[moves.length-1][0];
      var index2 = moves[moves.length-1][1];
      var tempColor = board.cells[index1].color;
      board.cells[index1].color = board.cells[index2].color;
      board.cells[index2].color = tempColor;
      var tempMoves = board.cells[index1].moves;
      board.cells[index1].moves = board.cells[index2].moves+1;
      board.cells[index2].moves = tempMoves+1;
      board.cells[index1].ok = false;
      board.cells[index2].ok = false;
      moves.pop();
    };
    listAllMoves();
    displayMoves()
    $('#result').empty();
  };

  function setColor() {
    settingColors = !settingColors;
    if (settingColors) {
      board.colorSet[currentColorIndex].selected = true;
    } else {
      board.colorSet[currentColorIndex].selected = false;
    }
  };

  function setMoves() {
    settingMoves = !settingMoves;
    if (settingMoves) {
      board.moveSet[currentMoveIndex].selected = true;
    } else {
      board.moveSet[currentMoveIndex].selected = false;
    }
  }

  function Leaf(from, to, parent) {
    this.from = from;
    this.to = to;
    this.parent = parent;
    this.new = true;
    this.children = [];
    if (parent) {
      parent.children.push(this);
    };
  };

  var root = new Leaf(null, null, null);

  var parent = root;
  var steps = 0;

  function solve() {
    var terminateSteps = steps + 10000;
    while (!boardSolved() && steps < terminateSteps) {
      singleStep();
    };
  };

  function singleStep() {
    steps++;
    //1console.log('parent.from: ' + parent.from + ' parent.to: ' + parent.to);
    var problems = false;
    if (parent.new) {
      //2console.log('Enumerating parent');
      enumerateMoves(parent);
      parent.new = false;
    };
    if (parent.children.length > 0) {
      //3console.log('Moving ' + parent.children[parent.children.length-1].from + ' ' + parent.children[parent.children.length-1].to);
      move(parent.children[parent.children.length-1].from, parent.children[parent.children.length-1].to);
      for (var i = 0; i < boardSize; i++) {
        if (detectProblems(i)) {
          problems = true;
          break;
        };
      };
      for (var i = 0; i < boardSize*boardSize; i++) {
        if (detectCellProblems(i)) {
          problems = true;
          break;
        };
      };
      if (problems) {
        //4console.log('Move has problems');
        undoMove();
        parent.children.pop();
      } else {
        //5console.log('New parent');
        parent = parent.children[parent.children.length-1];
      };
    } else {
      //6console.log('Back Tracking');
      parent = parent.parent;
      undoMove();
      parent.children.pop();
    };
  };

  function unfinishedRow(row) {
    var targetColor = board.rows[row].color;
    for (var i = 0; i < boardSize; i++) {
      if (board.cells[(row)*boardSize+i].color != targetColor) {
        return false;
      };
    };
    //By this stage we can be sure they are the same color
    for (var i = 0; i < boardSize; i++) {
      if (board.cells[(row)*boardSize+i].moves > 0) {
        return true;
      };
    };
    return false;
  };

  function mostMovesInRowAt(row, otherIndex) {
    var mostMoves = 0;
    var mostMovesIndex = 0
    for (var i = 0; i < boardSize; i++) {
      if (board.cells[(row)*boardSize+i].moves > mostMoves && row*boardSize+i != otherIndex) {
        mostMovesIndex = row*boardSize+i;
        mostMoves = board.cells[(row)*boardSize+i].moves;
      };
    };
    return mostMovesIndex;
  };

  function enumerateMoves(parent) {
    //console.log('In enumerate moves');
    //console.log('Children length' + root.children.length);
    //Are the any obvious safe moves.  Need 1 dot cells in wrong color where the traget cell is one dot and the other color
    for (var i = 0; i < boardSize*boardSize; i++) {
      if (board.cells[i].moves == 1 && board.cells[i].color != board.rows[parseInt(i/boardSize)].color) {
        var targetRow = parseInt(getRowWithColor(board.cells[i].color)+1);
        var targetCell = (targetRow-1)*boardSize + i%boardSize;
        if (board.cells[targetCell].moves == 1 && board.cells[targetCell].color == board.rows[parseInt(i/boardSize)].color) {
          addMove(i, targetCell, parent);
          return;
        };
      };
    };
    //Another special case is if we have a row which is a single color
    for (var i = 0; i < boardSize; i++) {
      if (unfinishedRow(i)) {
        var src = mostMovesInRowAt(i, null);
        var dest = mostMovesInRowAt(i, src);
        addMove(src, dest, parent);
        return;
      }
    }
    //
    for (var i = 0; i < boardSize*boardSize; i++) {
      if (!board.cells[i].ok) {
        if (board.cells[i].color == board.rows[parseInt(i/boardSize)].color && board.cells[i].moves == 1) { // low priority horizontal move is possible
          //console.log('Horizontal is possible')
          for (var j = parseInt(i/boardSize)*boardSize; j < parseInt(i/boardSize + 1)*boardSize; j++) {
            //console.log('Adding children i ' + i + ' + ' + j);
            // con only swap if other cell has 2 moves or 1 if same color
            if (board.cells[j].moves > 1 || (board.cells[j].moves == 1 && board.cells[j].color == board.cells[j].color)) {
              addMove(i, j, parent);
            };
            //console.log('Children length' + root.children.length);
          };
        };
      };
    };
    for (var i = 0; i < boardSize*boardSize; i++) {
      if (!board.cells[i].ok) {
        if (board.cells[i].moves > 1) { //horizontal is possible
          //console.log('Horizontal is possible')
          for (var j = parseInt(i/boardSize)*boardSize; j < parseInt(i/boardSize + 1)*boardSize; j++) {
            //console.log('Adding children i ' + i + ' + ' + j);
            if (board.cells[j].moves > 1 || (board.cells[j].moves == 1 && board.cells[j].color == board.cells[j].color)) {
              addMove(i, j, parent);
            };
            //console.log('Children length' + root.children.length);
          };
        };
        if (board.cells[i].moves > 1) { //any vertical move is possible;
          //console.log('Any Vertical Move');
          for (var j = i%boardSize; j < boardSize*boardSize; j = j+boardSize) {
            //console.log('Adding children i ' + i + ' + ' + j);
            addMove(i, j, parent);
          };
        } else if (board.cells[i].moves == 1) {
          var targetRow = parseInt(getRowWithColor(board.cells[i].color)+1)
          addMove(i, (targetRow-1)*boardSize+i%boardSize, parent);
        };
      };
    };
  };

  function addMove(i, j, parent) {
    //console.log('i ' + i + ' j ' + j);
    if (i != j && !board.cells[j].ok) {
      if (j < i) {
        var index1 = j;
        var index2 = i;
      } else {
        var index1 = i;
        var index2 = j;
      };
      // Need to check if this is new
      var exists = false;
      for (var k = 0; k < parent.children.length; k++) {
        if (parent.children[k].from == index1 && parent.children[k].to == index2) {
          exists = true;
          break;
        };
      };
      if (!exists) {
        //console.log('Adding index1 ' + index1 + ' index2 ' + index2);
        new Leaf(index1, index2, parent);
      };
    };
  };

  var boardJSON;
  var loadedBoard;

  function saveBoard() {
    boardJSON = JSON.stringify(board);
    localStorage.setItem("boardData", boardJSON);
  };

  function loadBoard() {
    loadedBoard = JSON.parse(localStorage.getItem("boardData"));
    for (var i = 0; i < boardSize*boardSize; i++) {
      board.cells[i].color = loadedBoard.cells[i].color;
      board.cells[i].moves = loadedBoard.cells[i].moves;
      board.cells[i].ok = loadedBoard.cells[i].ok;
      board.cells[i].selected = false;
    };
    for (var i = 0; i < boardSize; i++) {
      board.rows[i].color = loadedBoard.rows[i].color;
    };
  };*/
