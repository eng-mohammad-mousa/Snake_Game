declare var Swal: any;

let
    Board = document.querySelector(".play-board") as HTMLElement,
    Pause = document.getElementById("pause") as HTMLElement,
    ScoreElement = document.getElementById("score") as HTMLElement,
    HighScoreElement = document.getElementById("high-score") as HTMLElement,
    Controls = <NodeListOf<Element>>document.querySelectorAll(".controls i"),

    StartSentence = document.querySelector('.start') as HTMLElement,
    ContinueSentence = document.querySelector('.continue') as HTMLElement,

    foodX: number, foodY: number,
    snakeHeadX: number = 5, snakeHeadY: number = 5,
    snakeBodyArray: number[][] = [[snakeHeadX, snakeHeadY]],

    flagStop: boolean = false,
    oldSnakeDirX: number = 0, oldSnakeDirY: number = 0,
    snakeDirX: number = 0, snakeDirY: number = 0,

    btnResponse: boolean = true,
    gameOver: boolean = false,

    score: number = 0,
    highScore: number = Number(localStorage.getItem("high-score")) || 0;


HighScoreElement.innerText = highScore.toString();



function initGame(): void {

    if (gameOver) return gameOverFunction();

    // 1 - Set Food Position
    let Food = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // 2 - The snake ate the food
    if (foodY == snakeHeadY && foodX == snakeHeadX) {

        snakeBodyArray.push([foodX, foodY]);

        updateFoodPosition();

        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore.toString());

        ScoreElement.innerText = score.toString();
        HighScoreElement.innerText = highScore.toString();

        start()
    }

    // 3 - Snake Body Movement When Snake Length > 1
    if (snakeBodyArray.length > 1 && !flagStop) {
        for (let i = snakeBodyArray.length - 1; i > 0; i--) {
            snakeBodyArray[i] = snakeBodyArray[i - 1]
        }
    }


    // 4 - Updating the snake's head position based on the current direction
    if (!flagStop) {
        snakeHeadX += snakeDirX;
        snakeHeadY += snakeDirY;
        // Here the direction of the snake's movement has been changed, so its ability to change its direction again will be possible from now on after we disabled it in the "changeDirection" function.
        btnResponse = true;
    }


    // 5 - The head of the snake ##should not## collide with the edges of the game.
    // if (snakeHeadX <= 0 || snakeHeadX > 30 ||   snakeHeadY <= 0 || snakeHeadY > 30) { return gameOverFunction() }
    // 5` - The head of the snake ##can## collide with the edges of the game.
    if (snakeHeadX <= 0) {
        snakeHeadX = 30;
    } else if (snakeHeadX > 30) {
        snakeHeadX = 1;
    } else if (snakeHeadY <= 0) {
        snakeHeadY = 30;
    } else if (snakeHeadY > 30) {
        snakeHeadY = 1;
    }

    // 6 - Head In Body Of Snake
    snakeBodyArray[0] = [snakeHeadX, snakeHeadY]

    // 7 - Snake Head In The Game
    let snakeHead = `<div class="head" style="grid-area: ${snakeHeadY} / ${snakeHeadX}"></div>`;

    // 8 - Snake Body In The Game
    if (snakeBodyArray.length > 1) {
        for (let i = 1; i < snakeBodyArray.length; i++) {
            // Adding one div for each part of the snake's body
            snakeHead += `<div class="body" style="grid-area: ${snakeBodyArray[i][1]} / ${snakeBodyArray[i][0]}"></div>`;
            // The head of the snake should not collide with its own body in the game.
            if (i !== 0 && snakeBodyArray[0][0] == snakeBodyArray[i][0] && snakeBodyArray[0][1] == snakeBodyArray[i][1]) {
                return gameOverFunction();
            }
        }
    }

    // Finally, put the snake(The head after we added the body to it) and the food in the Board
    Board.innerHTML = Food + snakeHead;


}

function updateFoodPosition(): void {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;

    // It is forbidden for the food and the head to be in the same place at the beginning of the game. To achieve this, set the values for the food as 15-15

    // note: we put the condition (snakeBodyArray.length === 0) because in the start of game the array "snakeBodyArray" is empty
    if (snakeHeadX === 5 && snakeHeadY === 5 && foodX === 5 && foodY === 5 && (snakeBodyArray.length === 0 || snakeBodyArray.length === 1)) {
        foodX = 15;
        foodY = 15;
    }
}


