document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    // 游戏设置
    const gridSize = 20;
    const tileSize = canvas.width / gridSize;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 1; // 水平方向速度
    let dy = 0; // 垂直方向速度
    let score = 0;
    let gameLoopId;
    let isPaused = false;

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if (dy === 0) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy === 0) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx === 0) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx === 0) { dx = 1; dy = 0; }
                break;
        }
    });

    // 生成随机食物位置
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };

        // 确保食物不会出现在蛇身上
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood();
        }
    }

    // 绘制游戏元素
    function draw() {
        // 清空画布
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制蛇
        ctx.fillStyle = '#4CAF50';
        snake.forEach((segment, index) => {
            // 蛇头颜色不同
            if (index === 0) {
                ctx.fillStyle = '#2E7D32';
            }
            ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 1, tileSize - 1);
        });

        // 绘制食物
        ctx.fillStyle = '#FF5252';
        ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 1, tileSize - 1);

        // 更新分数
        scoreElement.textContent = score;
    }

    // 更新游戏状态
    function update() {
        if (isPaused) return;

        // 移动蛇
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // 检测是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            generateFood();
        } else {
            // 如果没吃到食物，移除尾部
            snake.pop();
        }

        // 检测碰撞
        if (
            head.x < 0 || head.x >= gridSize ||
            head.y < 0 || head.y >= gridSize ||
            snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)
        ) {
            gameOver();
            return;
        }

        draw();
    }

    // 游戏结束
    function gameOver() {
        clearInterval(gameLoopId);
        startBtn.disabled = false;
        alert(`游戏结束! 最终分数: ${score}`);
    }

    // 开始游戏
    startBtn.addEventListener('click', () => {
        if (gameLoopId) clearInterval(gameLoopId);
        // 重置游戏状态
        snake = [{ x: 10, y: 10 }];
        dx = 1;
        dy = 0;
        score = 0;
        isPaused = false;
        generateFood();
        gameLoopId = setInterval(update, 100);
        startBtn.disabled = true;
        pauseBtn.disabled = false;
    });

    // 暂停/继续游戏
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? '继续' : '暂停';
    });

    // 初始绘制
    draw();
});