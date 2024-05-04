new p5((sketch) => {
  // Seeding for consistent randomness
  let seedValue = sketch.int($fx.rand() * 100000);
  sketch.randomSeed(seedValue);
  sketch.noiseSeed(seedValue);

  // Initial values aligned with the old sketch
  let t = 0;
  let tIncrement = 0.0005;
  let globalX = 200;
  let globalY = 200;
  let particleSize = 18;

  // Shape and color mode configurations
  let shapeModes = ["ellipse", "rectangle", "triangle", "line", "star"];
  let colorModes = ["checkerboard", "diagonal lines", "each line"];

  function getRandomValues(mode, sketch) {
    const local = ranges[mode];
    return {
      x: sketch.random(local.x[0], local.x[1]),
      y: sketch.random(local.y[0], local.y[1]),
      globalX: sketch.random(local.globalX[0], local.globalX[1]),
      globalY: sketch.random(local.globalY[0], local.globalY[1]),
    };
  }

  const ranges = {
    light: {
      x: [10, 30],
      y: [10, 30],
      globalX: [100, 200],
      globalY: [100, 200],
    },
    mid: {
      x: [150, 300],
      y: [150, 300],
      globalX: [300, 450],
      globalY: [300, 450],
    },
    hard: {
      x: [300, 450],
      y: [300, 450],
      globalX: [450, 600],
      globalY: [450, 600],
    },
  };

  // Placeholder for XY value sets and palettes
  let myXYvalueSets = [
    { name: "random light", ...getRandomValues("light", sketch) },
    { name: "random mid", ...getRandomValues("mid", sketch) },
    { name: "random hard", ...getRandomValues("hard", sketch) },
    /*{ name: "flashy", x: 400, y: 0, globalX: 1000, globalY: 0 },
    { name: "slotMachine", x: 400, y: 30, globalX: 500, globalY: 0 },
    { name: "gX.gY=0", x: 400, y: 30, globalX: 0, globalY: 0 },
    { name: "zigBrush", x: 400, y: 500, globalX: 20, globalY: 20 },
    { name: "init", x: 20, y: 10, globalX: 200, globalY: 200 },
    { name: "hardSwing", x: 400, y: 30, globalX: 200, globalY: 200 },
    { name: "flight", x: 500, y: 600, globalX: 200, globalY: 200 },
    { name: "schoolOfSnakes", x: 150, y: 400, globalX: 200, globalY: 200 },*/
  ];

  let palettes = {
    "Gold Shades": [
      { r: 0, g: 0, b: 0 },
      { r: 128, g: 100, b: 0 },
      { r: 255, g: 215, b: 0 },
      { r: 255, g: 223, b: 0 },
    ],
    "Blue Tones": [
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 128 },
      { r: 0, g: 0, b: 255 },
      { r: 173, g: 216, b: 230 },
    ],
    "Forest Greens": [
      { r: 1, g: 68, b: 33 },
      { r: 4, g: 77, b: 46 },
      { r: 9, g: 107, b: 61 },
      { r: 34, g: 139, b: 34 },
    ],
    "Sunset Vibrance": [
      { r: 255, g: 87, b: 51 },
      { r: 255, g: 165, b: 0 },
      { r: 238, g: 130, b: 238 },
      { r: 255, g: 99, b: 71 },
    ],
    Monochrome: [
      { r: 255, g: 255, b: 255 },
      { r: 192, g: 192, b: 192 },
      { r: 128, g: 128, b: 128 },
      { r: 0, g: 0, b: 0 },
    ],
    "Pastel Dreams": [
      { r: 255, g: 182, b: 193 },
      { r: 176, g: 224, b: 230 },
      { r: 255, g: 218, b: 185 },
      { r: 240, g: 230, b: 140 },
    ],
    "Ocean Depths": [
      { r: 3, g: 37, b: 76 },
      { r: 3, g: 54, b: 73 },
      { r: 0, g: 88, b: 122 },
      { r: 4, g: 130, b: 119 },
    ],
    Fireside: [
      { r: 178, g: 34, b: 34 },
      { r: 205, g: 92, b: 92 },
      { r: 139, g: 69, b: 19 },
      { r: 165, g: 42, b: 42 },
    ],
    "Spring Blossoms": [
      { r: 255, g: 192, b: 203 },
      { r: 255, g: 240, b: 245 },
      { r: 124, g: 252, b: 0 },
      { r: 127, g: 255, b: 212 },
    ],
    "Winter Chill": [
      { r: 225, g: 255, b: 255 },
      { r: 173, g: 216, b: 230 },
      { r: 0, g: 191, b: 255 },
      { r: 176, g: 224, b: 230 },
    ],
  };

  // Select initial configurations randomly

  let currentXYsetIndex = sketch.floor(sketch.random(myXYvalueSets.length));
  let currentXYset = myXYvalueSets[currentXYsetIndex];
  let shapeMode = shapeModes[sketch.floor($fx.rand() * shapeModes.length)];
  let colorMode = colorModes[sketch.floor($fx.rand() * colorModes.length)];
  let currentPalette = palettes[sketch.floor($fx.rand() * palettes.length)];
  let particleData = [];

  currentPaletteName = sketch.random(Object.keys(palettes));
  currentPalette = palettes[currentPaletteName];

  function updateTIncrement() {
    tIncrement = sketch.random(0.0001, 0.0005);
    $fx.features({
      "t Increment": tIncrement.toFixed(4),
    });
  }

  sketch.setup = () => {
    sketch.createCanvas(1000, 600);
    sketch.noStroke();
    updateTIncrement(); // Initial random increment

    for (let x = 0; x <= sketch.width; x += 32) {
      for (let y = 0; y <= sketch.height; y += 32) {
        let colorIndex = getColorIndex(x, y, sketch);
        particleData.push({ x, y, colorIndex });
      }
    }

    $fx.features({
      "Shape:": shapeMode,
      "Palette Name": currentPaletteName,
      "XY Value Set": currentXYset.name,
      "Color Mode": colorMode,
      "t Increment": tIncrement.toFixed(4),
    });
  };

  sketch.draw = () => {
    sketch.background(15, 10); // Set background to slightly dark to show particle trails

    // Increment time based on the current tIncrement value
    t += tIncrement;

    // Loop through each particle to compute its position and draw it
    particleData.forEach((particle) => {
      let currentColor = currentPalette[particle.colorIndex];
      sketch.fill(currentColor.r, currentColor.g, currentColor.b); // Set the color of the shape

      // Calculate the angle based on globalX and globalY for interesting motion dynamics
      let angle = getAngle(particle.x, particle.y, globalX, globalY, sketch);
      let myX =
        particle.x + currentXYset.x * sketch.cos(32 * sketch.PI * t + angle);
      let myY =
        particle.y + currentXYset.y * sketch.sin(9 * sketch.PI * t + angle);

      // Draw the shape based on the current mode and size at the calculated position
      drawShape(myX, myY, shapeMode, particleSize, currentColor, sketch);
    });
  };

  function getColorIndex(x, y, p) {
    if (colorMode === "checkerboard") {
      // Alternates color based on whether the sum of the indices of the grid cell is odd or even
      return (
        ((Math.floor(x / 32) + Math.floor(y / 32)) % 2) *
        (currentPalette.length - 1)
      );
    } else if (colorMode === "diagonal lines") {
      // Creates diagonal lines by checking the modulo of the sum of the coordinates
      return Math.floor((x + y) / 32) % currentPalette.length;
    } else if (colorMode === "each line") {
      // Consistently apply the same color for each line
      return Math.floor(x / 32) % currentPalette.length;
    }
  }

  function getAngle(x, y, gx, gy, p) {
    const xAngle = p.map(gx, 0, p.width, 0, p.TWO_PI, true);
    const yAngle = p.map(gy, 0, p.height, 0, p.TWO_PI, true);
    return xAngle * (x / p.width) + yAngle * (y / p.height);
  }

  function drawShape(x, y, mode, size, color, p) {
    switch (mode) {
      case "ellipse":
        p.ellipse(x, y, size, size);
        break;
      case "rectangle":
        p.rect(x, y, size, size);
        break;
      case "triangle":
        drawTriangle(x, y, size, p);
        break;
      case "line":
        drawLine(x, y, size, color, p); // Pass the current color to drawLine
        break;
      case "star":
        drawStar(x, y, size, p);
        break;
    }
  }

  function drawTriangle(x, y, size, p) {
    const height = size * (Math.sqrt(3) / 2);
    p.triangle(
      x - size / 2,
      y + height / 2,
      x + size / 2,
      y + height / 2,
      x,
      y - height / 2
    );
  }

  function drawLine(x, y, size, color, p) {
    const lineWidth = 4; // Consistent with the original script
    p.stroke(color.r, color.g, color.b); // Use dynamic color
    p.strokeWeight(lineWidth);
    p.line(x, y, x + size, y + size);
    p.noStroke();
  }

  function drawStar(x, y, size, p) {
    let points = 5; // Example for a star with 5 points
    let angle = p.TWO_PI / points;
    let halfAngle = angle / 2.0;
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      let sx = x + p.cos(a) * size;
      let sy = y + p.sin(a) * size;
      p.vertex(sx, sy);
      sx = x + p.cos(a + halfAngle) * size * 0.5;
      sy = y + p.sin(a + halfAngle) * size * 0.5;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  }
});
