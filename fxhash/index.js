new p5((sketch) => {
  const aspectRatio = 1200 / 1000; // Original aspect ratio (e.g., 1000x600)
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
    { shape: "ellipse", weight: 20 },
    { shape: "rectangle", weight: 20 },
    { shape: "triangle", weight: 20 },
    { shape: "line", weight: 30 },
    { shape: "star", weight: 2 },
    { shape: "ghost line", weight: 6 },
    { shape: "cross", weight: 6 },
  ];

  let colorModes = [
    { mode: "checkerboard", weight: 10 },
    { mode: "diagonal line", weight: 25 },
    { mode: "vertical", weight: 30 },
    { mode: "horizontal stripes", weight: 20 },
    { mode: "grid line", weight: 10 },
  ];

  const ranges = {
    light: {
      x: [30, 100],
      y: [30, 100],
      globalX: [70, 500],
      globalY: [70, 500],
    },
    z: {
      //good!
      x: [150, 300],
      y: [150, 300],
      globalX: [300, 450],
      globalY: [300, 450],
    },
    x: {
      x: [250, 500],
      y: [250, 500],
      globalX: [400, 550],
      globalY: [400, 550],
    },
    y: {
      x: [300, 450],
      y: [300, 450],
      globalX: [450, 600],
      globalY: [450, 600],
    },
    $: {
      x: [10, 200],
      y: [500, 700],
      globalX: [300, 400],
      globalY: [300, 400],
    },
    c: {
      x: [20, 150],
      y: [800, 950],
      globalX: [300, 500],
      globalY: [30, 70],
    },
    chaos: {
      x: [0, 1000],
      y: [0, 1000],
      globalX: [0, 1000],
      globalY: [0, 1000],
    },
  };

  let myXYvalueSets = [
    {
      name: "random-range light",
      weight: 10,
      values: getLazyRandomValues("light"),
    },
    {
      name: "random-range z",
      weight: 30,
      values: getLazyRandomValues("z"),
    },
    {
      name: "random-range x",
      weight: 20,
      values: getLazyRandomValues("x"),
    },
    {
      name: "random-range $",
      weight: 30,
      values: getLazyRandomValues("$"),
    },

    {
      name: "random-range chaos",
      weight: 10,
      values: getLazyRandomValues("chaos"),
    },
    {
      name: "random-range y",
      weight: 15,
      values: getLazyRandomValues("y"),
    },
    {
      name: "random-range c",
      weight: 10,
      values: getLazyRandomValues("c"),
    },
    // Keep these as they are, no dynamic values needed
    { name: "f=y", weight: 3, x: 400, y: 0, globalX: 1000, globalY: 0 },
    { name: "hardRain", weight: 10, x: 7, y: 591, globalX: 343, globalY: 368 },
    { name: "gX.gY=0", weight: 2, x: 400, y: 30, globalX: 0, globalY: 0 },
    { name: "z=g", weight: 2, x: 400, y: 500, globalX: 20, globalY: 20 },
    { name: "flight", weight: 8, x: 500, y: 600, globalX: 200, globalY: 200 },
    { name: "snakes", weight: 8, x: 150, y: 400, globalX: 200, globalY: 200 },
  ];

  let palettes = {
    blackGold: [
      { r: 0, g: 0, b: 0 }, // Black
      { r: 255, g: 215, b: 0 }, // Golden yellow
      { r: 255, g: 193, b: 7 }, // Vibrant gold
      { r: 255, g: 127, b: 0 }, // Orange-gold
    ],
    breeze: [
      { r: 174, g: 214, b: 241 }, // Pale sky blue
      { r: 120, g: 190, b: 209 }, // Blue grey
      { r: 35, g: 123, b: 156 }, // Denim blue
      { r: 244, g: 246, b: 247 }, // Off-white
    ],

    tropic: [
      { r: 7, g: 144, b: 77 }, // Jade green
      { r: 254, g: 199, b: 91 }, // Mango yellow
      { r: 247, g: 121, b: 50 }, // Coral red
      { r: 255, g: 255, b: 255 }, // Pure white
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
    angelic: [
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
    ],
    vibrachrome: [
      { r: 57, g: 0, b: 153 },
      { r: 255, g: 0, b: 84 },
      { r: 255, g: 84, b: 0 },
      { r: 255, g: 189, b: 0 },
    ],
    mint: [
      { r: 248, g: 182, b: 45 },
      { r: 227, g: 255, b: 63 },
      { r: 100, g: 252, b: 201 },
      { r: 5, g: 215, b: 224 },
    ],
    bioluminescent: [
      { r: 5, g: 10, b: 30 }, // Deep sea black
      { r: 247, g: 12, b: 190 }, // Jellyfish pink
      { r: 3, g: 252, b: 236 }, // Neon blue
      { r: 20, g: 239, b: 20 }, // Glowing green
    ],
    sunGod: [
      { r: 227, g: 178, b: 0 }, // Sun gold
      { r: 191, g: 87, b: 0 }, // Terra cotta
      { r: 255, g: 245, b: 220 }, // Llama wool white
      { r: 153, g: 27, b: 7 }, // Inca red
    ],
  };

  // Select initial configurations randomly
  let { mode: particleSpacingMode, spacing: particleSpacing } =
    weightedRandom(spacingModes);
  let shapeMode = weightedRandom(shapeModes).shape;
  let colorMode = weightedRandom(colorModes).mode;
  let currentPalette = palettes[sketch.floor($fx.rand() * palettes.length)];
  let particleData = [];
  let currentXYset = weightedRandom(myXYvalueSets);
  if (currentXYset.values) {
    currentXYset = { ...currentXYset, ...currentXYset.values() };
  }

  currentPaletteName = sketch.random(Object.keys(palettes));
  currentPalette = palettes[currentPaletteName];

  function weightedRandom(items) {
    let totalWeight = items.reduce((total, item) => total + item.weight, 0);
    let choice = $fx.rand() * totalWeight;
    let sum = 0;

    for (let item of items) {
      sum += item.weight;
      if (sum > choice) {
        return item;
      }
    }
  }

  function getLazyRandomValues(mode) {
    return () => {
      const local = ranges[mode];
      const values = {
        x: local.x[0] + $fx.rand() * (local.x[1] - local.x[0]),
        y: local.y[0] + $fx.rand() * (local.y[1] - local.y[0]),
        globalX:
          local.globalX[0] + $fx.rand() * (local.globalX[1] - local.globalX[0]),
        globalY:
          local.globalY[0] + $fx.rand() * (local.globalY[1] - local.globalY[0]),
      };
      console.log(`Random values for mode '${mode}':`, values);
      return values;
    };
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
      "palette:": currentPaletteName,
      "xy-values": currentXYset.name,
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

  sketch.windowResized = () => {
    updateCanvasSize();
    sketch.resizeCanvas(canvasWidth, canvasHeight);
  };

  function updateCanvasSize() {
    if (sketch.windowWidth / sketch.windowHeight > aspectRatio) {
      canvasHeight = sketch.windowHeight;
      canvasWidth = canvasHeight * aspectRatio; // Maintain aspect ratio
    } else {
      canvasWidth = sketch.windowWidth;
      canvasHeight = canvasWidth / aspectRatio; // Maintain aspect ratio
    }
  }

  function getColorIndex(x, y, p) {
    switch (colorMode) {
      case "checkerboard":
        return (
          ((Math.floor(x / 32) + Math.floor(y / 32)) % 2) *
          (currentPalette.length - 1)
        );
      case "diagonal line":
        return Math.floor((x + y) / 32) % currentPalette.length;
      case "vertical":
        return Math.floor(x / 32) % currentPalette.length;
      case "horizontal stripes":
        return horizontalStripes(x, y, p);
      case "grid line":
        return gridline(x, y, p);
      default:
        return 0; // Default to first color if mode is undefined
    }
  }

  function horizontalStripes(x, y, p) {
    let numStripes = 10; // Adjust the number of horizontal stripes
    let stripeHeight = p.height / numStripes;
    return Math.floor(y / stripeHeight) % currentPalette.length;
  }

  function gridline(x, y, p) {
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
      case "ghost line":
        drawghostLine(x, y, size, color, p);
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

  function drawghostLine(x, y, size, color, p) {
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
