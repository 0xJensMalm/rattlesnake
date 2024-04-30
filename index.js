let t = 0; // time variable
let globalX = 200; // initially replacing mouseX
let globalY = 200; // initially replacing mouseY

let particleSize = 20;

let myXvalue = 20;
let myYvalue = 10;

let sequence = false; // Enable/disable sequence-based offsets
let sequenceSpeed = 5;
let lastUpdateTime = 0;
let valueSets = [
  { x: 30, y: 15 },
  { x: 45, y: 25 },
  { x: 60, y: 35 },
];
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

let shapeModes = ["ellipse", "rectangle"];
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
}

function draw() {
  background(10, 10); // Translucent background to create trails

  let currentTime = millis(); // Get the current time in milliseconds

  // Check if it's time to update the sequence based on sequenceSpeed
  if (sequence && currentTime - lastUpdateTime > sequenceSpeed) {
    updateSequenceValues();
    lastUpdateTime = currentTime; // Reset the last update time
  } else if (!sequence) {
    // Revert to default if sequence is not active
    currentSet.x = myXvalue;
    currentSet.y = myYvalue;
  }

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

      const myX = x + currentSet.x * cos(32 * PI * t + angle);
      const myY = y + currentSet.y * sin(9 * PI * t + angle);

      if (shapeMode === "rectangle") {
        rect(myX, myY, particleSize);
      } else if (shapeMode === "ellipse") {
        ellipse(myX, myY, particleSize, particleSize);
      }
    }
  }

  t += 0.0005; // Increment time variable
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
  } else if (key.toUpperCase() === "Q") {
    currentPaletteIndex =
      (currentPaletteIndex - 1 + palettes.length) % palettes.length;
    currentPalette = palettes[currentPaletteIndex];
    refreshRandomColors();
  } else if (key.toUpperCase() === "S") {
    sequence = !sequence;
  } else if (key.toUpperCase() === "X") {
    // Move to next shape mode
    shapeModeIndex = (shapeModeIndex + 1) % shapeModes.length;
    shapeMode = shapeModes[shapeModeIndex];
  } else if (key.toUpperCase() === "Z") {
    // Move to previous shape mode
    if (shapeModeIndex === 0) {
      shapeModeIndex = shapeModes.length - 1;
    } else {
      shapeModeIndex--;
    }
    shapeMode = shapeModes[shapeModeIndex];
  }
}
