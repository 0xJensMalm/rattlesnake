new p5((sketch) => {
  let seedValue = sketch.int($fx.rand() * 100000);
  sketch.randomSeed(seedValue);
  sketch.noiseSeed(seedValue);

  let globalX = 200;
  let globalY = 200;
  let particleSize = 20;
  let t = 0; // time variable, make sure it's declared and used
  let shapeModes = ["ellipse", "rectangle", "hexagon", "line", "pentagon"];
  let colorModes = ["random", "each line", "noise"];
  let myXYvalueSets = [
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

  let shapeMode, colorMode, currentPalette, currentXYset;
  let randomColors = [];

  sketch.setup = function () {
    sketch.createCanvas(1000, 600);
    sketch.noStroke();

    // Randomize settings
    shapeMode = shapeModes[sketch.floor(sketch.random(shapeModes.length))];
    colorMode = colorModes[sketch.floor(sketch.random(colorModes.length))];
    currentPalette = palettes[sketch.floor(sketch.random(palettes.length))];
    currentXYset =
      myXYvalueSets[sketch.floor(sketch.random(myXYvalueSets.length))];

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
    sketch.background(10, 10); // Translucent background to create trails

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
    if (colorMode === "random") {
      // Access the color from the colors array within the currentPalette
      return currentPalette.colors[randomColors[x][y]];
    } else if (colorMode === "noise") {
      let noiseVal = sketch.noise(x * 0.5, y * 0.05, t);
      return currentPalette.colors[
        sketch.floor(noiseVal * currentPalette.colors.length) %
          currentPalette.colors.length
      ];
    } else {
      return currentPalette.colors[(x / 32) % currentPalette.colors.length];
    }
  }

  function drawShape(x, y, mode, size) {
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
    for (let x = 0; x <= sketch.width; x += 32) {
      for (let y = 0; y <= sketch.height; y += 32) {
        randomColors[x][y] = sketch.floor(
          sketch.random(currentPalette.colors.length)
        );
      }
    }
  }
});
