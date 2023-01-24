// Vars declared 

const canvas = document.querySelector('#game');
const context = canvas.getContext("2d");
const btnUp = document.querySelector('#up');
const btnRight = document.querySelector('#right');
const btnLeft = document.querySelector('#left');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const timePlayed = document.querySelector('#time');
const setRecord = document.querySelector("#record");
const setResult = document.querySelector("#result");
const resetGame = document.querySelector("#reset");


// Coordenadas PLAYER

const playerPosition = {
  x: undefined,
  y: undefined,
};

// Coordenadas GIFT

const giftPosition = {
  x: undefined,
  y: undefined,
};

// Coordenadas ENEMIES

let enemiesPosition = [];

// Logic and functions

window.addEventListener('load', setCanvasSize); //
window.addEventListener('resize', setCanvasSize); 

let canvasSize; // Coordenadas canvas
let elementsSize; // Tamaño elementos
let level = 0; // Mapa
let lives = 3; // Vidas
let timeStart; // tiempo de inicio
let timePlayer;
let timeInterval;

// Eventos de la aplicación

btnUp.addEventListener('click', moveUp);
btnRight.addEventListener('click', moveRight);
btnLeft.addEventListener('click', moveLeft);
btnDown.addEventListener('click', moveDown);

window.addEventListener('keydown', keysMove);

 resetGame.addEventListener('click', reloadPage);

// Ajustar el tamaño del canvas

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
      canvasSize = window.innerWidth * 0.6;
    } else {
      canvasSize = window.innerHeight * 0.6;
    }

    canvasSize = Number(canvasSize.toFixed(2)); // ajustar a 2 decimales
    
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementsSize = canvasSize / 10.5;

    playerPosition.x = undefined; // Ajustar tamaño de PLAYER al canvas
    playerPosition.y = undefined; // Ajustar tamaño de PLAYER al canvas
  
    startGame(); // 
  }

// Renderizar los elementos DENTRO del canvas

function startGame() {
//   console.log({ canvasSize, elementsSize });

  context.font = elementsSize + 'px Arial';
  context.textAlign = 'center';

  const map = maps[level];
  if (!map) {    
    gameWin();
    return;    
  }

   if (!timeStart) {
     timeStart = Date.now();
     timeInterval = setInterval(showTime, 1000);
     showRecord();
   }

  const mapRows = map.trim().split('\n'); // separar str por saltos de línea
  const mapCols = mapRows.map(row => row.trim().split('')); // separar fila por elemento

  showLives(); // Vista de las vidas disponibles.

  context.clearRect(0, 0, canvasSize, canvasSize); // Elimina todos los elementos del canvas
  enemiesPosition = []; // Limpia el arreglo por render

  mapCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
        const emoji = emojis[col]; // Esta var es la que va a recorrer los elementos del mapa en maps.emojis[]
        const xPosition = elementsSize * (colIndex + 1); // var para definir la posicion dinámica de x
        const yPosition = elementsSize * (rowIndex + 1); // var para definir la posicion dinámica de y

        if (col == 'O') {
          if (!playerPosition.x && !playerPosition.y) {
            playerPosition.x = xPosition;
            playerPosition.y = yPosition;
            console.log({playerPosition});            
          }
        }
        else if (col == 'I') {
          giftPosition.x = xPosition;
          giftPosition.y = yPosition;    
        }
        else if (col == 'X') {
          enemiesPosition.push({
            x: xPosition,
            y: yPosition,
          });
        }

        context.fillText(emoji, xPosition, yPosition); // renderiza el elemento de emoji[xPosition][yPosition]
    });
  });


  movePlayer();
}

function keysMove(event) {
  // console.log(event);

  let tecla = event.key;

  switch (tecla) {
    case "ArrowUp":
      moveUp();
      break;

    case "ArrowDown":
      moveDown();
      break;

    case "ArrowLeft":
      moveLeft();
      break;

    case "ArrowRight":
    moveRight();
      break;

    default:
      break;
  
  }

}

function movePlayer () {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  const enemiesCollision = enemiesPosition.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });


  if (giftCollision) {    
    levelWin();
    
  }
  else if (enemiesCollision) {
    levelFailed();
  }

  context.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function moveUp() {
  console.log('Me quiero mover hacia arriba');
  if ((playerPosition.y - elementsSize) < elementsSize) {
    console.log('OUT of canvas');
  }else {
    playerPosition.y -= elementsSize; 
    startGame();
  }
}

function moveRight() {
  if ((playerPosition.x + elementsSize) > canvasSize) {
    console.log('OUT of canvas');
  }else {
    playerPosition.x += elementsSize; 
    startGame();
  }
}
function moveLeft() {
  if ((playerPosition.x - elementsSize) < elementsSize) {
    console.log('OUT of canvas');
  }else {
    playerPosition.x -= elementsSize; 
    startGame();
  }
}
function moveDown() {
  if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT of canvas');
  }else {
    playerPosition.y += elementsSize; 
    startGame();
  }
}

function levelWin () {
  level++;
  console.log("Pasaste");
  startGame();
}

function gameWin() {
  console.log('¡Terminaste el juego!');
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      fixNumber(localStorage.setItem('record_time', playerTime));
      setResult.innerHTML = 'SUPERASTE EL RECORD :)';
      console.log('SUPERASTE EL RECORD :)');
    } else {
      setResult.innerHTML = 'lo siento, no superaste el record :(';
      console.log('lo siento, no superaste el record :(');
    }
  } else {
    fixNumber(localStorage.setItem('record_time', playerTime));
    setResult.innerHTML = 'Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)';
    console.log('Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)');
  }

  // console.log(playerTime);
}

function levelFailed() {
  
  lives--; // resto 1 a lives cada vez que se ejecuta la función
   
  if (lives >= 1) {
    window.alert(`¡Morites pai!, solo te quedan ${lives} vidas`);   
  } else {
    window.alert("Te moristes del todo");
    level = 0; // Reset al mapa
    lives = 3; // Reset a las vidas
    timeStart = undefined; // Reset la marca de tiempo
  }
  
  // Estos valores se deben ejecutar siempre que ejecute levelFailed()
  console.log("Failed");
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function showLives() {

  spanLives.innerHTML = ""; // Reset para mantener las vidas sin importar el render

  const heartsA = Array(lives).fill(emojis['HEART']); // Creación y llenado de array de los corazones

  heartsA.forEach(heart=>spanLives.append(heart)); // Crear los elementos dentro del SPAN

}

function showTime() {
  timePlayed.innerHTML = fixNumber((Date.now() - timeStart) / 1000) + "      segundos";
}

function fixNumber(num) {
  return Number(num.toFixed(1));
}

function showRecord () {
  setRecord.innerHTML = "Record: 🏆" + (localStorage.getItem("record_time")); //
}

function reloadPage () {
  return location.reload();
}

