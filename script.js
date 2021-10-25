let score = document.querySelector("#score");
var audio = document.createElement("audio");
let record = document.querySelector("#record");

const sprites = new Image();
sprites.src = "./img/snake-graphics.png";

let canvas = document.getElementById("snake"); //criar elemento que irá rodar o jogo
let context = canvas.getContext("2d"); //....

let box = 32;

let snake = [
  { x: 8 * box, y: 8 * box, direction: { x: 1, y: 0 } },
  { x: 16 * box, y: 16 * box, direction: { x: 1, y: 0 } },
]; //criar cobrinha como lista, já que ela vai ser uma série de coordenadas, que quando pintadas, criam os quadradinhos

function somComida() {
  audio.src = "./audio/coin.mp3";
  audio.play();
}

function somGameOver() {
  audio.src = "./audio/smw-exit.mp3";
  audio.play();
}

let food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box,
};

function criarBG() {
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 18 * box, 18 * box); //desenha o retângulo usando x e y e a largura e altura setadas
}

function criarCobrinha() {
  let spriteHeadPosition = {
    x: 254,
    y: 0,
  };

  if (snake[0].direction.x === 1) spriteHeadPosition = { x: 256, y: 0 }; //head sprite right
  if (snake[0].direction.x === -1) spriteHeadPosition = { x: 192, y: 64 }; //head sprite left
  if (snake[0].direction.y === 1) spriteHeadPosition = { x: 256, y: 64 }; //head sprite down
  if (snake[0].direction.y === -1) spriteHeadPosition = { x: 192, y: 0 }; //head sprite up

  context.drawImage(
    sprites,
    spriteHeadPosition.x,
    spriteHeadPosition.y,
    64,
    64,
    snake[0].x,
    snake[0].y,
    box,
    box
  );

  //cria calda
  if (snake.length > 1) {
    //cria calda
    let spriteTailPosition = {
      x: 256,
      y: 128,
    };

    if (snake[snake.length - 1].direction.x > 0)
      spriteTailPosition = { x: 256, y: 128 };
    if (snake[snake.length - 1].direction.x < 0)
      spriteTailPosition = { x: 192, y: 192 };
    if (snake[snake.length - 1].direction.y > 0)
      spriteTailPosition = { x: 256, y: 192 };
    if (snake[snake.length - 1].direction.y < 0)
      spriteTailPosition = { x: 192, y: 128 };

    context.drawImage(
      sprites,
      spriteTailPosition.x,
      spriteTailPosition.y,
      64,
      64,
      snake[snake.length - 1].x,
      snake[snake.length - 1].y,
      box,
      box
    );
  }

  // cria o resto do corpo
  for (i = 1; i < snake.length - 1; i++) {
    let haveRight = (haveLeft = haveUp = haveDown = false);

    if (snake[i].direction.x > 0) haveRight = true; //tem na direita
    if (snake[i].direction.x < 0) haveLeft = true; //tem na esquerda
    if (snake[i].direction.y > 0) haveDown = true; //tem em baixo
    if (snake[i].direction.y < 0) haveUp = true; // tem em cima

    let nodoAnteriorX = snake[i + 1].direction.x * -1; //inverte o valores
    let nodoAnteriory = snake[i + 1].direction.y * -1; //inverte o valores

    if (nodoAnteriorX < 0) haveLeft = true; //tem na esquerda
    if (nodoAnteriorX > 0) haveRight = true; //tem na direita
    if (nodoAnteriory < 0) haveUp = true; //tem em cima
    if (nodoAnteriory > 0) haveDown = true; //tem em baixo

    let spriteBodyPosition = {
      x: 64,
      y: 0,
    };

    if (haveLeft && haveRight) spriteBodyPosition = { x: 64, y: 0 };
    if (haveUp && haveDown) spriteBodyPosition = { x: 128, y: 64 };
    if (haveLeft && haveDown) spriteBodyPosition = { x: 128, y: 0 };
    if (haveLeft && haveUp) spriteBodyPosition = { x: 128, y: 128 };
    if (haveRight && haveDown) spriteBodyPosition = { x: 0, y: 0 };
    if (haveRight && haveUp) spriteBodyPosition = { x: 0, y: 64 };

    context.drawImage(
      sprites,
      spriteBodyPosition.x,
      spriteBodyPosition.y,
      64,
      64,
      snake[i].x,
      snake[i].y,
      box,
      box
    );
  }
}

function pontuou() {
  score.innerText = snake.length.toLocaleString("pt-BR", {
    minimumIntegerDigits: 3,
    useGrouping: false,
  });
  let pontuacao = Number(score.innerText);

  if (pontuacao > Number(localStorage.getItem("record"))) {
    localStorage.setItem("record", pontuacao);
    record.innerText = pontuacao.toLocaleString("pt-BR", {
      minimumIntegerDigits: 3,
      useGrouping: false,
    });
  }
}

