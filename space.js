//Declaring variables:
//General variables:
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;
//ship related variables:
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight,
}

let shipImg;
let shipVelocityX = tileSize;
//alien related variables:
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;//num of aliens to shoot.
let alienVelocityX = 1;

//bullets:

let bulletArray = []
let bulletVelocityY = -10;

let score = 0;
let gameOver = false;

const gameOverText = "GAME OVER";
const underlineHeight = 4; 

//drawing board:
window.onload = function() {
  board = document.getElementById("board");
  board.width=boardWidth;
  board.height= boardHeight;
  context = board.getContext("2d");
  
  //green rectangle:
  //context.fillStyle = "green";
  //context.fillRect(ship.x, ship.y, ship.width, ship.height);
  // loading images:

  shipImg = new Image();
  shipImg.src = "./ship.png";
  shipImg.onload = function() {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  }
  alienImg = new Image();
  alienImg.src = "./alien.png";
  createAliens();

  requestAnimationFrame(update);
  this.document.addEventListener("keydown",moveShip);
  this.document.addEventListener("keyup",shoot);
}

//constantly making new frames
function update() {
  requestAnimationFrame(update);
  
  if (gameOver){
    const textYposition = boardHeight / 2;
    const textXposition = boardWidth / 2;

    context.fillStyle = "red";
    context.font ="60px macula";
    context.textAlign = "center";
    context.fillText(gameOverText, boardWidth / 2, boardHeight / 2);
    const textMetrics = context.measureText(gameOverText);
    const textWidth = textMetrics.width;

    context.fillStyle = "red";
    const underlinex = textXposition - textWidth / 2;
    const underlineY = textYposition +10;
    context.fillRect(underlinex, underlineY, textWidth, underlineHeight); 

    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //for ship:
  
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  
  //for alien:
  for(let i = 0; i < alienArray.length; i++) {
      let alien = alienArray[i];
      if (alien.alive) {
         alien.x += alienVelocityX;
         if (alien.x + alien.width >= board.width || alien.x <= 0) {
            alienVelocityX *= -1
            alien.x+=alienVelocityX*2;
            for (let j = 0; j < alienArray.length; j++){
              alienArray[j].y += alienHeight;

            }
          }
         
          context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
          
          if(alien.y == ship.y){
            gameOver = true;
          }
        }

   }
   //bullets   
   for (let i = 0; i < bulletArray.length; i++) {
      let bullet = bulletArray[i];
      bullet.y += bulletVelocityY;
      context.fillStyle = "yellow";
      context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
   
      for (let j =0; j < alienArray.length; j++) {
        let alien = alienArray[j];
        if (!bullet.used && alien.alive && detectCollision(bullet,alien)) {
          bullet.used = true;
          alien.alive = false;
          alienCount--; 
          score+=10;
        }
      }
    }

   
   while (bulletArray.length > 0 &&(bulletArray[0].used || bulletArray[0].y < 0)) {
    bulletArray.shift();//remove
   }
   if (alienCount == 0 ) {
    //increase num of aliens 
    alienColumns = Math.min(alienColumns + 1, columns/2 -2);
    alienRows = Math.min(alienRows + 1, rows - 4);
    alienVelocityX+=0.2;
    alienArray = [];
    bulletArray = [];
    createAliens();
   }
   context.fillStyle="green";
   context.font = "20px macula";
   context.fillText("Score : " + score, 5, 20);
}
//movement and stopping ship from exiting from sides.
function moveShip(e) {
  if (gameOver){
    return;
  }
  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x-=shipVelocityX ;
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX+ ship.width  <= board.width) {
        ship.x += shipVelocityX;
    }
}
function createAliens () {
   for (let c = 0; c < alienColumns; c++){
      for (let r = 0; r < alienRows; r++){
        //creating alien 
        let alien = {
           img : alienImg,
           x : alienX + c*alienWidth,
           y : alienY + r * alienHeight,
           width : alienWidth,
           height : alienHeight,
           alive : true,
        }
        
        alienArray.push(alien);     
      
      }
   
   }

   alienCount = alienArray.length;

}
function shoot(e){
  if (gameOver){
    return;
  }
  
  //shoot:
   if (e.code == "Space") {
     let bullet = {
      x: ship.x + shipWidth * 15/32,
      y: ship.y,
      width : tileSize/8,
      height : tileSize/2,
      used :false
     }
     bulletArray.push(bullet);  
   }
}

function detectCollision(a,b){
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
 }    
