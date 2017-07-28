var ColorPicker = function (context, leftMargin, topMargin) {
  var self = this;
  this.context = context;
  this.leftMargin = leftMargin;
  this.topMargin = topMargin;
  this.colors = [
    '#FBD15A', //yellow
    '#F45A92', //pink
    '#7F56F9', //purple
    '#B8F75F', //green
    '#F58836', //orange
    '#5CD5F6' //blue
  ];
  this.boundingBox = {
    minX: leftMargin,
    minY: topMargin,
    maxX: leftMargin+30,
    maxY: topMargin+this.colors.length*40
  };
  this.context.beginPath() //Not sure why this is necessary but it stops the last hexagon having odd shading
  this.colors.forEach(function(color, i) {
    self.context.fillStyle = color;
    self.context.fillRect(self.leftMargin, self.topMargin+i*40, 30, 30);
  });
  this.selectedColor = this.colors[0]
  this.selectedColorIndex = 0;
  this.context.lineWidth="2";
  this.context.strokeStyle="black";
  this.context.rect(self.leftMargin, self.topMargin, 30, 30);
  this.context.stroke();
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

ColorPicker.prototype.hide = function () {
  this.context.fillStyle = 'white';
  this.context.fillRect(this.leftMargin-1, this.topMargin-1, 30+2, 40*this.colors.length+2);
}

module.exports = ColorPicker;
