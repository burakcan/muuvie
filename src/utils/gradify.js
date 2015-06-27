var Grad = function(image) {

  this.imageData = this.toImageData(image);

  // Colors which do not catch the eye
  this.ignoredColors = [[0,0,0,], [255,255,255]];

  // Sensitivity to ignored colors
  this.BWSensitivity = 8;

  // Overall sensitivity to closeness of colors.
  this.sensitivity = 1;

  return this.handleData(this.imageData);
}

Grad.prototype.getCanvas = function(img) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0, img.width / 30, img.height / 30)
  return canvas;
}

Grad.prototype.toImageData = function(img) {
  var canvas = this.getCanvas(img);
  var ctx = canvas.getContext("2d");
  return ctx.getImageData(0, 0, img.width / 30, img.height / 30);
};


Grad.prototype.getColorDiff = function(first, second) {
  // *Very* rough approximation of a better color space than RGB.
  return Math.sqrt(Math.abs(1.4*Math.sqrt(Math.abs(first[0]-second[0])) +
      .8*Math.sqrt(Math.abs(first[1]-second[1])) + .8*Math.sqrt(Math.abs(first[2]-second[2]))));
}

Grad.prototype.getColors = function(colors) {
  // Select for dominant but different colors.
  var selectedColors = [],
    flag = false,
    found = false,
    diff,
    old = [];
    sensitivity = this.sensitivity,
    bws = this.BWSensitivity
  while (selectedColors.length < 1 && !found) {
    selectedColors = []
    for (var j=0; j < colors.length; j++) {
      acceptableColor = false;
      // Check curr color isn't too black/white.
      for (var k = 0; k < this.ignoredColors.length; k++) {
        diff = this.getColorDiff(this.ignoredColors[k], colors[j][0])
        if (diff < bws) {
          acceptableColor = true;
          break;
        }
      }
      // Check curr color is not close to previous colors
      for (var g = 0; g < selectedColors.length; g++) {
        diff = this.getColorDiff(selectedColors[g], colors[j][0]);
        if (diff < sensitivity) {
          acceptableColor = true;
          break;
        }
      }
      if (acceptableColor) {
        continue;
      }
      // IF a good color, add to our selected colors!
      selectedColors.push(colors[j][0])
      if (selectedColors.length > 3) {
        found = true;
        break
      }
    }
    // Decrement both sensitivities.
    if (bws > 2) {
      bws -= 1;
    } else {
      sensitivity--;
      if (sensitivity < 0) found = 1;
      // Reset BW sensitivity for new iteration of lower overall sensitivity.
      bws = this.BWSensitivity;
    }
  }
  return selectedColors[0];
}

Grad.prototype.handleData = function(data) {
  // Count all colors and sort high to low.
  var r=0,
    b=0,
    g=0,
    max = 0,
    avg;
  this.data = data;
  colorMap = {};
  sortedColors = [];
  for (i=0;i<data.data.length; i+=4) {
    r = data.data[i]
    g = data.data[i+1]
    b = data.data[i+2]
    // Pad the rgb values with 0's to make parsing easier later.
    var newCol = ("00"+r.toString()).slice(-3) + ("00" + g.toString()).slice(-3) + ("00" + b.toString()).slice(-3);
    if (newCol in colorMap) {
      colorMap[newCol]["val"] += 1
    } else {
      colorMap[newCol] = { "val": 0 };
    }
  }
  var items = Object.keys(colorMap).map(function(key) {
    return [[parseInt(key.slice(0, 3)), parseInt(key.slice(3, 6)), parseInt(key.slice(6, 9))], colorMap[key]["val"]];
  });
  items.sort(function(first, second) {
    return second[1] - first[1];
  });
  this.colMap = colorMap;
  return this.getColors(items)
}

module.exports = Grad;
