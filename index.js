(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Hexagon = require('./hexagon.js')
var HexGrid = require('./hexgrid.js')
var ColorPicker = require('./colorpicker.js')
var CanvasState = require('./canvasstate.js')
var Solver = require('./solver.js')

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

/*var c2 = document.getElementById("pieceGenerator");
var ctx2 = c2.getContext("2d");

var c3 = document.getElementById("pieces");
ctx3 = c3.getContext("2d");*/

var gridRows = 15;
var gridCols = 16;
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

//logging = false;

canvasState = new CanvasState(canvas);

board = new HexGrid(context, 'board', gridRows, gridCols, size, leftMargin, topMargin);

pieceGen = new HexGrid(context, 'pieceGen', gridRows, gridCols, size, 2*leftMargin + 1.5*gridCols*size, topMargin);

colorPicker = new ColorPicker(context, 3*leftMargin + 2*1.5*gridCols*size, topMargin);

solver = new Solver(size, leftMargin, topMargin);

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
  } else if (colorPicker.includesPos(pos)) {
    colorPicker.clickHandler(pos);
  } else {
    var onPiece = false
    pieces.forEach(function (piece, i) {
      if (piece.includesPos(pos)) {
        //console.log('On piece: ' + i );
        piece.clickHandler(pos)
        onPiece = true
      }
    })
    if (!onPiece) {
      console.log('OffBoard');
    }
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

},{"./canvasstate.js":2,"./colorpicker.js":3,"./hexagon.js":4,"./hexgrid.js":5,"./solver.js":7}],2:[function(require,module,exports){
// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Last update December 2011
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
/*function Shape(x, y, w, h, fill) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';
}*/

// Draws this shape to a given context
/*Shape.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}*/

// Determine if a point is inside the shape's bounds
/*Shape.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}*/

var CanvasState = function (canvas) {
  // **** First some setup! ****
  //console.log('In canvas state');
  this.canvas = canvas;
  this.width = canvas.width;
  //console.log(this.width);
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****

  this.valid = false; // when set to false, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;

  // **** Then events! ****

  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function(e) {
    //console.log('Incanvaseventlistener');
    if (board.completed && pieceGen.completed) {
      var mouse = myState.getMouse(e);
      var mx = mouse.x;
      var my = mouse.y;
      //console.log('mx: ' + mx + ' my: ' + my);
      var mySel;
      //var mySelIndex;
      for (i = 0;  i < pieces.length; i++) {
        //console.log('Trying piece: ' + i);
        if (pieces[i].includesPos(mouse)) {
          //console.log(pieces[i].clickHandler(mouse));
          //console.log('On piece: ' + i );
          mySel = pieces[i];
          //mySelIndex = i;
          myState.dragoffx = mx - mySel.origLeftMargin;
          //console.log(myState.dragoffx);
          myState.dragoffy = my - mySel.origTopMargin;
          //console.log(myState.dragoffy);
          myState.dragging = true;
          myState.selection = mySel;
          myState.selectionOffset = pieces[i].clickHandler(mouse);
          myState.selectedPiece = i;
          //need to clear the board of this piece if present
          board.clearPiece(i);
          //console.log('this is the offset of the pieces hexagon')
          //console.log(myState.selectionOffset);
          //console.log('mySel: ' + mySel);
          //console.log('myState.selection: ' + myState.selection);
          myState.valid = false;
          return true;
        };
      };
      // havent returned means we have failed to select anything.
      // If there was an object selected, we deselect it
      if (myState.selection) {
        //console.log('Am I here');
        myState.selection = null;
        myState.valid = false; // Need to clear the old selection border
      }
    }
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    if (myState.dragging){
      var mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.leftMargin = mouse.x - myState.dragoffx;
      myState.selection.topMargin = mouse.y - myState.dragoffy;
      myState.valid = false; // Something's dragging so we must redraw
    }
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    if (board.completed && pieceGen.completed) {
    //you can only release a piece when you are on the board.
      //console.log('dragged piece: ' + myState.selectedPiece);
      var mouse = myState.getMouse(e);
      if (board.includesPos(mouse)) {
        //console.log('On board');
        var gridPos = board.clickHandler(mouse);
        //console.log('this is the offset of the pieces hexagon')
        //console.log(myState.selectionOffset);
        //console.log('this is the offset of the boards hexagon')
        //console.log(gridPos);
        if (gridPos.row <= board.gridRows &&
          gridPos.col <= board.gridRows &&
            myState.selection.allowed(myState.selectionOffset, gridPos, myState.selectedPiece)) {
          //console.log('Move allowed ' + myState.selection.allowed(myState.selectionOffset, gridPos));
          //console.log(myState.selectionOffset);
          /*if (!board.hexagons[0].dummy) {*/
            myState.selection.leftMargin = board.leftMargin + (gridPos.col-myState.selectionOffset.col)*1.5*board.size;
            myState.selection.topMargin = board.topMargin + (gridPos.row-myState.selectionOffset.row)*0.85*board.size;
            myState.valid = false;
            if (board.availableCnt() === 0) {
              alert('The board is solved');
            };
          /*} else {
            myState.selection.leftMargin = board.leftMargin + (gridPos.col-myState.selectionOffset.col)*1.5*board.size;
            myState.selection.topMargin = board.topMargin + (gridPos.row-myState.selectionOffset.row-1)*0.85*board.size;
            myState.valid = false;
          }*/
        } else {
          myState.selection.leftMargin = myState.selection.origLeftMargin;
          myState.selection.topMargin = myState.selection.origTopMargin;
          myState.valid = false;
        };
      } else {
        //console.log('Off board');
        myState.selection.leftMargin = myState.selection.origLeftMargin;
        myState.selection.topMargin = myState.selection.origTopMargin;
        myState.valid = false;
      }
      myState.dragging = false;
    }
  }, true);
  // double click for making new shapes
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    /*myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));*/
  }, true);

  // **** Options! ****

  //this.selectionColor = '#CC0000';
  //this.selectionWidth = 2;
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

