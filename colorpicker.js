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
    'rgba(92,213,246,1)' //blue
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
