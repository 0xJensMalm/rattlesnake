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
  let colorModes = ["checkerboard", "diagonal lines", "vertical"];

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
      x: [10, 50],
      y: [10, 50],
      globalX: [50, 300],
      globalY: [50, 300],
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
    hard: {
      x: [300, 450],
      y: [300, 450],
      globalX: [450, 600],
      globalY: [450, 600],
    },
  };

  // Placeholder for XY value sets and palettes
  let myXYvalueSets = [
    { name: "random range light", ...getRandomValues("light", sketch) },
    { name: "random range mid", ...getRandomValues("mid", sketch) },
    { name: "random range mid plus", ...getRandomValues("midplus", sketch) },
    { name: "random range hard", ...getRandomValues("hard", sketch) },
    { name: "flashy", x: 400, y: 0, globalX: 1000, globalY: 0 },

    { name: "gX.gY=0", x: 400, y: 30, globalX: 0, globalY: 0 },
    { name: "z=g", x: 400, y: 500, globalX: 20, globalY: 20 },
    { name: "init", x: 20, y: 10, globalX: 200, globalY: 200 },
    { name: "hardSwing", x: 400, y: 30, globalX: 200, globalY: 200 },
    { name: "flight", x: 500, y: 600, globalX: 200, globalY: 200 },
    { name: "school of snakes", x: 150, y: 400, globalX: 200, globalY: 200 },
  ];

  let palettes = {
    jungle: [
      { r: 34, g: 139, b: 34 }, // Deep jungle green
      { r: 0, g: 153, b: 204 }, // Parrot feather blue
      { r: 153, g: 50, b: 204 }, // Orchid purple
      { r: 255, g: 140, b: 0 }, // Tropical sunset orange
    ],
    golid4ever: [
      { r: 31, g: 60, b: 67 },
      { r: 248, g: 203, b: 87 },
      { r: 87, g: 183, b: 171 },
      { r: 236, g: 101, b: 59 },
    ],
    tokyo: [
      { r: 64, g: 224, b: 208 }, // Neon blue
      { r: 255, g: 20, b: 147 }, // Electric pink
      { r: 255, g: 215, b: 0 }, // Billboard yellow
      { r: 255, g: 69, b: 0 }, // Traffic light red
    ],
    rainbow: [
      { r: 255, g: 0, b: 0 }, // Vibrant red
      { r: 255, g: 165, b: 0 }, // Electric orange
      { r: 255, g: 255, b: 0 }, // Bright yellow
      { r: 0, g: 128, b: 0 }, // Green fields
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
    tIncrement = sketch.random(0.0001, 0.0003);
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
      "shape:": shapeMode,
      "palette name": currentPaletteName,
      "XY value set": currentXYset.name,
      "color mode": colorMode,
      "t =": tIncrement.toFixed(4),
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
    } else if (colorMode === "vertical") {
      // Consistently apply the same color for vertical
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
});
