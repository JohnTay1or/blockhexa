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
