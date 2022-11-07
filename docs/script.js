var color1 = "#FFFFFF";
var color2 = "#C9292C";

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;

    var bricks = [];

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            //draw message on the canvas
                            //pause game instead of reloading
                            togglePauseGame()
                            win = true
                            checkWinState()
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = color1;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Score: " + score, 60, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    //draw message on the canvas
                    lose = true
                    checkWinState()
                    //pause game instead of reloading
                    togglePauseGame()
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        //adjust speed
        x += speed * dx;
        y += speed * dy;

        //pause game check
        if (!paused) {
            requestAnimationFrame(draw);
        }
    }

    /*
        Additions to starter code
    */

    //Additional variables used to help make dimensions/locations easier to reuse            
    //controls game speed      
    let speed = 1
    //pause game variable 
    let paused = false
    let animFrameId
    //high score tracking variables
    let high_score = 0
    //other variables?     
    let boxXStartCoord = 160;
    let boxYStartCoord = 200;
    let boxXEndCoord = 150;
    let boxYEndCoord = 60;

    let win = false
    let lose = false

    //event listeners added
    //game speed changes handler   
    document.getElementById("slider").addEventListener("change", adjustGameSpeed)
    //pause game event handler 
    document.getElementById("pause").addEventListener("click", togglePauseGame)
    //start a new game event handler
    document.getElementById("reset").addEventListener("click", startNewGame)
    //continue playing
    document.getElementById("continue").addEventListener("click", continuePlaying)
    //reload click event listener   
    document.getElementById("reload").addEventListener("click", () => {
        document.location.reload();
    })

    //Drawing a high score
    function drawHighScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("High Score: " + high_score, 150, 20);
    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        setShadow()
        //draw the rectangle menu backdrop
        ctx.beginPath();
        ctx.rect(20, 20, canvas.width - 40, canvas.height - 40);
        ctx.fillStyle = color2;
        ctx.fill();
        ctx.closePath();
        //draw the menu header
        ctx.font = "italic 24pt Courier New";
        ctx.fillStyle = "black";
        ctx.fillText("Breakout Game", 100, 60);
        //start game button area
        ctx.fillRect(boxXStartCoord, boxYStartCoord, boxXEndCoord, boxYEndCoord);
        ctx.font = "bold 16pt Courier New";
        ctx.fillStyle = "lightblue";
        ctx.fillText("Start Game", 165, 240);
        //event listener for clicking start
        //need to add it here because the menu should be able to come back after 
        //we remove the it later               
        canvas.addEventListener("click", startGameClick);
    }

    //function used to set shadow properties
    function setShadow() {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "yellow";
    };

    //function used to reset shadow properties to 'normal'
    function resetShadow() {
        ctx.shadowBlur = 0;
        ctx.shadowColor = "black";
    };

    //function to clear the menu when we want to start the game
    function clearMenu() {
        //remove event listener for menu, 
        //we don't want to trigger the start game click event during a game  
        canvas.removeEventListener("click", startGameClick)
        resetShadow()
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event) {
        var xVal = event.pageX - canvas.offsetLeft,
            yVal = event.pageY - canvas.offsetTop;
        if (yVal > boxYStartCoord &&
            xVal > boxXStartCoord &&
            yVal < (boxYStartCoord + boxYEndCoord) &&
            xVal < (boxXStartCoord + boxXEndCoord)) {
            clearMenu()
            win = false
            lose = false
            draw()
        }
    };

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed() {
        slider = document.getElementById("slider")
        current_speed = slider.value
        //update the slider display  
        document.getElementById("slider-label").innerText = "Game Speed: " + current_speed
        //update the game speed multiplier 
        speed = current_speed
    };

    //function to toggle the play/paused game state
    function togglePauseGame() {
        //toggle state
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
        if (!paused) {
            paused = true
            cancelAnimationFrame(animFrameId)
        }
        else {
            paused = false
            animFrameId = requestAnimationFrame(draw)
        }
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {
        if (win) {
            setShadow()
            ctx.font = "italic 32pt Courier New";
            ctx.fillStyle = "greenyellow";
            ctx.fillText("YOU WIN!", 100, 140);
        }
        if (lose) {
            setShadow()
            ctx.font = "italic 32pt Courier New";
            ctx.fillStyle = "black";
            ctx.fillText("GAME OVER", 140, 140);
        }
    };

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore) {
        resetBoard(3)
        high_score = 0
        if (paused) {
            togglePauseGame()
        }
    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying() {
        if (!lose) {
            high_score += score
            resetBoard(lives)
            if (paused) {
                togglePauseGame()
            }
        }
        
    };

    //function to reset starting game info
    function resetBoard(resetLives) {
        //reset paddle position
        paddleX = (canvas.width - paddleWidth) / 2;
        x = canvas.width / 2;
        y = canvas.height - 30;
        //reset bricks
        for (var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        //reset score and lives
        score = 0
        lives = resetLives

        win = false
        lose = false
    };

    //draw the menu.
    //we don't want to immediately draw... only when we click start game            
    //draw();
    drawMenu()
};//end window.onload function