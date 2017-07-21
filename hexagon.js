module.exports = function (ctx, x, y, size) {
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