function changeDirection(e: any): void {

    let Dir = e.key;
    // In order for the snake to change its direction, two basic conditions must be met
    // btn response == true
    // and the game is not stopped
    if (flagStop == false && btnResponse == true) {
        // start length of snake is 1
        // the snake here can move in all directions because its length is 1
        if (snakeBodyArray.length == 1) {
            if (Dir == 'ArrowRight') {
                snakeDirX = 1; snakeDirY = 0;
            } else if (Dir == 'ArrowDown') {
                snakeDirX = 0; snakeDirY = 1;
            } else if (Dir == 'ArrowLeft') {
                snakeDirX = -1; snakeDirY = 0;
            } else if (Dir == 'ArrowUp') {
                snakeDirX = 0; snakeDirY = -1;
            }
        }
        // length of snake is more than 1
        // the snake here can move in all directions except the direction opposite to its movement
        else if (snakeBodyArray.length > 1) {
            if (Dir == 'ArrowRight' && snakeDirX != -1) {
                snakeDirX = 1; snakeDirY = 0;
            } else if (Dir == 'ArrowDown' && snakeDirY != -1) {
                snakeDirX = 0; snakeDirY = 1;
            } else if (Dir == 'ArrowLeft' && snakeDirX != 1) {
                snakeDirX = -1; snakeDirY = 0;
            } else if (Dir == 'ArrowUp' && snakeDirY != 1) {
                snakeDirX = 0; snakeDirY = -1;
            }
        }
    }

    // Click on pause button
    if (Dir == ' ') { PauseFunction() }

    // remove start sentence when the snake starting move
    if (Dir == 'ArrowRight' || Dir == 'ArrowDown' || Dir == 'ArrowLeft' || Dir == 'ArrowUp') {
        StartSentence.remove();
    }

    // The snake's ability to change direction will be disabled until the "initGame" function is executed and the snake's direction will change
    btnResponse = false;

}


function start(): void {
    if (score >= 0 && score < 5) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 175)
    } else if (score >= 5 && score < 10) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 150)
    } else if (score >= 10 && score < 15) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 125)
    } else if (score >= 15 && score < 20) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 100)
    } else if (score >= 20 && score < 30) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 85)
    } else if (score >= 30 && score < 40) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 70)
    } else if (score >= 40 && score < 50) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 55)
    } else if (score >= 50) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 35)
    }
}

function PauseFunction(): void {

    if (flagStop == false && !document.querySelector('.start') && !gameOver) {
        // Note : It is illogical for the player to press the stop button while the game has not started yet, but this condition has been taken into account 

        flagStop = !flagStop;

        oldSnakeDirX = snakeDirX;
        oldSnakeDirY = snakeDirY;

        snakeDirX = 0; snakeDirY = 0;

        Pause.className = 'fas fa-play'
        ContinueSentence.style.cssText = 'display:block ;';


    } else if (flagStop == true && !gameOver) {

        flagStop = !flagStop;

        snakeDirX = oldSnakeDirX;
        snakeDirY = oldSnakeDirY;

        Pause.className = 'fas fa-pause'
        ContinueSentence.style.cssText = 'display:none ;';

    }

}



function gameOverFunction(): void {

    gameOver = true;

    clearInterval(startGame);

    Swal.fire({
        title: "Game Over!",
        text: "Press Ok To Try Again!",
        icon: "error",
        confirmButtonText: 'Ok',
        allowOutsideClick: false,
    }).then((result: any) => {
        if (result.isConfirmed) {
            location.reload();
        }
    });

}


// Calling changeDirection on each key click and passing key dataset value as an object

// for touch screen
Controls.forEach((button) => {
    button.addEventListener("click", () => {
        const datasetKey = (button as HTMLElement).dataset.key;
        changeDirection({ key: datasetKey });
    });
});
// for !touch screen
document.addEventListener('keyup', changeDirection);



// Staaaaaaaaaaaaaarting
updateFoodPosition();
let startGame = setInterval(initGame, 175)

