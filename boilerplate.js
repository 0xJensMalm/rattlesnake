new p5((sketch) => {
  let seedValue = sketch.int($fx.rand() * 100000); // Seed for noise and random

  let themes = [];

  sketch.setup = function () {
    canvasSize = sketch.min(sketch.windowWidth, sketch.windowHeight);
    sketch.createCanvas(canvasSize, canvasSize);
    sketch.rectMode(sketch.CENTER);
    sketch.noiseSeed(seedValue);
    sketch.randomSeed(seedValue);
    sketch.frameRate(60);
  };

  sketch.draw = function () {
    $fx.features({
      "Particle Count": particles.length,
      "Selected Theme": selectedTheme.name,
      "Seed Value": seedValue,
    });
  };
});
