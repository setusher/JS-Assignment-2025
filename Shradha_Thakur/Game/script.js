
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function gameLoop (){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
  
const GRAVITY = 0.5;    
const JUMP_STRENGTH = -15;
let GAME_SPEED = 10;
 


const GAME_WIDTH = 1000;
const GAME_HEIGHT = 600;

const playerImg = new Image();
playerImg.src = 'assets/player.png';

const platformImg = new Image();
platformImg.src = 'assets/platform.avif';

const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacle.png';

const coinImg = new Image();
coinImg.src = 'assets/coin.png';


class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = 0;
        this.color = 'blue';
    }

    update() {
        this.velocity += GRAVITY;
        this.y += this.velocity;
        if (this.y + this.height >= GAME_HEIGHT) {
            this.y = GAME_HEIGHT - this.height;
            this.velocity = 0;
        }
    }
    draw() {
        
        ctx.drawImage(playerImg,this.x, this.y, this.width, this.height);
    }

    jump(){
        this.velocity = JUMP_STRENGTH;
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 'green';
    }

    update(){
        this.x -= GAME_SPEED;
    }
    draw() {
        ctx.drawImage(platformImg, this.x, this.y, this.width, this.height);

    }
    isOffScreen(){
        return this.x + this.width < 0;
    }
}

class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 'red';
    }

    update(){
        this.x -= GAME_SPEED;
    }

    draw() {
        
        ctx.drawImage(obstacleImg, this.x, this.y, this.width, this.height);
    }
    isOffScreen(){
        return this.x + this.width < 0;
    }
}

class Ring{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 'yellow';
    }
    update(){
        this.x -= GAME_SPEED;
    }

    draw() {
   
        ctx.drawImage(coinImg, this.x, this.y, this.width, this.height);
    }
    isOffScreen(){
        return this.x + this.width < 0;
    }

}

const pf_height= 800;
const pf_y = 0;
const pf_width = 1000;

let platforms = [];

function initGround(){
    for (let i = 0; i <= Math.ceil(GAME_WIDTH / pf_width) + 6 ; i++){
        platforms.push(new Platform(i*pf_width, pf_y, pf_width, pf_height));
    }   

}

function updateGround(){

    console.log("Platforms length:", platforms.length);
    if (platforms.length > 0) {
        console.log("First platform X:", platforms[0].x);
        console.log("Last platform X + Width:", platforms[platforms.length-1].x + platforms[platforms.length-1].width);
    }

    for (let i = 0; i < platforms.length; i++){
        // GAME_SPEED += 0.00002;
        platforms[i].update();
    }

    if (platforms.length >0 && platforms[0].isOffScreen()){
        platforms.shift();
    }

    const end_pf = platforms[platforms.length-1];
    if (end_pf.x + end_pf.width < GAME_WIDTH + pf_width) {
        platforms.push(new Platform(end_pf.x + end_pf.width, pf_y, pf_width, pf_height));
    }


}

let obstacles = [];
const player = new Player(50,150,80,100);
let collectables = [];
let score = 0;


function update(){
    updateGround();

    for(let i = 0; i < obstacles.length; i++){
       
        if(isColliding(player, obstacles[i])){
            console.log("Game Over");
            gameover();
            break;
        }
    }

    if(Math.random()<0.5 && obstacles.length < 5){

        const obstacleWidth = 50;
        const obstacleHeight = 80;
        const groundY = 520;
        
        if (Math.random() < 0.02 && obstacles.length < 3) {
          obstacles.push(new Obstacle(GAME_WIDTH+700, groundY, obstacleWidth, obstacleHeight));
        }
  
    }

    for(let i = obstacles.length-1; i>=0; i--){
        obstacles[i].update();

        if(obstacles[i].isOffScreen()){
            obstacles.splice(i, 1);
        }   
    }

    if(Math.random()<0.2 && collectables.length < 5){

        const ringWidth = 100;
        const ringHeight = 100;
        const groundY = 520;
        
        if (Math.random() < 0.02 && collectables.length < 3) {
          collectables.push(new Ring(GAME_WIDTH+700, groundY, ringWidth, ringHeight));
        }
  
    }

    for(let i = collectables.length-1; i>=0; i--){
        collectables[i].update();

        if(collectables[i].isOffScreen()){
            collectables.splice(i, 1);
            continue;
        }   

        if(isColliding(player, collectables[i])){
            score += 1;
            collectables.splice(i, 1);
        }
    }

    player.update();
    
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let pf of platforms) pf.draw();
    for (let ob of obstacles) ob.draw();
    for (let c of collectables) c.draw();

    player.draw();

    ctx.fillStyle = 'black padding 20px bold';
    ctx.font = '40px Arial';
    ctx.fillText("SCORE: " + score, 20, 40);

}

function isColliding(r1,r2){
    return (
        r1.x<r2.x+r2.width &&  
        r1.x+r1.width>r2.x &&
        r1.y<r2.y+r2.height &&
        r1.y+r1.height>r2.y
    );
}

function gameover(){
    alert("Game Over! Your Score is: " + score);

    location.document.reload();
}


initGround();
gameLoop();

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      player.jump();
    }
  });