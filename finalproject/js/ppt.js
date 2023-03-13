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

const { width, height } = canvas
let colors = []

const bgData = Array.from(new Array(100)).map(v => {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    step: Math.random() * 2.5 + 0.5
  }
})

const sendText = (text, fontSize = ((width * 1.1) / text.length), stepV = 40) => {
  ctx.font = `bold ${fontSize}px Montserrat`
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const lines = text.split('\n')
  const lineCount = lines.length
  let linesHeight = lineCount * fontSize / 2
  for (let i = 0; i < lineCount; i++) {
    ctx.fillText(lines[i], width / 2, height / 2 - fontSize * (lineCount - 1 - i) + linesHeight - fontSize / 2)
  }
  const data = ctx.getImageData(0, 0, width, height).data

  let index = 0
  let bl = 4
  let useIndex = 0
  for (let i = 0; i < data.length; i += 4) {
    const x = index % width
    const y = Math.ceil(index / width)
    if (x % bl === 0 && y % bl === 0 && data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
      const rx = Math.floor(Math.random() * fontSize) + width / 2 - fontSize / 2
      const ry = Math.floor(Math.random() * fontSize) + height / 2 - fontSize / 2
      const item = colors[useIndex]
      if (item) {
        colors[useIndex] = {
          x,
          y,
          rx: item.x,
          ry: item.y,
          stepX: Math.abs(item.x - x) / stepV,
          stepY: Math.abs(item.y - y) / stepV
        }
      } else {
        colors[useIndex] = {
          x,
          y,
          rx,
          ry,
          stepX: Math.abs(rx - x) / stepV,
          stepY: Math.abs(ry - y) / stepV
        }
      }
      useIndex++
    }
    index++
  }
  if (useIndex < colors.length) {
    colors.splice(useIndex, colors.length - useIndex)
  }
}

// make the text move, like granulation
const render = () => {
  ctx.beginPath()
  ctx.clearRect(0, 0, width, height)
  colors.forEach(v => {
    if (v.rx > v.x) {
      v.rx -= v.stepX
      if (v.rx < v.x) {
        v.rx = v.x
      }
    } else if (v.rx < v.x) {
      v.rx += v.stepX
      if (v.rx > v.x) {
        v.rx = v.x
      }
    }
    if (v.ry > v.y) {
      v.ry -= v.stepY
      if (v.ry < v.y) {
        v.ry = v.y
      }
    } else if (v.ry < v.y) {
      v.ry += v.stepY
      if (v.ry > v.y) {
        v.ry = v.y
      }
    }
    ctx.rect(v.rx, v.ry, 3, 3)
  })
  bgData.forEach(v => {
    v.y = v.y > height ? 0 : (v.y + v.step)
    ctx.rect(v.x, v.y, 2, 2)
  })
  ctx.fill()
  requestAnimationFrame(render)
}

render()

const awaitSendText = async (txt, fontSize, stepV) => {
  return new Promise((resolve) => {
    sendText(txt, fontSize, stepV)
    colors.sort(v => Math.random() - 0.5)
    setTimeout(() => resolve(), 160 + (stepV > 40 ? 1000 : 0))
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