/*CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}*/

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid /*&& board.completed && pieceGen.completed*/) {
    //console.log('IncanvasStateDraw');
    var ctx = this.ctx;
    var shapes = this.shapes;
    //console.log('In canvasstate draw');
    this.clear();

    // ** Add stuff you want drawn in the background all the time here **
    board.draw();
    pieceGen.draw();
    colorPicker.draw();
    pieces.forEach(function (p, i) {
      //console.log('Drawing piece ' + i);
      p.draw();
    });

    // draw all shapes
    /*var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      shapes[i].draw(ctx);
    }*/

    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
    }

    // ** Add stuff you want drawn on top all the time here **

    this.valid = true;
  }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}

module.exports = CanvasState;

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();

/*function init() {
  var s = new CanvasState(document.getElementById('myCanvas'));
  s.addShape(new Shape(40,40,50,50)); // The default is gray
  s.addShape(new Shape(60,140,40,60, 'lightskyblue'));
  // Lets make some partially transparent
  s.addShape(new Shape(80,150,60,30, 'rgba(127, 255, 212, .5)'));
  s.addShape(new Shape(125,80,30,80, 'rgba(245, 222, 179, .7)'));
}*/

// Now go make something amazing!

},{}],3:[function(require,module,exports){
var ColorPicker = function (context, leftMargin, topMargin) {
  var self = this;
  this.context = context;
  this.leftMargin = leftMargin;
  this.topMargin = topMargin;
  this.colors = [
    'rgba(251,209,90,1)', //yellow
    'rgba(244,90,146,1)', //pink
    'rgba(127,86,249,1)', //purple
    'rgba(184,247,95,1)', //green
    'rgba(245,136,54,1)', //orange
    'rgba(92,213,246,1)', //blue
    'rgba(38,121,244,1)', //dark blue 2679F4
    'rgba(176,98,73,1)', //brown b06249
    'rgba(81,241,184,1)', //lightgreen 51f1b8
    'rgba(251,193,61,1)', //gold fbc13d
    'rgba(247,76,136,1)', //red f74c88

  ];
  this.selectedColor = this.colors[0];
  this.selectedColorIndex = 0;
  this.boundingBox = {
    minX: leftMargin,
    minY: topMargin,
    maxX: leftMargin+30,
    maxY: topMargin+this.colors.length*40
  };
  this.draw();
};

ColorPicker.prototype.includesPos = function (pos) {
  if (pos.x > this.boundingBox.minX &&
  pos.x < this.boundingBox.maxX &&
  pos.y > this.boundingBox.minY &&
  pos.y < this.boundingBox.maxY) {
    //console.log('In color picker');
    return true;
  } else {
    return false;
  }
};

ColorPicker.prototype.clickHandler = function (pos) {
  if (!pieceGen.completed) {
    this.context.strokeStyle = 'white';
    this.context.rect(this.leftMargin, this.topMargin+this.selectedColorIndex*40, 30, 30);
    this.context.stroke();
    this.context.beginPath();
    var row = parseInt((pos.y-this.boundingBox.minY)/40);
    //console.log(row);
    this.selectedColor = this.colors[row];
    this.selectedColorIndex = row
    this.context.strokeStyle = 'black';
    this.context.rect(this.leftMargin, this.topMargin+this.selectedColorIndex*40, 30, 30);
    this.context.stroke();
  }
  //console.log(this.selectedColor);
}

/*ColorPicker.prototype.hide = function () {
  this.context.fillStyle = 'white';
  this.context.fillRect(this.leftMargin-1, this.topMargin-1, 30+2, 40*this.colors.length+2);
}*/

ColorPicker.prototype.draw = function () {
  //console.log('Am I here');
  if (!pieceGen.completed) {
    //console.log('What about here');
    var self = this;
    this.context.beginPath() //Not sure why this is necessary but it stops the last hexagon having odd shading
    this.colors.forEach(function(color, i) {
      self.context.fillStyle = color;
      self.context.fillRect(self.leftMargin, self.topMargin+i*40, 30, 30);
    });
    this.context.save();
    this.context.lineWidth="2";
    this.context.strokeStyle="black";
    this.context.rect(this.leftMargin, this.topMargin+this.selectedColorIndex*40, 30, 30);
    this.context.stroke();
    this.context.restore();
  }
}

module.exports = ColorPicker;

},{}],4:[function(require,module,exports){
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

Hexagon.prototype.draw = function (xOffset, yOffset, size, isOpaque) {
  //console.log('yOffset: ' + yOffset + ' isOpaque: ' + isOpaque);
  //console.log(xOffset);
  //the x and y offsets determine the postion of the centre of the 0 hexagon
  //the other hexagons positions use the col and row to determine the position relative to cell 0
  //if ( !this.dummy ) {
  if ( this.used || this.available ) {
    this.context.save();
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
      //this.context.strokeStyle="white";temporary
    }
    this.context.stroke();

    if (this.visible) {
      /*console.log(opacity);
      if (opacity) {
        console.log('Am I here');
        console.log(opacity);
        this.context.globalAlpha = opacity;
        this.'rgba(251,209,90,1)'
      };*/
      //this.context.globalAlpha = 0.1
      if (isOpaque) {
        //console.log('Am I here');
        this.context.fillStyle = this.addOpacity(this.color); //'rgba(251,209,90,0.1)';
      } else {
        this.context.fillStyle = this.color;
      }
      //console.log('I should be a color');
    } else {
      //console.log('I should be white');
      //this.context.fillStyle = 'white';temporary
    }
    //console.log(this.context.fillStyle);
    this.context.fill();
    //this.context.beginPath();
    this.context.restore();
    //this.context.beginPath();
    //this.context.stroke();
  };
};

Hexagon.prototype.addOpacity = function (color) {
  var newColor = color.replace(/[^,]+(?=\))/, '0.5');
  //console.log(newColor);
  return newColor
};

