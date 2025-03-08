document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const player = document.getElementById("player");
    const scoreDisplay = document.getElementById("score");
    
    let playerX = window.innerWidth / 2;
    let score = 0;
    let gameOver = false;
    let enemySpeed = 3; // Initial enemy speed
    let spawnRate = 1000; // Time between enemy spawns

    // Move player left/right
    document.addEventListener("keydown", (event) => {
        if (gameOver) return;
        if (event.key === "ArrowLeft" && playerX > 10) {
            playerX -= 30;
        } else if (event.key === "ArrowRight" && playerX < window.innerWidth - 50) {
            playerX += 30;
        }
        player.style.left = `${playerX}px`;
    });

    // Create falling enemies
    function createEnemy() {
        if (gameOver) return;

        const enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.style.left = Math.random() * (window.innerWidth - 40) + "px";
        enemy.style.top = "0px";
        gameContainer.appendChild(enemy);

        let fallInterval = setInterval(() => {
            if (gameOver) {
                clearInterval(fallInterval);
                return;
            }

            let enemyTop = parseInt(enemy.style.top);
            let playerLeft = playerX;
            let enemyLeft = parseInt(enemy.style.left);
            let playerWidth = player.offsetWidth;
            let enemyWidth = enemy.offsetWidth;

            // Collision detection - stop immediately
            if (
                enemyTop >= window.innerHeight - 70 &&
                enemyLeft + enemyWidth >= playerLeft &&
                enemyLeft <= playerLeft + playerWidth
            ) {
                gameOver = true;
                scoreDisplay.innerText = `Game Over! Score: ${score}`;
                gameContainer.innerHTML = "<h2>Game Over! Refresh to Restart</h2>";
                clearInterval(fallInterval);
                return;
            }

            if (enemyTop >= window.innerHeight - 50) {
                clearInterval(fallInterval);
                gameContainer.removeChild(enemy);
                score++;
                scoreDisplay.innerText = `Score: ${score}`;

                // Increase difficulty at every multiple of 10
                if (score % 10 === 0) {
                    enemySpeed += 1;  // Increase speed
                    spawnRate = Math.max(300, spawnRate - 100); // Reduce spawn time (faster)
                }
            } else {
                enemy.style.top = enemyTop + enemySpeed + "px";
            }
        }, 30);
    }

    // Drop enemies at dynamic intervals
    function gameLoop() {
        if (!gameOver) {
            createEnemy();
            setTimeout(gameLoop, spawnRate); // Adjust spawn rate dynamically
        }
    }

    gameLoop(); // Start the game
});
