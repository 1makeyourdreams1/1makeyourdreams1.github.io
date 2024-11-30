// Получаем контекст Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Устанавливаем размеры канваса
const WIDTH = 400;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Загрузка изображений
const birdImg = new Image();
birdImg.src = "assets/bee.png";

const pipeTopImg = new Image();
pipeTopImg.src = "assets/pipe.png";

const pipeBottomImg = new Image();
pipeBottomImg.src = "assets/pipe.png";

const backgroundImg = new Image();
backgroundImg.src = "assets/bg.png";

// Параметры птицы
let birdX = 50;
let birdY = HEIGHT / 2; // Изначально в центре
let birdWidth = 50;
let birdHeight = 50;
let birdVelocity = 0;
let gravity = 0.6;
let lift = -9;

// Параметры труб
const pipeWidth = 70;
const pipeGap = 150;
let pipes = [];
let pipeSpeed = 5;
let score = 0;
let frameCount = 0;

// Флаг для отслеживания старта игры
let gameStarted = false;

// Отрисовка птицы
function drawBird() {
    ctx.drawImage(birdImg, birdX - birdWidth / 2, birdY - birdHeight / 2, birdWidth, birdHeight);
}

// Отрисовка труб
function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        // Верхняя труба
        ctx.drawImage(pipeTopImg, pipe.x, 0, pipeWidth, pipe.topHeight);
        // Нижняя труба
        ctx.drawImage(pipeBottomImg, pipe.x, pipe.topHeight + pipeGap, pipeWidth, HEIGHT - (pipe.topHeight + pipeGap));
    }
}

// Движение труб
function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
    }
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Добавление новых труб
function addPipe() {
    const topHeight = Math.floor(Math.random() * (HEIGHT - pipeGap - 100)) + 50;
    pipes.push({ x: WIDTH, topHeight });
}

// Проверка столкновений
function checkCollision() {
    // Проверка столкновений с трубами
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (birdX + birdWidth / 2 > pipe.x && birdX - birdWidth / 2 < pipe.x + pipeWidth) {
            if (birdY - birdHeight / 2 < pipe.topHeight || birdY + birdHeight / 2 > pipe.topHeight + pipeGap) {
                return true;
            }
        }
    }
    // Проверка столкновений с землей и потолком
    if (birdY + birdHeight / 2 > HEIGHT || birdY - birdHeight / 2 < 0) {
        return true;
    }
    return false;
}

// Обновление счета
function updateScore() {
    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].x + pipeWidth < birdX && !pipes[i].scored) {
            score++;
            pipes[i].scored = true;
        }
    }
}

// Основная функция игры
function gameLoop() {
    if (!gameStarted) return; // Игра не начинается до первого нажатия

    // Отрисовываем фон
    ctx.drawImage(backgroundImg, 0, 0, WIDTH, HEIGHT);

    // Двигаем и рисуем трубы
    movePipes();
    drawPipes();

    // Отрисовываем птицу
    birdVelocity += gravity;
    birdY += birdVelocity;
    drawBird();

    // Обновление счета
    updateScore();

    // Проверка столкновений
    if (checkCollision()) {
        alert("Game Over! Your score: " + score);
        restartGame(); // Перезапуск игры
    }

    // Отображение счета
    ctx.fillStyle = "black";
    ctx.font = "24px 'Press Start 2P'";
    ctx.fillText("Score: " + score, 10, 40);

    // Добавление новой трубы
    frameCount++;
    if (frameCount % 70 === 0) {
        addPipe();
    }

    // Рекурсивный вызов игры
    requestAnimationFrame(gameLoop);
}

// Функция для перезапуска игры
function restartGame() {
    birdX = 50; // Птица возвращается в исходную позицию
    birdY = HEIGHT / 2; // Птица в центре экрана
    birdVelocity = 0; // Скорость обнуляется
    pipes = []; // Очищаем трубы
    score = 0; // Счет обнуляется
    frameCount = 0; // Счетчик кадров обнуляется
    gameStarted = false; // Игра еще не началась
    drawInitialScreen(); // Отрисовка начального экрана
}

// Функция для отрисовки начального экрана
function drawInitialScreen() {
    // Отрисовываем фон
    ctx.drawImage(backgroundImg, 0, 0, WIDTH, HEIGHT);

    // Отрисовываем птицу
    drawBird();


}

// Функция для старта игры
function startGame() {
    gameStarted = true;
    gameLoop(); // Запускаем основной цикл игры
}

// Обработка нажатия на пробел
document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && !gameStarted) {
        startGame(); // Начинаем игру по нажатию на пробел
    }
    if (e.code === "Space" && gameStarted) {
        birdVelocity = lift; // Птица прыгает вверх
    }
});

// Обработка касания экрана (для мобильных устройств)
document.addEventListener("touchstart", function (e) {
    if (!gameStarted) {
        startGame(); // Начинаем игру при касании экрана
    }
    if (gameStarted) {
        birdVelocity = lift; // Птица прыгает вверх при касании экрана
    }
});

// Инициализация игры
backgroundImg.onload = function() {
    drawInitialScreen(); // Отрисовываем начальный экран
};
