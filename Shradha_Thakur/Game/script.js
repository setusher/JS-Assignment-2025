
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function gameLoop (){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI);
    this.fill();
  };
  
const GRAVITY = 0.5;    
const JUMP_STRENGTH = -15;
const GAME_SPEED = 5;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillCircle(this.x, this.y, this.width);
    }
}

const pf_height= 50;
const pf_y = GAME_HEIGHT - pf_height;
const pf_width = 100;

let platforms = [];

function initGround(){
    for (let i = 0; i < GAME_WIDTH/pf_width +2 ; i++){
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
const player = new Player(50,150,30,30);

function update(){
    updateGround();

    if(Math.random()<0.5 && obstacles.length < 5){

        const obstacleWidth = 20;
        const obstacleHeight = 40;
        const groundY = GAME_HEIGHT - pf_height - obstacleHeight;
        
        if (Math.random() < 0.02 && obstacles.length < 3) {
          obstacles.push(new Obstacle(GAME_WIDTH, groundY, obstacleWidth, obstacleHeight));
        }
  
    }

    for(let i = obstacles.length-1; i>=0; i--){
        obstacles[i].update();

        if(obstacles[i].isOffScreen()){
            obstacles.splice(i, 1);
        }   
    }

    player.update();
    
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let pf of platforms) pf.draw();
    for (let ob of obstacles) ob.draw();
    player.draw();
}



initGround();
gameLoop();

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      player.jump();
    }
  });