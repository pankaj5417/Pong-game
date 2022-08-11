//Canvas

const {body}=document
const canvas=document.createElement('canvas');
const context=canvas.getContext('2d')
const width=500
const height=700
const screenWidth=window.screen.width
const canvasPosition=screenWidth/2-width/2

// Paddle
const paddleHeight = 10;
const paddleWidth = 50;
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

function renderCanvas(){
    //Canvas Background
    context.fillStyle='black'
    context.fillRect(0,0,width,height)

    //Paddle Color
    context.fillStyle='white'
    
    context.fillRect(paddleBottomX, height-20,paddleWidth, paddleHeight)
    
    context.fillRect(paddleBottomX, 10,paddleWidth, paddleHeight)
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
function startGame(){
    playerScore=0;
    computerScore=0;
    ballReset();
    createCanvas();
    setInterval(animate,1000/60);
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

//Called every Frame
function animate(){
    renderCanvas();
    ballMove();
    ballBoundries();
    computerAI();
}
startGame()