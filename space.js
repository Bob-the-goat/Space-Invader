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
}

//constantly making new frames
function update() {
  requestAnimationFrame(update);
 
  context.clearRect(0, 0, board.width, board.height);
  
  //for ship:
  
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  
  //for alien:
  for(let i = 0; i < alienArray.length; i++) {
      let alien = alienArray[i];
      if (alien.alive) {
         context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
      }
   }
}

//movement and stopping ship from exiting from sides.
function moveShip(e) {
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
