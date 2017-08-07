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
  if ( !this.dummy ) {
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
      this.context.strokeStyle="white";
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
      this.context.fillStyle = 'white';
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
