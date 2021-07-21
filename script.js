function launch() {
  // initializing the canvas and variables
  var background = new Image();
  background.src = 'background.png';

  // Mainplayer position and mapping
  var mainPlayerX = 200;
  var mainPlayerY = 200;
  var mainPlayer = new Image(50,50);
  mainPlayer.src = 'mainPlayer.png';

  // Bullet position
  var bulletX;
  var bulletY;
  var bulletFired = 0;
  var bulletMoving = 0;
  var bullet = new Image();
  bullet.src = 'bullet.png';

  // Enemy position and mapping
  var enemyX = 20;
  var enemyY = 20;
  var enemyVelocity = 1;
  var enemyStatus = 1;
  var enemy = new Image(50,50);
  enemy.src = 'enemy.png';

  function enemyMovement() {
    if ((enemyX > 550)) {
      enemyY += 10;
      enemyVelocity = -1;
    }
    else if ((enemyX < 10)) {
      enemyY += 10;
      enemyVelocity = 1;
    }
  }

  function mainLoop() {
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.drawImage(background,10,10);
    ctx.save();

    document.addEventListener('keydown', (event) => {
      const keyName = event.key;

      if (keyName === 'ArrowRight') {
        if (!(mainPlayerX > 550)) {
          mainPlayerX += 0.05;
        }
        else {
          return ;
        }
      }

      if (keyName === 'ArrowLeft') {
        if (!(mainPlayerX < 10)) {
          mainPlayerX -= 0.05;
        }
        else {
          return ;
        }
      }

      if (keyName === 'ArrowDown') {
        if (!(mainPlayerY > 400)) {
          mainPlayerY += 0.05;
        }
        else {
          return;
        }
      }

      if (keyName === 'ArrowUp') {
        if (!(mainPlayerY < 10)) {
          mainPlayerY -= 0.05;
        }
        else {
          return ;
        }
      }
    });

    document.addEventListener('keypress', (event) => {
      const keyName = event.key;
      if (keyName === ' ') {
        bulletFired = 1;
        bulletMoving = 1;
        }
      });

    if (bulletFired === 1) {
      bulletX = mainPlayerX + 12;
      bulletY = mainPlayerY + 10;
      bulletFired = 0;
    }

    if (bulletY < 20 && bulletMoving ===1) {
      bullet = undefined;
    }

    if (bullet !== undefined) {
      bulletY -= 2;
      ctx.drawImage(bullet,bulletX,bulletY);
    }

    if ( Math.sqrt((bulletX-enemyX)**2 + (bulletY-enemyY)**2) < 10) {
      // enemyStatus = 0;
      alert('Enemy destroyed!!');

    }
    //
    // if (enemyStatus === 1) {
    //   enemyMovement();
    //   enemyX += enemyVelocity;
    //   ctx.drawImage(enemy,enemyX,enemyY);
    // }

    enemyMovement();
    enemyX += enemyVelocity;
    ctx.drawImage(enemy,enemyX,enemyY);
    ctx.drawImage(mainPlayer,mainPlayerX,mainPlayerY);
    ctx.restore();
    window.requestAnimationFrame(mainLoop);

  }
  window.requestAnimationFrame(mainLoop);
}
