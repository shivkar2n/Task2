function Launch() {

// initializing the canvas and variables
  var background = new Image();
  background.src = 'background.png';
  var breakOutLoop;
  var val = 1;

// Intialize high score as cookies set to zero
  if (!sessionStorage.getItem('scoreListKey')) {
    sessionStorage.setItem('scoreListKey', 0);
  }

  var mainPlayerScore = 0;
  var mainPlayerX = 400;
  var mainPlayerY = 400;
  var mainPlayerVelocity = 0.01;
  var mainPlayer = new Image(50,50);
  mainPlayer.src = 'mainPlayer.png';

// Bullet object properties
  var bulletImg = new Image();
  bulletImg.src = 'bullet.png';

  var bullet = {
    posX: null,
    posY: null,
    status: 1,

// Initiliaze starting position of bullet
    StartPos: function() {
      this.posX = mainPlayerX + 12;
      this.posY = mainPlayerY + 10;
      this.status = 0;
    },

// Update position of bullet
    UpdatePos: function() {
      ctx.drawImage(bulletImg,bullet.posX,bullet.posY);
      bullet.posY -= 2;
      bullet.status = 0;
    }
  }

// Enemy position and mapping
  var enemyImg = new Image(50,50);
  enemyImg.src = 'enemy.png';
  var enemyDir = 0;
  var enemyVelocity = 1;
  var noOfRows = 4;
  var noOfCols = 6;
  var noOfEnemies = noOfRows*noOfCols;

// Enemy properties
  function Enemy(x,y) {
    this.posX = x;
    this.posY = y;
  }
  var enemyList = new Array();

  function EnemyInitialize() {
// No of rows and columns of enemies
    for (var j = 0; j < noOfRows ; j++) {
      var enemyRow = new Array();
      for (var i = 0; i < noOfCols; i++) {
        var E1 = new Enemy(i*60,50 + 50*j);
        enemyRow.push(E1);
        E1 = null;
      }
      enemyList.push(enemyRow);
      enemyRow = null;
    }
    enemyDir = 0;
    noOfEnemies = noOfCols * noOfRows;
  }

  var ctx = document.getElementById('canvas').getContext('2d');

// Text properties
  ctx.font = "20px PressStart2P";
  ctx.fillStyle = "white";

// Checks Collision between two objects
  function Collision(X1,Y1,X2,Y2) {
    if (Math.sqrt((X1-X2)**2 + (Y1-Y2)**2) < 25) {
      return 1;
    }
  }

// Ensures enemy is within the boundary
  function EnemyPhysics() {
    for (let enemy of enemyList){
      for (let e of enemy) {
        if (e.posY > 400) {
          GameOver();
          }
        else if (enemyDir > 240) {
          e.posY += 20;
          enemyVelocity = -1 * val;
          }
        else if(enemyDir < 0) {
          e.posY += 20;
          enemyVelocity = 1 * val;
          }
        else {
          e.posX += enemyVelocity;
          }
        }
      }
    }

  function GameOver() {
    alert(`Game Over!\nScore:${mainPlayerScore}\n`);
    if (mainPlayerScore > sessionStorage.getItem("scoreListKey")) {
      sessionStorage.setItem("scoreListKey", mainPlayerScore);
    }
    window.location.reload();
  }

// Intialize the all the enemies
  EnemyInitialize();
  function MainLoop() {
    ctx.save();
    ctx.drawImage(background,0,0);

    document.addEventListener('keydown', (event) => {
      const keyName = event.key;

      if (keyName === 'ArrowRight') {
        if (!(mainPlayerX > 550)) {
          mainPlayerX += mainPlayerVelocity;
        }
        else {
          return ;
        }
      }

      if (keyName === 'ArrowLeft') {
        if (!(mainPlayerX < 14)) {
          mainPlayerX -= mainPlayerVelocity;
        }
        else {
          return ;
        }
      }

      if (keyName === 'ArrowDown') {
        if (!(mainPlayerY > 400)) {
          mainPlayerY += mainPlayerVelocity;
        }
        else {
          return;
        }
      }

      if (keyName === 'ArrowUp') {
        if (!(mainPlayerY < 10)) {
          mainPlayerY -= mainPlayerVelocity;
        }
        else {
          return ;
        }
      }
    });

    document.addEventListener('keypress', (event) => {
      const keyName = event.key;

// On spacebar keypress Intialize bullet position
      if (keyName === ' ') {
        if (bullet.status === 1) {
          bullet.StartPos();
          }
        }
      });

// If Collision occurs enemy is removed from screen
    for (let enemy of enemyList) {
      for (let e of enemy) {
        if (Collision(mainPlayerX, mainPlayerY, e.posX, e.posY)) {
          GameOver();
        }

        if (Collision(bullet.posX, bullet.posY, e.posX, e.posY)) {
          const index = enemy.indexOf(e);
          if (index > -1) {
            enemy.splice(index, 1);
            noOfEnemies -= 1;
            mainPlayerScore += 5;
            mainPlayerVelocity -= 0.00005;
            breakOutLoop = 1;
            bullet.status = 1;
            val += 0.1
            break;
          }
        }
      }
      if (breakOutLoop) {
        breakOutLoop = 0;
        break;
      }
    }

// Update bullet only if it is not outside of border
    if (bullet.posY < 20){
      bullet.status = 1;
    }

    if (!bullet.status){
      bullet.UpdatePos();
    }

    enemyDir += enemyVelocity;
    EnemyPhysics();

    if (noOfEnemies === 0){
      EnemyInitialize();
    }

    ctx.fillText(`Score : ${mainPlayerScore}`, 20,30);
    ctx.fillText(`High Score: ${sessionStorage.getItem("scoreListKey")}`, 20,50);
    ctx.fillText(`Velocity: ${mainPlayerVelocity}`, 20,70);
    for (let enemy of enemyList){
      for (let e of enemy) {
        ctx.drawImage(enemyImg,e.posX,e.posY);
      }
    }
    ctx.drawImage(mainPlayer,mainPlayerX,mainPlayerY);
    ctx.restore();
    window.requestAnimationFrame(MainLoop);
  }
  window.requestAnimationFrame(MainLoop);
}
