let t = 0; // time variable
let globalX = 200; // initially replacing mouseX
let globalY = 200; // initially replacing mouseY

let particleSize = 20;

let myXvalue = 20;
let myYvalue = 10;

let myXYvalueSets = [
  { name: "flashy", x: 400, y: 0, globalX: 1000, globalY: 0 },
  { name: "slotMachine", x: 400, y: 30, globalX: 500, globalY: 0 },
  { name: "gX.gY=0", x: 400, y: 30, globalX: 0, globalY: 0 },
  { name: "zigBrush", x: 400, y: 500, globalX: 20, globalY: 20 },
  { name: "init", x: 20, y: 10, globalX: 200, globalY: 200 },
  { name: "hardSwing", x: 400, y: 30, globalX: 200, globalY: 200 },
  { name: "flight", x: 500, y: 600, globalX: 200, globalY: 200 },
  { name: "schoolOfSnakes", x: 150, y: 400, globalX: 200, globalY: 200 },
];
let currentXYsetIndex = 0;
let currentXYset = myXYvalueSets[currentXYsetIndex];

let sequence = false; // Enable/disable sequence-based offsets
let sequenceSpeed = 2;
let lastUpdateTime = 0;

const intervals = [
  { x: 0, y: 0 },
  { x: 15, y: 10 },
  { x: 30, y: 20 },
  { x: 45, y: 30 },
];
let valueSets = [];

let currentSet = { x: myXvalue, y: myYvalue };

// Define multiple color palettes
let currentPaletteIndex = 0; // Index to keep track of the current palette
let palettes = [
  [
    { r: 0, g: 0, b: 0 }, // Black
    { r: 128, g: 100, b: 0 }, // Dark Gold
    { r: 255, g: 215, b: 0 }, // Gold
    { r: 255, g: 223, b: 0 }, // Light Gold
  ],
  [
    { r: 0, g: 0, b: 0 }, // Black
    { r: 0, g: 0, b: 128 }, // Dark Blue
    { r: 0, g: 0, b: 255 }, // Medium Blue
    { r: 173, g: 216, b: 230 }, // Light Blue
  ],
  [
    { r: 0, g: 0, b: 0 }, // Black
    { r: 0, g: 100, b: 0 }, // Dark Green
    { r: 0, g: 128, b: 0 }, // Medium Green
    { r: 144, g: 238, b: 144 }, // Light Green
  ],
  [
    { r: 0, g: 0, b: 0 }, // Black
    { r: 75, g: 0, b: 130 }, // Dark Purple
    { r: 138, g: 43, b: 226 }, // Medium Purple
    { r: 216, g: 191, b: 216 }, // Light Purple
  ],
  [
    { r: 0, g: 0, b: 0 }, // Black
    { r: 255, g: 140, b: 0 }, // Dark Orange
    { r: 255, g: 165, b: 0 }, // Medium Orange
    { r: 255, g: 222, b: 173 }, // Light Orange
  ],
  // Vibrant Neon Palette
  [
    { r: 255, g: 0, b: 255 }, // Neon Pink
    { r: 0, g: 255, b: 255 }, // Neon Cyan
    { r: 255, g: 255, b: 0 }, // Neon Yellow
    { r: 0, g: 255, b: 0 }, // Neon Green
  ],
  // Cool Mint and Teal Palette
  [
    { r: 242, g: 242, b: 242 }, // Soft White
    { r: 169, g: 239, b: 223 }, // Mint
    { r: 22, g: 160, b: 133 }, // Teal
    { r: 13, g: 102, b: 85 }, // Dark Teal
  ],
  // Minimalistic Black and White
  [
    { r: 0, g: 0, b: 0 }, // Black
    { r: 128, g: 128, b: 128 }, // Gray
    { r: 192, g: 192, b: 192 }, // Light Gray
    { r: 255, g: 255, b: 255 }, // White
  ],
  // Sunset Palette
  [
    { r: 76, g: 0, b: 153 }, // Deep Purple
    { r: 204, g: 0, b: 0 }, // Red
    { r: 255, g: 140, b: 0 }, // Dark Orange
    { r: 255, g: 237, b: 188 }, // Peach
  ],
  // Earthy Tones Palette
  [
    { r: 46, g: 46, b: 31 }, // Dark Olive
    { r: 102, g: 71, b: 54 }, // Sienna
    { r: 204, g: 187, b: 153 }, // Tan
    { r: 238, g: 238, b: 187 }, // Pale Yellow
  ],
];

let currentPalette = palettes[0]; // Start with the first palette

let shapeModes = ["ellipse", "rectangle", "triangle", "line", "star"];
let shapeModeIndex = 0; // Start with the first shape mode in the array
let shapeMode = shapeModes[shapeModeIndex];
let colorMode = "each line"; // Default color mode
let randomColors = []; // Array to store random colors for each position

function setup() {
  createCanvas(1000, 600);
  noStroke();
  // Initialize random colors
  for (let x = 0; x <= width; x += 32) {
    randomColors[x] = [];
    for (let y = 0; y <= height; y += 32) {
      randomColors[x][y] = floor(random(currentPalette.length));
    }
  }
  updateValueSets();
}

