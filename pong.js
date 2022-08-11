//Canvas

const {body}=document
const canvas=document.createElement('canvas');
const context=canvas.getContext('2d')
const width=500
const height=700
const screenWidth=window.screen.width
const canvasPosition=screenWidth/2-width/2;
const isMobile= window.matchMedia('(max-width:600px');
const gameOverEl=document.createElement("div")

// Paddle
const paddleHeight = 10;
const paddleWidth = 55;
const paddleDiff = 25;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

// Ball
let ballX = 250;
let ballY = 350;
const ballRadius = 7;

// Speed
let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

// Score

let playerScore=0;
let computerScore=0;
const winningScore=7;
let isGameOver= true;
let isNewGame=true;

// Change Mobile Settings
if (isMobile.matches) {
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
  } else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3;
  }
//Render Everything on Canvas

function renderCanvas(){
    //Canvas Background
    context.fillStyle='black'
    context.fillRect(0,0,width,height)

    //Paddle Color
    context.fillStyle='white'
    
    context.fillRect(paddleBottomX, height-20,paddleWidth, paddleHeight)
    
    context.fillRect(paddleTopX, 10,paddleWidth, paddleHeight)
// Dashed Center Line
    
   context.beginPath()
   context.setLineDash([4])
   context.moveTo(0,350);
   context.lineTo(500,350);
   context.strokeStyle='grey';
   context.stroke();

//Ball 

context.beginPath();
context.arc(ballX, ballY, ballRadius, 2* Math.PI, false);
context.fillStyle='white';
context.fill();

// Score

context.font='32px Courier New';
context.fillText(playerScore, 20, canvas.height/2+ 50)
context.fillText(computerScore, 20, canvas.height/2- 30);



}
function createCanvas(){
    canvas.width=width;
    canvas.height=height;
    body.appendChild(canvas)
    renderCanvas()
}

// Reset Ball to Center
function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
    speedY = -3;
    paddleContact = false;
  }
  
  // Adjust Ball Movement
  function ballMove() {
    // Vertical Speed
    ballY += -speedY;
    // Horizontal Speed
    if (playerMoved && paddleContact) {
      ballX += speedX;
    }
  }



// Computer Movement

function computerAI(){
    if(playerMoved){
        if(paddleTopX + paddleDiff <ballX){
            paddleTopX += computerSpeed;
        }else{
            paddleTopX-= computerSpeed
        }
    }
}


// Determine What Ball Bounces Off, Score Points, Reset Ball
function ballBoundaries() {
    // Bounce off Left Wall
    if (ballX < 0 && speedX < 0) {
      speedX = -speedX;
    }
    // Bounce off Right Wall
    if (ballX > width && speedX > 0) {
      speedX = -speedX;
    }
    // Bounce off player paddle (bottom)
    if (ballY > height - paddleDiff) {
      if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
        paddleContact = true;
        // Add Speed on Hit
        if (playerMoved) {
          speedY -= 1;
          // Max Speed
          if (speedY < -5) {
            speedY = -5;
            computerSpeed = 6;
          }
        }
        speedY = -speedY;
        trajectoryX = ballX - (paddleBottomX + paddleDiff);
        speedX = trajectoryX * 0.3;
      } else if (ballY > height) {
        // Reset Ball, add to Computer Score
        ballReset();
        computerScore++;
      }
    }
    // Bounce off computer paddle (top)
    if (ballY < paddleDiff) {
      if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
        // Add Speed on Hit
        if (playerMoved) {
          speedY += 1;
          // Max Speed
          if (speedY > 5) {
            speedY = 5;
          }
        }
        speedY = -speedY;
      } else if (ballY < 0) {
        // Reset Ball, add to Player Score
        ballReset();
        playerScore++;
      }
    }
  }
  
  //Called every Frame
function animate(){
    renderCanvas();
    ballMove();
    ballBoundaries();
    computerAI();
    gameOver();
    if(!isGameOver){
        window.requestAnimationFrame(animate)

    }
}
// Start Game, Reset Everything
function startGame(){
    if(isGameOver && !isNewGame){
     body.removeChild(gameOverEl);
     canvas.hidden=false
    }
    isGameOver=false;
    isNewGame=false;
    playerScore=0;
    computerScore=0;
    ballReset();
    createCanvas();
   animate()
    canvas.addEventListener('mousemove', (e)=>{
        console.log(e.clientX);
        playerMoved=true;

        paddleBottomX= e.clientX- canvasPosition- paddleDiff;
        if(paddleBottomX<paddleDiff){
            paddleBottomX=0;
        }
        if(paddleBottomX> width- paddleWidth){
            paddleBottomX=width- paddleWidth;
        }
        canvas.style.cursor='none';

    })
}

function gameOver(){
    if(playerScore===winningScore || computerScore===winningScore){
        isGameOver=true;

        let winner=playerScore===winningScore?"Player 1":"Computer";
        showGameOver(winner)
    }
}
function showGameOver(winner){
    canvas.hidden=true
//Container

gameOverEl.textContent=""
gameOverEl.classList.add('gameover-container');

const title=document.createElement('h1');
title.textContent=`${winner} Wins!`

const playAgainButton=document.createElement('button')
playAgainButton.setAttribute('onclick','startGame()');
playAgainButton.textContent="Play Again"
gameOverEl.append(title,playAgainButton);
body.appendChild(gameOverEl)
}
startGame()