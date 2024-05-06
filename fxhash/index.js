new p5((sketch) => {
  const aspectRatio = 1000 / 1000; // Original aspect ratio (e.g., 1000x600)
  let canvasWidth, canvasHeight;

  // Seeding for consistent randomness
  let seedValue = sketch.int($fx.rand() * 100000);
  sketch.randomSeed(seedValue);
  sketch.noiseSeed(seedValue);

  // Initial values aligned with the old sketch
  let t = 0;
  let tIncrement = 0.0005;
  let globalX, globalY;
  let particleSize = 15;

  let spacingModes = [
    { mode: "regular", spacing: 32, weight: 60 },
    { mode: "dense", spacing: 30, weight: 30 },
    { mode: "densePlus", spacing: 28, weight: 15 },
    { mode: "extreme", spacing: 24, weight: 2 },
  ];

  let shapeModes = [
    { shape: "ellipse", weight: 30 },
    { shape: "rectangle", weight: 20 },
    { shape: "triangle", weight: 15 },
    { shape: "line", weight: 10 },
    { shape: "star", weight: 10 },
    { shape: "angled line", weight: 10 },
    { shape: "cross", weight: 5 },
  ];

  let colorModes = [
    { mode: "checkerboard", weight: 10 },
    { mode: "diagonal lines", weight: 25 },
    { mode: "vertical", weight: 30 },
    { mode: "horizontal stripes", weight: 20 },
    { mode: "grid lines", weight: 10 },
  ];

  const ranges = {
    light: {
      x: [30, 100],
      y: [30, 100],
      globalX: [70, 500],
      globalY: [70, 500],
    },
    mid: {
      //good!
      x: [150, 300],
      y: [150, 300],
      globalX: [300, 450],
      globalY: [300, 450],
    },
    midplus: {
      x: [250, 500],
      y: [250, 500],
      globalX: [400, 550],
      globalY: [400, 550],
    },
    midweird: {
      x: [350, 600],
      y: [100, 300],
      globalX: [400, 550],
      globalY: [150, 550],
    },
    hard: {
      x: [300, 450],
      y: [300, 450],
      globalX: [450, 600],
      globalY: [450, 600],
    },
    chaos: {
      x: [0, 1000],
      y: [0, 1000],
      globalX: [0, 1000],
      globalY: [0, 1000],
    },
  };

  let myXYvalueSets = [
    { name: "random range light", ...getRandomValues("light", sketch) },
    { name: "random range mid", ...getRandomValues("mid", sketch) },
    { name: "random range mid plus", ...getRandomValues("midplus", sketch) },
    { name: "random range mid weird", ...getRandomValues("midweird", sketch) },
    { name: "random range chaos", ...getRandomValues("chaos", sketch) },
    { name: "random range hard", ...getRandomValues("hard", sketch) },
    { name: "flashy", x: 400, y: 0, globalX: 1000, globalY: 0 },
    { name: "hardRain", x: 7, y: 591, globalX: 343, globalY: 368 },
    { name: "gX.gY=0", x: 400, y: 30, globalX: 0, globalY: 0 },
    { name: "z=g", x: 400, y: 500, globalX: 20, globalY: 20 },
    { name: "init", x: 20, y: 200, globalX: 200, globalY: 500 },
    { name: "flight", x: 500, y: 600, globalX: 200, globalY: 200 },
    { name: "school of snakes", x: 150, y: 400, globalX: 200, globalY: 200 },
  ];

  let palettes = {
    jungle: [
      { r: 153, g: 50, b: 204 }, // Orchid purple
      { r: 34, g: 139, b: 34 }, // Deep jungle green
      { r: 0, g: 153, b: 204 }, // Parrot feather blue
      { r: 255, g: 140, b: 0 }, // Tropical sunset orange
    ],
    golid4ever: [
      { r: 87, g: 183, b: 171 },
      { r: 236, g: 101, b: 59 },
      { r: 31, g: 60, b: 67 },
      { r: 248, g: 203, b: 87 },
    ],
    fidenza: [
      { r: 235, g: 228, b: 216 },
      { r: 183, g: 217, b: 205 },
      { r: 209, g: 42, b: 47 },
      { r: 252, g: 188, b: 24 },
    ],
    sunChaser: [
      { r: 62, g: 156, b: 191 },
      { r: 242, g: 196, b: 61 },
      { r: 167, g: 236, b: 242 },
      { r: 241, g: 124, b: 55 },
    ],
    sunflower: [
      { r: 255, g: 204, b: 0 }, // Sunflower yellow
      { r: 101, g: 67, b: 33 }, // Dark seed brown
      { r: 135, g: 206, b: 235 }, // Sky blue
      { r: 124, g: 252, b: 0 }, // Leaf green
    ],
    monochrome: [
      { r: 255, g: 255, b: 255 }, // Pure white
      { r: 192, g: 192, b: 192 }, // Soft gray
      { r: 128, g: 128, b: 128 }, // Deep gray
      { r: 0, g: 0, b: 0 }, // Jet black
    ],
    angelic: [
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
    ],
    vibraSun: [
      { r: 57, g: 0, b: 153 },
      { r: 255, g: 0, b: 84 },
      { r: 255, g: 84, b: 0 },
      { r: 255, g: 189, b: 0 },
    ],
    retroFuture: [
      { r: 23, g: 43, b: 61 },
      { r: 89, g: 173, b: 235 },
      { r: 245, g: 215, b: 189 },
      { r: 234, g: 62, b: 64 },
    ],
  };

  // Select initial configurations randomly
  let { mode: particleSpacingMode, spacing: particleSpacing } =
    weightedRandom(spacingModes);
  let currentXYsetIndex = sketch.floor(sketch.random(myXYvalueSets.length));
  let currentXYset = myXYvalueSets[currentXYsetIndex];
  let shapeMode = weightedRandom(shapeModes).shape;
  let colorMode = weightedRandom(colorModes).mode;
  let currentPalette = palettes[sketch.floor($fx.rand() * palettes.length)];
  let particleData = [];

  currentPaletteName = sketch.random(Object.keys(palettes));
  currentPalette = palettes[currentPaletteName];

  function weightedRandom(items) {
    let totalWeight = items.reduce((total, item) => total + item.weight, 0);
    let choice = Math.random() * totalWeight;
    let sum = 0;

    for (let item of items) {
      sum += item.weight;
      if (sum > choice) {
        return item;
      }
    }
  }

  function getRandomValues(mode, sketch) {
    const local = ranges[mode];
    const values = {
      // Capture values in a variable to log them
      x: sketch.random(local.x[0], local.x[1]),
      y: sketch.random(local.y[0], local.y[1]),
      globalX: sketch.random(local.globalX[0], local.globalX[1]),
      globalY: sketch.random(local.globalY[0], local.globalY[1]),
    };

    // Log the values with a descriptive message
    console.log(`Random values for mode '${mode}':`, values);

    return values;
  }

  function updateTIncrement() {
    tIncrement = sketch.random(0.0001, 0.0002);
    $fx.features({
      "t Increment": tIncrement.toFixed(4),
    });
  }

  sketch.setup = () => {
    updateCanvasSize(); // Set initial canvas size
    sketch.createCanvas(canvasWidth, canvasHeight);
    sketch.noStroke();
    updateTIncrement();

    // Adjust globalX and globalY based on scaled canvas size
    globalX = canvasWidth * 0.2; // Example: 20% of canvas width
    globalY = canvasHeight * 0.2; // Example: 20% of canvas height

    for (let x = 0; x <= sketch.width; x += particleSpacing) {
      for (let y = 0; y <= sketch.height; y += particleSpacing) {
        let colorIndex = getColorIndex(x, y, sketch);
        particleData.push({ x, y, colorIndex });
      }
    }

    $fx.features({
      "shape:": shapeMode,
      "palette name": currentPaletteName,
      "XY value set": currentXYset.name,
      "color mode": colorMode,
      "t =": tIncrement.toFixed(4),
      "particle spacing": particleSpacingMode,
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

  function updateCanvasSize() {
    if (sketch.windowWidth / sketch.windowHeight > aspectRatio) {
      canvasHeight = sketch.windowHeight;
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      canvasWidth = sketch.windowWidth;
      canvasHeight = canvasWidth / aspectRatio;
    }
  }

  sketch.windowResized = () => {
    updateCanvasSize();
    sketch.resizeCanvas(canvasWidth, canvasHeight);
    initializeParticles(); // Reinitialize particles to new layout
  };

  function getColorIndex(x, y, p) {
    switch (colorMode) {
      case "checkerboard":
        return (
          ((Math.floor(x / 32) + Math.floor(y / 32)) % 2) *
          (currentPalette.length - 1)
        );
      case "diagonal lines":
        return Math.floor((x + y) / 32) % currentPalette.length;
      case "vertical":
        return Math.floor(x / 32) % currentPalette.length;
      case "horizontal stripes":
        return horizontalStripes(x, y, p);
      case "grid lines":
        return gridLines(x, y, p);
      default:
        return 0; // Default to first color if mode is undefined
    }
  }

  function horizontalStripes(x, y, p) {
    let numStripes = 10; // Adjust the number of horizontal stripes
    let stripeHeight = p.height / numStripes;
    return Math.floor(y / stripeHeight) % currentPalette.length;
  }

  function gridLines(x, y, p) {
    let gridSize = 50; // Control the size of the grid squares
    // Alternating grid pattern based on both x and y positions
    return (
      ((Math.floor(x / gridSize) + Math.floor(y / gridSize)) % 2) *
      (currentPalette.length - 1)
    );
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
      case "zigzag":
        drawZigzag(x, y, size, color, p);
        break;
      case "cross":
        drawCross(x, y, size, color, p);
        break;
      case "angled line":
        drawAngledLine(x, y, size, color, p);
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
    const lineWidth = 5; // Consistent with the original script
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

  function drawAngledLine(x, y, size, color, p) {
    p.stroke(color.r, color.g, color.b);
    p.strokeWeight(2); // You can adjust the stroke weight as needed
    let angle = p.PI / 4; // 45 degrees, but you can set any angle you like
    let xOffset = size * p.cos(angle);
    let yOffset = size * p.sin(angle);
    p.line(x - xOffset, y - yOffset, x + xOffset, y + yOffset);
    p.noStroke();
  }

  function drawCross(x, y, size, color, p) {
    p.stroke(color.r, color.g, color.b);
    p.strokeWeight(2); // Consistent with other shapes
    p.line(x - size / 2, y, x + size / 2, y); // Horizontal line
    p.line(x, y - size / 2, x, y + size / 2); // Vertical line
    p.noStroke();
  }
});