function drawFood() {
  context.drawImage(
    sprites, //spritesheet
    0,
    192, // x = 0 y = 192 (64+64+64) posição inicial do recorte
    64,
    64, // tamanho do recorte no nosso spritesheet
    food.x,
    food.y, //posição da comida
    box,
    box // tamanho da comida
  );
}

//quando um evento acontece, detecta e chama uma função
document.addEventListener("keydown", update);

function update(event) {
  if (event.keyCode == 37 && snake[0].direction.x != 1)
    snake[0].direction = { x: -1, y: 0 }; //left
  if (event.keyCode == 38 && snake[0].direction.y != 1)
    snake[0].direction = { x: 0, y: -1 }; //up
  if (event.keyCode == 39 && snake[0].direction.x != -1)
    snake[0].direction = { x: 1, y: 0 }; //right
  if (event.keyCode == 40 && snake[0].direction.y != -1)
    snake[0].direction = { x: 0, y: 1 }; //down
}

function iniciarJogo() {
  record.innerText = Number(localStorage.getItem("record")).toLocaleString(
    "pt-BR",
    { minimumIntegerDigits: 3, useGrouping: false }
  );

  if (snake[0].x > 15 * box && snake[0].direction.x == 1) snake[0].x = 0;
  if (snake[0].x > 15 * box && snake[0].direction.y == -1) snake[0].x = 0;
  if (snake[0].x > 15 * box && snake[0].direction.y == 1) snake[0].x = 0;

  if (snake[0].x < 0 && snake[0].direction.x == -1) snake[0].x = 15 * box;
  if (snake[0].x < 0 && snake[0].direction.y == -1) snake[0].x = 15 * box;
  if (snake[0].x < 0 && snake[0].direction.y == 1) snake[0].x = 15 * box;

  if (snake[0].y > 15 * box && snake[0].direction.y == 1) snake[0].y = 0;
  if (snake[0].y > 15 * box && snake[0].direction.x == 1) snake[0].y = 0;
  if (snake[0].y > 15 * box && snake[0].direction.x == -1) snake[0].y = 0;

  if (snake[0].y < 0 && snake[0].direction.y == -1) snake[0].y = 15 * box;
  if (snake[0].y < 0 && snake[0].direction.x == 1) snake[0].y = 15 * box;
  if (snake[0].y < 0 && snake[0].direction.x == -1) snake[0].y = 15 * box;

  for (i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      //clearInterval(jogo);
      somGameOver();
      gameOver();
      setTimeout(function () {
        gameOver();
      }, 500);
    }
  }

  criarBG();
  criarCobrinha();
  drawFood();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (snake[0].direction.x == 1) snakeX += box;
  if (snake[0].direction.x == -1) snakeX -= box;
  if (snake[0].direction.y == -1) snakeY -= box;
  if (snake[0].direction.y == 1) snakeY += box;

  let newHead = {
    x: snakeX,
    y: snakeY,
    direction: {
      x: snake[0].direction.x,
      y: snake[0].direction.y,
    },
  };

  if (snakeX != food.x || snakeY != food.y) {
    snake.pop(); //pop tira o último elemento da lista
  } else {
    food.x = Math.floor(Math.random() * 15 + 1) * box;
    food.y = Math.floor(Math.random() * 15 + 1) * box;
    pontuou();
    somComida();
  }
  snake.unshift(newHead); //método unshift adiciona ...
}

function gameOver() {
  clearInterval(jogo);
  snake.direction = {
    x: 0,
    y: 0,
  };

  function reload() {
    document.addEventListener("keydown", () => location.reload());
  }

  document.removeEventListener("keydown", update);

  context.fillStyle = "#00000065";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#ffffff";
  context.font = "30px Comic Sans MS";
  const gameOverText = "GAME OVER 💀⚰️",
    gameOverTextWidth = context.measureText(gameOverText).width;

  context.fillText(
    gameOverText,
    canvas.width / 2 - gameOverTextWidth / 2,
    canvas.height / 2 - 15
  );

  context.font = "20px arial seriff";
  const pressButtonText = "Pressione qualquer tecla para reiniciar o jogo",
    pressButtonTextWidth = context.measureText(pressButtonText).width;

  context.fillText(
    pressButtonText,
    canvas.width / 2 - pressButtonTextWidth / 2,
    canvas.height / 2 + 40
  );

  setTimeout(reload, 1000);
}

let jogo = setInterval(iniciarJogo, 100);