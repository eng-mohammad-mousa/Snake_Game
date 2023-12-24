"use strict";
let Board = document.querySelector(".play-board"), Pause = document.getElementById("pause"), ScoreElement = document.getElementById("score"), HighScoreElement = document.getElementById("high-score"), Controls = document.querySelectorAll(".controls i"), StartSentence = document.querySelector('.start'), ContinueSentence = document.querySelector('.continue'), foodX, foodY, snakeHeadX = 5, snakeHeadY = 5, snakeBodyArray = [[snakeHeadX, snakeHeadY]], flagStop = false, oldSnakeDirX = 0, oldSnakeDirY = 0, snakeDirX = 0, snakeDirY = 0, btnResponse = true, gameOver = false, score = 0, highScore = Number(localStorage.getItem("high-score")) || 0;
HighScoreElement.innerText = highScore.toString();
function initGame() {
    if (gameOver)
        return gameOverFunction();
    let Food = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    if (foodY == snakeHeadY && foodX == snakeHeadX) {
        snakeBodyArray.push([foodX, foodY]);
        updateFoodPosition();
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore.toString());
        ScoreElement.innerText = score.toString();
        HighScoreElement.innerText = highScore.toString();
        start();
    }
    if (snakeBodyArray.length > 1 && !flagStop) {
        for (let i = snakeBodyArray.length - 1; i > 0; i--) {
            snakeBodyArray[i] = snakeBodyArray[i - 1];
        }
    }
    if (!flagStop) {
        snakeHeadX += snakeDirX;
        snakeHeadY += snakeDirY;
        btnResponse = true;
    }
    if (snakeHeadX <= 0) {
        snakeHeadX = 30;
    }
    else if (snakeHeadX > 30) {
        snakeHeadX = 1;
    }
    else if (snakeHeadY <= 0) {
        snakeHeadY = 30;
    }
    else if (snakeHeadY > 30) {
        snakeHeadY = 1;
    }
    snakeBodyArray[0] = [snakeHeadX, snakeHeadY];
    let snakeHead = `<div class="head" style="grid-area: ${snakeHeadY} / ${snakeHeadX}"></div>`;
    if (snakeBodyArray.length > 1) {
        for (let i = 1; i < snakeBodyArray.length; i++) {
            snakeHead += `<div class="body" style="grid-area: ${snakeBodyArray[i][1]} / ${snakeBodyArray[i][0]}"></div>`;
            if (i !== 0 && snakeBodyArray[0][0] == snakeBodyArray[i][0] && snakeBodyArray[0][1] == snakeBodyArray[i][1]) {
                return gameOverFunction();
            }
        }
    }
    Board.innerHTML = Food + snakeHead;
}
function updateFoodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    if (snakeHeadX === 5 && snakeHeadY === 5 && foodX === 5 && foodY === 5 && (snakeBodyArray.length === 0 || snakeBodyArray.length === 1)) {
        foodX = 15;
        foodY = 15;
    }
}
function changeDirection(e) {
    let Dir = e.key;
    if (flagStop == false && btnResponse == true) {
        if (snakeBodyArray.length == 1) {
            if (Dir == 'ArrowRight') {
                snakeDirX = 1;
                snakeDirY = 0;
            }
            else if (Dir == 'ArrowDown') {
                snakeDirX = 0;
                snakeDirY = 1;
            }
            else if (Dir == 'ArrowLeft') {
                snakeDirX = -1;
                snakeDirY = 0;
            }
            else if (Dir == 'ArrowUp') {
                snakeDirX = 0;
                snakeDirY = -1;
            }
        }
        else if (snakeBodyArray.length > 1) {
            if (Dir == 'ArrowRight' && snakeDirX != -1) {
                snakeDirX = 1;
                snakeDirY = 0;
            }
            else if (Dir == 'ArrowDown' && snakeDirY != -1) {
                snakeDirX = 0;
                snakeDirY = 1;
            }
            else if (Dir == 'ArrowLeft' && snakeDirX != 1) {
                snakeDirX = -1;
                snakeDirY = 0;
            }
            else if (Dir == 'ArrowUp' && snakeDirY != 1) {
                snakeDirX = 0;
                snakeDirY = -1;
            }
        }
    }
    if (Dir == ' ') {
        PauseFunction();
    }
    if (Dir == 'ArrowRight' || Dir == 'ArrowDown' || Dir == 'ArrowLeft' || Dir == 'ArrowUp') {
        StartSentence.remove();
    }
    btnResponse = false;
}
function start() {
    if (score >= 0 && score < 5) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 175);
    }
    else if (score >= 5 && score < 10) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 150);
    }
    else if (score >= 10 && score < 15) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 125);
    }
    else if (score >= 15 && score < 20) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 100);
    }
    else if (score >= 20 && score < 30) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 85);
    }
    else if (score >= 30 && score < 40) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 70);
    }
    else if (score >= 40 && score < 50) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 55);
    }
    else if (score >= 50) {
        clearInterval(startGame);
        startGame = setInterval(initGame, 35);
    }
}
function PauseFunction() {
    if (flagStop == false && !document.querySelector('.start') && !gameOver) {
        flagStop = !flagStop;
        oldSnakeDirX = snakeDirX;
        oldSnakeDirY = snakeDirY;
        snakeDirX = 0;
        snakeDirY = 0;
        Pause.className = 'fas fa-play';
        ContinueSentence.style.cssText = 'display:block ;';
    }
    else if (flagStop == true && !gameOver) {
        flagStop = !flagStop;
        snakeDirX = oldSnakeDirX;
        snakeDirY = oldSnakeDirY;
        Pause.className = 'fas fa-pause';
        ContinueSentence.style.cssText = 'display:none ;';
    }
}
function gameOverFunction() {
    gameOver = true;
    clearInterval(startGame);
    Swal.fire({
        title: "Game Over!",
        text: "Press Ok To Try Again!",
        icon: "error",
        confirmButtonText: 'Ok',
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload();
        }
    });
}
Controls.forEach((button) => {
    button.addEventListener("click", () => {
        const datasetKey = button.dataset.key;
        changeDirection({ key: datasetKey });
    });
});
document.addEventListener('keyup', changeDirection);
updateFoodPosition();
let startGame = setInterval(initGame, 175);