function draw() {
  background(10, 10); // Translucent background to create trails

  let currentTime = millis(); // Get the current time in milliseconds

  // Check if it's time to update the sequence based on sequenceSpeed
  if (sequence && currentTime - lastUpdateTime > sequenceSpeed) {
    updateSequenceValues();
    lastUpdateTime = currentTime; // Reset the last update time
  }

  // Update globalX and globalY from the current set
  globalX = currentXYset.globalX;
  globalY = currentXYset.globalY;

  for (let x = 0; x <= width; x += 32) {
    let currentColor; // To hold the color for each line or particle

    if (colorMode === "each line") {
      // Each line has one color, pick color based on x position
      currentColor = currentPalette[(x / 32) % currentPalette.length];
    }

    for (let y = 0; y <= height; y += 32) {
      if (colorMode === "random") {
        // Use preassigned random color for stability
        currentColor = currentPalette[randomColors[x][y]];
      } else if (colorMode === "noise") {
        // Noise-based color selection
        let noiseVal = noise(x * 0.5, y * 0.05, t);
        currentColor =
          currentPalette[
            floor(noiseVal * currentPalette.length) % currentPalette.length
          ];
      }

      fill(currentColor.r, currentColor.g, currentColor.b);

      const xAngle = map(globalX, 0, width, 0, TWO_PI, true);
      const yAngle = map(globalY, 0, height, 0, TWO_PI, true);
      const angle = xAngle * (x / width) + yAngle * (y / height);

      const myX =
        x +
        (sequence ? currentSet.x : currentXYset.x) * cos(32 * PI * t + angle);
      const myY =
        y +
        (sequence ? currentSet.y : currentXYset.y) * sin(9 * PI * t + angle);

      switch (shapeMode) {
        case "rectangle":
          rect(myX, myY, particleSize, particleSize);
          break;
        case "ellipse":
          ellipse(myX, myY, particleSize, particleSize);
          break;
        case "triangle":
          drawTriangle(myX, myY, particleSize);
          break;
        case "line":
          const lineWidth = 4; // Set the line width
          stroke(currentColor.r, currentColor.g, currentColor.b); // Use current palette color
          strokeWeight(lineWidth); // Apply the line width
          line(myX, myY, myX + particleSize * 1, myY + particleSize * 1);
          noStroke();
          break;
        case "star":
          drawStar(myX, myY, particleSize / 2, particleSize, 5);
          break;
      }
    }
  }

  t += 0.0005; // Increment time variable
}

function drawTriangle(x, y, size) {
  const height = size * (sqrt(3) / 2);
  triangle(
    x - size / 2,
    y + height / 2,
    x + size / 2,
    y + height / 2,
    x,
    y - height / 2
  );
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function updateValueSets() {
  valueSets = intervals.map((interval) => ({
    x: currentXYset.x + interval.x,
    y: currentXYset.y + interval.y,
  }));
  console.log("Updated valueSets based on current myXYvalueSet:", valueSets);
}

function updateSequenceValues() {
  const index = floor(random(valueSets.length));
  currentSet = valueSets[index];
}

// Function to refresh random color assignments
function refreshRandomColors() {
  for (let x = 0; x <= width; x += 32) {
    for (let y = 0; y <= height; y += 32) {
      randomColors[x][y] = floor(random(currentPalette.length));
    }
  }
}

function keyPressed() {
  if (key === "1") {
    colorMode = "random";
  } else if (key === "2") {
    colorMode = "each line";
  } else if (key === "3") {
    colorMode = "noise";
  } else if (key.toUpperCase() === "W") {
    currentPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
    currentPalette = palettes[currentPaletteIndex];
    refreshRandomColors();
    console.log("Palette changed to:", currentPalette);
  } else if (key.toUpperCase() === "Q") {
    currentPaletteIndex =
      (currentPaletteIndex - 1 + palettes.length) % palettes.length;
    currentPalette = palettes[currentPaletteIndex];
    refreshRandomColors();
    console.log("Palette changed to:", currentPalette);
  } else if (key.toUpperCase() === "S") {
    sequence = !sequence;
    console.log("Sequence mode toggled to:", sequence);
  } else if (key.toUpperCase() === "X") {
    // Move to next shape mode
    shapeModeIndex = (shapeModeIndex + 1) % shapeModes.length;
    shapeMode = shapeModes[shapeModeIndex];
    console.log("Shape mode changed to:", shapeMode);
  } else if (key.toUpperCase() === "Z") {
    // Move to previous shape mode
    if (shapeModeIndex === 0) {
      shapeModeIndex = shapeModes.length - 1;
    } else {
      shapeModeIndex--;
    }
    shapeMode = shapeModes[shapeModeIndex];
    console.log("Shape mode changed to:", shapeMode);
  } else if (key.toUpperCase() === "F") {
    currentXYsetIndex = (currentXYsetIndex + 1) % myXYvalueSets.length;
    currentXYset = myXYvalueSets[currentXYsetIndex];
    updateValueSets(); // Update sequence values relative to the new currentXYset
    console.log("Current myXYvalueSet changed to:", currentXYset);
  } else if (key.toUpperCase() === "D") {
    currentXYsetIndex =
      (currentXYsetIndex - 1 + myXYvalueSets.length) % myXYvalueSets.length;
    currentXYset = myXYvalueSets[currentXYsetIndex];
    updateValueSets(); // Update sequence values relative to the new currentXYset
    console.log("Current myXYvalueSet changed to:", currentXYset);
  }
}