module.exports = Hexagon;

},{}],5:[function(require,module,exports){
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

HexGrid.prototype.availableCnt = function () {
  return this.hexagons.reduce((count, hex) => count + (hex.available === true), 0);
}

HexGrid.prototype.complete = function (done) {
  //console.log(done)
  // the objective of this function is to trim all the unnecessary cells from around the container
  if (!this.completed) {
    var self = this;
    this.minimize();

    if (this.type === 'board') {
      this.analysis = this.analyze();
    }

    if (this.type === 'pieceGen') {
      var analysis = this.analyze();
      if (analysis.count > 0) {
        pieces.push(new Piece(this.context, this.hexagons, analysis, this.size));
        this.hexagons = this.init();
        this.gridRows = this.origGridRows;
        this.gridCols = this.origGridCols;
        //console.log('Here');
        canvasState.valid = false;
        canvasState.draw();
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
    if (board.completed && pieceGen.completed) {
      if (board.analysis.count > pieces.reduce((count, piece) => count + piece.analysis.count, 0)) {
        alert('Not enough hexagons in peices');
        this.completed = false;
        this.hexagons = this.init();
        canvasState.valid = false;
        canvasState.draw();
      } else if (board.analysis.count < pieces.reduce((count, piece) => count + piece.analysis.count, 0)) {
        alert('Too many hexagons in peices');
        this.completed = false;
        this.hexagons = this.init();
        if (this.type === 'pieceGen') {
          pieces.pop();
        }
        canvasState.valid = false;
        canvasState.draw();
      }
    }
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

HexGrid.prototype.clearPiece = function (pieceIndex) {
  //console.log('Am I called');
  this.hexagons.forEach(function(hex) {
    //console.log(stats.minRow);
    //console.log(hex.row);
    if (hex.pieceIndex === pieceIndex) {
      hex.pieceIndex = null;
      hex.available = true;
    }
  });
  pieces[pieceIndex].topMargin = pieces[pieceIndex].origTopMargin;
  pieces[pieceIndex].leftMargin = pieces[pieceIndex].origLeftMargin;
};

module.exports = HexGrid;

},{"./hexagon.js":4,"./piece.js":6}],6:[function(require,module,exports){
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

},{"./hexagon.js":4}],7:[function(require,module,exports){
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
  //this.sortedPieces = pieces.slice().sort(compare);
  pieces.sort(compare);
  //console.log(sortedPieces);
  //console.log(this.insertPiece());
  this.insertPiece()
  //console.log('In solver');
};

Solver.prototype.insertPiece = function () {
  //console.log(board.availableCnt());
  if (board.availableCnt() === 0) {
    return('Done');
  } else {
//  if (pieces.some(this.isAvailable)) {
    //console.log('Dealing with piece: ' + this.getIndexOfAvailable());
    //console.log(board);
    //consider all available spaces on the board
    for (var i = 0; i < board.hexagons.length; i++) {
      //if (board.hexagons[i].available) {
        //console.log('Consider board poistion' + i);
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
          //console.log('piece is allowed');
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

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const sizeA = a.hexagons.length;
  const sizeB = b.hexagons.length;

  let comparison = 0;
  if (sizeA > sizeB) {
    comparison = 1;
  } else if (sizeA < sizeB) {
    comparison = -1;
  }
  return comparison*-1;
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

},{}]},{},[1]);
