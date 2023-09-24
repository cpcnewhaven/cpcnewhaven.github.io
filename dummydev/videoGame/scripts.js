let player2Direction = 1;
let player2AttackInterval = null;

const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

// Create a platform
const platform = document.createElement('div');
platform.style.position = 'absolute';
platform.style.width = '100px';
platform.style.height = '10px';
platform.style.background = 'black';
platform.style.bottom = '0';
platform.style.left = '50%';
platform.style.transform = 'translateX(-50%)';
document.body.appendChild(platform);

// AI for player 2
setInterval(() => {
    const player2Left = player2.offsetLeft;
    const player2Width = player2.offsetWidth;

    if (player2Left + player2Width > window.innerWidth || player2Left < 0) {
        player2Direction *= -1;
    }

    player2.style.left = (player2Left + 10 * player2Direction) + 'px';
}, 100);

// AI attack for player 2
player2AttackInterval = setInterval(() => {
    // Add your attack logic here
    console.log('Player 2 attacks');
}, 2000);