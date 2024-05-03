new p5((sketch) => {
  let seedValue = sketch.int($fx.rand() * 100000);
  sketch.randomSeed(seedValue);
  sketch.noiseSeed(seedValue);

  let globalX = 200;
  let globalY = 200;
  let particleSize = 15;
  let t = 0; // time variable, make sure it's declared and used
  let shapeModes = ["ellipse", "rectangle", "hexagon", "line", "pentagon"];
  let colorModes = ["random", "each line", "noise"];

  let myXYvalueSets = [
    { name: "hammerhead", x: 350, y: 680, globalX: 125, globalY: 50 },
    { name: "swells", x: 300, y: 400, globalX: 200, globalY: 100 },
    { name: "flashy", x: 400, y: 0, globalX: 1000, globalY: 0 },
    { name: "slotMachine", x: 400, y: 30, globalX: 500, globalY: 0 },
    { name: "gX.gY=0", x: 400, y: 30, globalX: 0, globalY: 0 },
    { name: "zigBrush", x: 400, y: 500, globalX: 20, globalY: 20 },
    { name: "init", x: 20, y: 10, globalX: 200, globalY: 200 },
    { name: "hardSwing", x: 400, y: 30, globalX: 200, globalY: 200 },
    { name: "flight", x: 500, y: 600, globalX: 200, globalY: 200 },
    { name: "schoolOfSnakes", x: 150, y: 400, globalX: 200, globalY: 200 },
  ];

  let palettes = [
    {
      name: "Dark Golds",
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 128, g: 100, b: 0 },
        { r: 255, g: 215, b: 0 },
        { r: 255, g: 223, b: 0 },
      ],
    },
    {
      name: "Deep Blues",
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 0, g: 0, b: 128 },
        { r: 0, g: 0, b: 255 },
        { r: 173, g: 216, b: 230 },
      ],
    },
    {
      name: "Vibrant Greens",
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 0, g: 100, b: 0 },
        { r: 0, g: 128, b: 0 },
        { r: 144, g: 238, b: 144 },
      ],
    },
    {
      name: "Mystic Purples",
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 75, g: 0, b: 130 },
        { r: 138, g: 43, b: 226 },
        { r: 216, g: 191, b: 216 },
      ],
    },
    {
      name: "Sunset Oranges",
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 140, b: 0 },
        { r: 255, g: 165, b: 0 },
        { r: 255, g: 222, b: 173 },
      ],
    },
    {
      name: "Neon Vibes",
      colors: [
        { r: 255, g: 0, b: 255 },
        { r: 0, g: 255, b: 255 },
        { r: 255, g: 255, b: 0 },
        { r: 0, g: 255, b: 0 },
      ],
    },
    {
      name: "Cool Mint and Teal",
      colors: [
        { r: 242, g: 242, b: 242 },
        { r: 169, g: 239, b: 223 },
        { r: 22, g: 160, b: 133 },
        { r: 13, g: 102, b: 85 },
      ],
    },
    {
      name: "Minimalistic Black and White",
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 128, g: 128, b: 128 },
        { r: 192, g: 192, b: 192 },
        { r: 255, g: 255, b: 255 },
      ],
    },
    {
      name: "Sunset Palette",
      colors: [
        { r: 76, g: 0, b: 153 },
        { r: 204, g: 0, b: 0 },
        { r: 255, g: 140, b: 0 },
        { r: 255, g: 237, b: 188 },
      ],
    },
    {
      name: "Earthy Tones",
      colors: [
        { r: 46, g: 46, b: 31 },
        { r: 102, g: 71, b: 54 },
        { r: 204, g: 187, b: 153 },
        { r: 238, g: 238, b: 187 },
      ],
    },
  ];

  const randomXY = false;

  function getRandomXY() {
    return {
      x: 20 + $fx.rand() * (2000 - 20),
      y: 20 + $fx.rand() * (2000 - 20),
      globalX: 100 + $fx.rand() * (200 - 100),
      globalY: $fx.rand() * 100,
    };
  }

  let shapeMode, colorMode, currentPalette, currentXYset;
  let randomColors = [];

  sketch.setup = function () {
    sketch.createCanvas(1000, 600);
    sketch.noStroke();

    // Randomize settings
    shapeMode = shapeModes[sketch.floor($fx.rand() * shapeModes.length)];
    colorMode = colorModes[sketch.floor($fx.rand() * colorModes.length)];
    currentPalette = palettes[sketch.floor($fx.rand() * palettes.length)];
    currentXYset =
      myXYvalueSets[sketch.floor(sketch.random(myXYvalueSets.length))];

    if (randomXY) {
      currentXYset = getRandomXY();
    } else {
      currentXYset =
        myXYvalueSets[sketch.floor($fx.rand() * myXYvalueSets.length)];
    }
    if (colorMode === "random") {
      refreshRandomColors();
    }

    console.log("Settings:");
    console.log("Shape Mode:", shapeMode);
    console.log("Color Mode:", colorMode);
    console.log("Palette:", currentPalette.name);
    console.log("XY Set:", currentXYset);

    // Corrected $fx.features call
    $fx.features({
      "Shape Mode": shapeMode,
      "Color Mode": colorMode,
      "Palette:": currentPalette.name,
      "XY Set": currentXYset.name,
    });
  };

  sketch.draw = function () {
    sketch.background(30, 30); // Translucent background to create trails

    // Update global coordinates from the current XY set every frame
    globalX = currentXYset.globalX;
    globalY = currentXYset.globalY;

    for (let x = 0; x <= sketch.width; x += 32) {
      for (let y = 0; y <= sketch.height; y += 32) {
        // Dynamically determine color based on current position and mode
        let currentColor = getColor(x, y);
        sketch.fill(currentColor.r, currentColor.g, currentColor.b);

        // Calculate dynamic angles using `globalX` and `globalY`
        const xAngle = sketch.map(
          globalX,
          0,
          sketch.width,
          0,
          sketch.TWO_PI,
          true
        );
        const yAngle = sketch.map(
          globalY,
          0,
          sketch.height,
          0,
          sketch.TWO_PI,
          true
        );
        const angle =
          xAngle * (x / sketch.width) + yAngle * (y / sketch.height);

        // Use the dynamically calculated angle to modify position
        const myX = x + currentXYset.x * sketch.cos(32 * sketch.PI * t + angle);
        const myY = y + currentXYset.y * sketch.sin(9 * sketch.PI * t + angle);

        // Draw the shape at the calculated positions
        drawShape(myX, myY, shapeMode, particleSize);
      }
    }

    // Increment the time variable to create movement
    t += 0.0005; // Smaller increment for smoother animation
  };

  function getColor(x, y) {
    let colIndex = Math.floor(x / 32);
    let rowIndex = Math.floor(y / 32);

    // Ensure the color array indexes are within bounds
    if (colorMode === "random") {
      if (
        randomColors[colIndex] &&
        randomColors[colIndex][rowIndex] !== undefined
      ) {
        return currentPalette.colors[randomColors[colIndex][rowIndex]];
      }
    } else if (colorMode === "noise") {
      let noiseVal = sketch.noise(x * 0.1, y * 0.1); // Adjusted for higher contrast
      let colorIndex = sketch.floor(noiseVal * currentPalette.colors.length);
      if (colorIndex < currentPalette.colors.length) {
        return currentPalette.colors[colorIndex];
      }
    } else {
      // 'each line' or other modes
      return currentPalette.colors[(x / 32) % currentPalette.colors.length];
    }
    // Fallback color if all else fails
    return { r: 255, g: 255, b: 255 }; // Return white as a default color
  }

  function drawShape(x, y, mode, size) {
    if (mode === "line") {
      const lineWidth = 4;
      let currentColor = getColor(x, y); // Ensures color is determined by your getColor logic
      sketch.stroke(currentColor.r, currentColor.g, currentColor.b);
      sketch.strokeWeight(lineWidth);
      sketch.line(x, y, x + size, y + size);
    } else {
      sketch.noStroke(); // Ensure other shapes do not have strokes
      switch (mode) {
        case "rectangle":
          sketch.rect(x, y, size, size);
          break;
        case "ellipse":
          sketch.ellipse(x, y, size, size);
          break;
        case "pentagon":
          drawPentagon(x, y, size);
          break;
        case "hexagon":
          drawHexagon(x, y, size);
          break;
      }
    }
  }

  function drawPentagon(x, y, size) {
    sketch.beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = (sketch.TWO_PI / 5) * i;
      let sx = x + sketch.cos(angle) * size;
      let sy = y + sketch.sin(angle) * size;
      sketch.vertex(sx, sy);
    }
    sketch.endShape(sketch.CLOSE);
  }

  // Function to draw a hexagon
  function drawHexagon(x, y, size) {
    sketch.beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = (sketch.TWO_PI / 6) * i;
      let sx = x + sketch.cos(angle) * size;
      let sy = y + sketch.sin(angle) * size;
      sketch.vertex(sx, sy);
    }
    sketch.endShape(sketch.CLOSE);
  }

  function refreshRandomColors() {
    randomColors = [];
    for (let x = 0; x < sketch.width; x += 32) {
      let colIndex = x / 32;
      randomColors[colIndex] = []; // Initialize the sub-array here
      for (let y = 0; y < sketch.height; y += 32) {
        let rowIndex = y / 32;
        randomColors[colIndex][rowIndex] = sketch.floor(
          sketch.random(currentPalette.colors.length)
        );
      }
    }
  }
});
