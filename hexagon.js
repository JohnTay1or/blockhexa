var Hexagon = function (ctx, x, y, size, available) {
  this.x = x; //the x-cord of the top left corner of the hexagon
  this.y = y; //the y-cord of the top left corner of the hexagon
  this.size = size; // the distance between the 2 top corners of the rectangle
  this.available = available; //determines the color of the cell; changed when cell is clicked
  this.visible = true; //determines if the cell should be drawn
  this.ctx = ctx;
};

Hexagon.prototype.draw = function () {
  this.ctx.beginPath();
  this.ctx.lineWidth="2";
  if (this.visible) {
    this.ctx.strokeStyle="grey";
  } else {
    this.ctx.strokeStyle="white";
  }
  this.ctx.beginPath();
  this.ctx.moveTo(this.x, this.y);
  this.ctx.lineTo(this.x+this.size, this.y);
  this.ctx.lineTo(this.x+1.5*this.size, this.y+0.85*this.size);
  this.ctx.lineTo(this.x+this.size, this.y+1.7*this.size);
  this.ctx.lineTo(this.x, this.y+1.7*this.size);
  this.ctx.lineTo(this.x-0.5*this.size, this.y+0.85*this.size);
  this.ctx.closePath();
  if (this.visible) {
    if (this.available) {
      this.ctx.fillStyle = 'black';
    } else {
      this.ctx.fillStyle = 'yellow';
    }
  } else {
    this.ctx.fillStyle = 'white';
  }
  this.ctx.fill();
  this.ctx.stroke();
};

module.exports = Hexagon;
