function Launch() {

// initializing the canvas and variables
  var background = new Image();
  background.src = 'background.png';

// Mainplayer position and mapping
  var mainPlayerScore = 0;
  var mainPlayerX = 200;
  var mainPlayerY = 200;
  var mainPlayer = new Image(50,50);
  mainPlayer.src = 'mainPlayer.png';

// Bullet position
  var bulletImg = new Image();
  bulletImg.src = 'bullet.png';

  var bullet = {
    posX: null,
    posY: null,
    fired: 0,
    moving: 0,
  }

// Enemy position and mapping
  var enemyImg = new Image(50,50);
  enemyImg.src = 'enemy.png';
  var enemyDir = 0;
  var enemyVelocity = 1;

// Enemy properties
  function Enemy(x,y) {
    this.posX = x;
    this.posY = y;
  }

// 8 enemies in a single row
  var enemyList = new Array();
  for (var i = 0; i < 8; i++) {
    var E1 = new Enemy(50 + i*50,50);
    enemyList.push(E1);
    E1 = null;
  }

  var ctx = document.getElementById('canvas').getContext('2d');

// Text properties
  ctx.font = "20px PressStart2P";
  ctx.fillStyle = "white";

// Checks if bullet is out of boundary
  function OutOfBounds(posY,moving) {
    if (posY < 20 && moving === 1) {
      return 0;
    }
  }

  function StartPos() {
    if (bullet.fired === 1) {
      bullet.posX = mainPlayerX + 12;
      bullet.posY = mainPlayerY + 10;
      bullet.fired = 0;
    }
  }

// Checks collision between two objects
  function collision(X1,Y1,X2,Y2) {
    if ( Math.sqrt((X1-X2)**2 + (Y1-Y2)**2) < 20) {
      return 0;
    }
    else {
      return 1;
    }
  }

// Ensures enemy is within the boundary
  function EnemyStatus(){
    for (let e of enemyList) {
        ctx.drawImage(enemyImg,e.posX,e.posY);
        e.posX += enemyVelocity;
        if (enemyDir < 0) {
          e.posY += 5;
          enemyVelocity = 1;

        }
        else if (enemyDir > 150) {
          e.posY += 5;
          enemyVelocity = -1;
        }
    }
  }

  function MainLoop() {
    ctx.save();
    ctx.drawImage(background,0,0);

    document.addEventListener('keydown', (event) => {
      const keyName = event.key;

      if (keyName === 'ArrowRight') {
        if (!(mainPlayerX > 550)) {
          mainPlayerX += 0.02;
        }
        else {
          return ;
        }
      }

      if (keyName === 'ArrowLeft') {
        if (!(mainPlayerX < 14)) {
          mainPlayerX -= 0.02;
        }
        else {
          return ;
        }
      }

      if (keyName === 'ArrowDown') {
        if (!(mainPlayerY > 400)) {
          mainPlayerY += 0.02;
        }
        else {
          return;
        }
      }

      if (keyName === 'ArrowUp') {
        if (!(mainPlayerY < 10)) {
          mainPlayerY -= 0.02;
        }
        else {
          return ;
        }
      }
    });

    document.addEventListener('keypress', (event) => {
      const keyName = event.key;

// On spacebar keypress bullet is fired and moving
      if (keyName === ' ') {
        bullet.fired = 1;
        bullet.moving = 1;
        }
      });

// Check if bullet is fired and intialize position
    if (bullet.fired) {
      StartPos();
    }

// Update bullet only if it is not out of screen
    if (!(OutOfBounds(bullet.posY, bullet.moving))) {
      console.log("Executed");
      ctx.drawImage(bulletImg,bullet.posX,bullet.posY);
      bullet.posY -= 2;
    }

// If collision occurs enemy is removed from screen
    for (let e of enemyList) {
      if (!(collision(bullet.posX, bullet.posY, e.posX, e.posY))) {
        const index = enemyList.indexOf(e);

        if (index > -1) {
          enemyList.splice(index, 1);
          mainPlayerScore += 5;
        }
      }
      if (!(collision(mainPlayerX, mainPlayerY, e.posX, e.posY))) {
          alert(`Game Over!\nScore:${mainPlayerScore}`);
          return;
        }
      }

    EnemyStatus();
    enemyDir += enemyVelocity;

    ctx.fillText(`Score : ${mainPlayerScore}`, 20,30);
    // ctx.fillText(`enemyX : ${enemyList[1].posX}`, 20,30);
    // ctx.fillText(`enemyY: ${enemyList[1].posY}`, 20,50);
    // ctx.fillText(`enemyDir: ${enemyDir}`, 20,70);
    ctx.drawImage(mainPlayer,mainPlayerX,mainPlayerY);
    ctx.restore();
    window.requestAnimationFrame(MainLoop);


  }

  ctx.fillText("Game Over!", 200,200);
  window.requestAnimationFrame(MainLoop);
}
