// Declaring variables
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

// Ship variables:
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
};

let shipImg;
let shipVelocityX = tileSize;

// Alien variables:
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1;

// Bullet variables:
let bulletArray = [];
const  bulletVelocityY = -10;


let score = 0;
let gameOver = false;
let highscore = 0;

//More alien stuff:
let alienImagesArray = [];
let alienImg, aliencImg, alienmImg, alienyImg;

let animationFrameId;
let canshoot = true;

const gameOverText = "GAME OVER";
const underlineHeight = 4;


window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Loading images
    shipImg = new Image();
    shipImg.src = "./ship.png";

    alienImg = new Image();
    alienImg.src = "./alien.png";
    aliencImg = new Image();
    aliencImg.src = "./alien-cyan.png";
    alienmImg = new Image();
    alienmImg.src = "./alien-magenta.png";
    alienyImg = new Image();
    alienyImg.src = "./alien-yellow.png";

    alienImagesArray = [alienImg, aliencImg, alienmImg, alienyImg];


    createAliens();
    animationFrameId = requestAnimationFrame(update);

    document.addEventListener("keydown", handleKeyDown);
}


function update() {
    animationFrameId = requestAnimationFrame(update);

    if (gameOver) {
      if (score > highscore)  {
        highscore = score;
      }
      drawGameOver();
        return;
    }


    context.clearRect(0, 0, board.width, board.height);


    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);


    let edgeHit = false;
    for (let alien of alienArray) {
        if (alien.alive) {
            alien.x += alienVelocityX;
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                edgeHit = true;
            }
            context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);

 
            if (alien.y + alien.height >= ship.y) {
                gameOver = true;
            }
        }
    }

    if (edgeHit) {
        alienVelocityX *= -1;
        for (let alien of alienArray) {
            alien.y += alienHeight;
        }
    }

    //  bullets
    for (let bullet of bulletArray) {
        bullet.y += bulletVelocityY;
        context.fillStyle = "yellow";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        for (let alien of alienArray) {
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 10;
            }
        }
    }


    bulletArray = bulletArray.filter(b => !b.used && b.y > 0);

   
    if (alienCount == 0) {
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienVelocityX += 0.2;
        alienArray = [];
        bulletArray = [];
        createAliens();
    }


    context.fillStyle = "green";
    context.font = "20px 'Courier New', monospace";
    context.textAlign = "left"
    context.fillText("Score : " + score, 15, 20);

    context.fillStyle = "orange";
    context.textAlign = "right"
    context.fillText("Highscore : " + highscore, board.width - 15, 20);
}


function handleKeyDown(e) {
    if (gameOver && e.code == "Space") {
        reset();
        return;
    }

    if (!gameOver) {
        if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
            ship.x -= shipVelocityX;
        } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
            ship.x += shipVelocityX;
        } else if (e.code == "Space" && canshoot) {
            shootBullet();
            canshoot = false;
        }
    }
  }
  document.addEventListener("keyup", function(e){
   if (e.code == "Space") {
    canshoot = true;
   }
  });
function shootBullet() {
    let bullet = {
        x: ship.x + ship.width / 2 - tileSize / 16,
        y: ship.y,
        width: tileSize / 8,
        height: tileSize / 2,
        used: false
    };
    bulletArray.push(bullet);
}

// Creating aliens
function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            const randomI = Math.floor(Math.random() * alienImagesArray.length);
            const alienColorImg = alienImagesArray[randomI];

            let alien = {
                img: alienColorImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            };
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}


function drawGameOver() {
    const textYposition = boardHeight / 2;
    const textXposition = boardWidth / 2;

    context.fillStyle = "blue";
    context.font = "24px 'Courier New', monospace";
    context.textAlign = "center";
    context.fillText("HIGH SCORE : " + highscore, textXposition,textYposition - 60);
    
    context.fillStyle = "red";
    context.font = "60px 'Courier New', monospace";
    context.textAlign = "center";
    context.fillText(gameOverText, textXposition, textYposition);

    const textMetrics = context.measureText(gameOverText);
    const textWidth = textMetrics.width;

    context.fillRect(textXposition - textWidth / 2, textYposition + 10, textWidth, underlineHeight);
    let offset = textMetrics.actualBoundingBoxAscent || 60;//AI
    context.fillStyle = "white";
    context.font = "18px 'Courier New', monospace";
    context.fillText("Press the SPACE BAR to Play Again", textXposition, textYposition + offset +20);
}

// redeclaring variable
function reset() {
  if (animationFrameId){
    cancelAnimationFrame(animationFrameId);
  }  
  gameOver = false;
    score = 0;

    ship.x = shipX;
    ship.y = shipY;

    alienRows = 2;
    alienColumns = 3;
    alienVelocityX = 1;

    alienArray = [];
    bulletArray = [];
    createAliens();
    canshoot = true;
    animationFrameId = requestAnimationFrame(update);
}
