//reference from https://gitee.com/qxscj/js-demo/blob/master/html+css/32.html

const sure = document.getElementById('sure');
// get the button

// if this button is clicked, run the function
sure.onclick = function () {
  run()
  document.getElementById('dialog').style.display = 'none'
  // make the music play
  document.getElementById('vd').play()

}

// show the canvas at frist
const canvas = document.getElementById('pptCanvas');
// this is how the  canvas is called
const ctx = canvas.getContext('2d');

// const slides = [
//   { title: '', content: 'Hello, ${name}!\nWelcome to this place.' },
//   { title: '', content: 'Want to know where you are?' },
//   { title: '', content: 'It doesn\'t matter. What matters is that \nyou\'re going to die of hunger.' }
// ];

const { width, height } = canvas; // Get canvas width and height
let particles = []; // Initialize particles array

// Initialize background data with random x and y values
const bgData = Array.from(new Array(100)).map(v => {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    step: Math.random() * 2.5 + 0.5
  }
});

// Function to send text and create granulated text effect
const sendText = (text, fontSize = ((width * 1.1) / text.length), stepV = 40) => {
  ctx.font = `bold ${fontSize}px Montserrat`; // Set font style and size
  ctx.fillStyle = '#000000'; // Set fill particle to black
  ctx.fillRect(0, 0, width, height); // Fill the canvas with black particle
  ctx.fillStyle = '#ffffff'; // Set fill particle to white
  ctx.textAlign = 'center'; // Set text alignment to center
  ctx.textBaseline = 'middle'; // Set text baseline to middle
  const lines = text.split('\n'); // Split the text into lines
  const lineCount = lines.length; // Get the number of lines
  let linesHeight = lineCount * fontSize / 2; // Calculate lines height
  for (let i = 0; i < lineCount; i++) {
    ctx.fillText(lines[i], width / 2, height / 2 - fontSize * (lineCount - 1 - i) + linesHeight - fontSize / 2);
  } // Draw text lines
  const data = ctx.getImageData(0, 0, width, height).data; // Get image data

  let index = 0; // Initialize index variable
  let bl = 4; // Set block size for granulated text effect
  let useIndex = 0; // Initialize useIndex variable
  for (let i = 0; i < data.length; i += 4) {
    const x = index % width; // Calculate x position
    const y = Math.ceil(index / width); // Calculate y position
    if (x % bl === 0 && y % bl === 0 && data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
      const rx = Math.floor(Math.random() * fontSize) + width / 2 - fontSize / 2; 
      // Calculate random x position within the text bounds
      const ry = Math.floor(Math.random() * fontSize) + height / 2 - fontSize / 2; 
      // Calculate random y position within the text bounds
      const item = particles[useIndex]; // Get the current particle item
      if (item) { // If the particle item exists
        particles[useIndex] = {
          x,
          y,
          rx: item.x,
          ry: item.y,
          stepX: Math.abs(item.x - x) / stepV,
          stepY: Math.abs(item.y - y) / stepV
        }; // Update the particle item with new position and step values
      } else { // If the particle item doesn't exist
        particles[useIndex] = {
          x,
          y,
          rx,
          ry,
          stepX: Math.abs(rx - x) / stepV,
          stepY: Math.abs(ry - y) / stepV
        }; // Create a new particle item with position and step values
      }
      useIndex++; // Increment useIndex
    }
    index++; // Increment index
  } // Update particle positions for granulated text effect
  if (useIndex < particles.length) {
    particles.splice(useIndex, particles.length - useIndex);
  } // Remove unnecessary elements from particles array
}


// Function to render the granulated text effect
// make the text move, like granulation
const render = () => {
  ctx.beginPath(); // Begin a new path for drawing
  ctx.clearRect(0, 0, width, height); // Clear the canvas

  particles.forEach(v => { // Iterate through each particle
    if (v.rx > v.x) { // If the current x position is greater than the target x position
      v.rx -= v.stepX; // Move the particle left
      if (v.rx < v.x) { // If the new position goes past the target
        v.rx = v.x; // Set the position to the target
      }
    } else if (v.rx < v.x) { // If the current x position is less than the target x position
      v.rx += v.stepX; // Move the particle right
      if (v.rx > v.x) { // If the new position goes past the target
        v.rx = v.x; // Set the position to the target
      }
    }

    if (v.ry > v.y) { // If the current y position is greater than the target y position
      v.ry -= v.stepY; // Move the particle up
      if (v.ry < v.y) { // If the new position goes past the target
        v.ry = v.y; // Set the position to the target
      }
    } else if (v.ry < v.y) { // If the current y position is less than the target y position
      v.ry += v.stepY; // Move the particle down
      if (v.ry > v.y) { // If the new position goes past the target
        v.ry = v.y; // Set the position to the target
      }
    }

    ctx.rect(v.rx, v.ry, 3, 3); // Draw a rectangle for the particle
  });

  bgData.forEach(v => { // Iterate through each background data item
    v.y = v.y > height ? 0 : (v.y + v.step); // Move the item down, and reset to 0 if it goes past the height
    ctx.rect(v.x, v.y, 2, 2); // Draw a rectangle for the background data item
  });

  ctx.fill(); // Fill the drawn rectangles
  requestAnimationFrame(render); // Request the next frame to continue animation
};


render()

// Function to send text and create granulated text effect
const awaitSendText = async (txt, fontSize, stepV) => {
  return new Promise((resolve) => {
    sendText(txt, fontSize, stepV)
    particles.sort(v => Math.random() - 0.5)
    // setting the timeout to 4160ms
    setTimeout(() => resolve(), 4160 + (stepV > 40 ? 1000 : 0))
  })
}

const run = async () => {

  const text = [
    'Hello, {name}!\nWelcome to this place.'.replace('{name}',
     document.getElementById('dialogTxt').value), 
     'Want to escape from the darkness?\nOnly enough food can make you really wake up.',
     'You will lose the chance to wake up if you don\'t\nget food within a certain period of time.',
    'But there is more than life-saving food in this\nworld,\nthere are also amazing poisonous things.',
    'When you mistakenly eat the poisonous fruit,\nthe moment will be far from\nthe end of starvation.\nBut you are farther and farther away from\nactually waking up.',
    'In the darkness there are fruits and poisons and\ndrugs that can make you wake up quickly.','Remember!\nRed is edible fruit\nBlue is the fruit of double energy\nGreen is poisonous']
  for (let i = 0; i < text.length; i++) {
    await awaitSendText(text[i], 40, 40)
  }

  // hide the canvas
  document.getElementById('pptCanvas').style.display = 'none'
  // show the snake game
  document.getElementById('main').style.display = 'block'
}
