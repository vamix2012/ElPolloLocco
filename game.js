let canvas;
let ctx;
let character_x = 150;
let isMovingRight = false;
let isMovingLeft = false;
let isLookingRight = true;
let isLookingLeft = false;
let isFalling = false;
let isJumping = false;
let bg_elements = 0;
let lastJumpStarted = 0;
let character_energy = 10;
let finalBossEnergy = 100;
let character_y = 190;
let imagePathsWalk = ['img/run/W-21.png', 'img/run/W-22.png', 'img/run/W-23.png', 'img/run/W-24.png', 'img/run/W-25.png', 'img/run/W-26.png'];
let imagePathsIdle = ['img/idle/I-1.png', 'img/idle/I-2.png', 'img/idle/I-3.png', 'img/idle/I-4.png', 'img/idle/I-5.png', 'img/idle/I-6.png', 'img/idle/I-7.png', 'img/idle/I-8.png', 'img/idle/I-9.png'];
let imagePathsJump = ['img/jump/J-31.png', 'img/jump/J-32.png', 'img/jump/J-33.png', 'img/jump/J-34.png', 'img/jump/J-35.png', 'img/jump/J-36.png', 'img/jump/J-37.png', 'img/jump/J-38.png', 'img/jump/J-39.png'];
let currentCharacterImage = '';
let imagesJump = [];
let imagesWalk = [];
let imagesIdle = [];
let characterGraphicsIndex = 0;
let cloudOffset = 0;
let cloudType = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
let chickens = [];
let placedBottles = [1000, 1400, 1700, 2300, 2500, 2900, 3300, 3900];
let colectedBottles = 10;
let bottleThrowTime = 0;
let trownBottleX = 0;
let trownBottleY = 0;
let bossDefeatedAt = 0;
let game_finished = false;
let characterLostAt = 0;
let introLoading = false;

// ******************* Game config ****************** \\
let JUMP_TIME = 300; //in ms 
let GAME_SPEED = 5;
let BOSS_POSITION = 5000;
let AUDIO_RUNNING = new Audio('audio/running.mp3');
let AUDIO_JUMP = new Audio('audio/jump.mp3');
let AUDIO_BOTTLE = new Audio('audio/bottle.mp3');
let AUDIO_THROW = new Audio('audio/throw.mp3');
let AUDIO_CHICKEN = new Audio('audio/chicken.mp3');
let AUDIO_GLASS = new Audio('audio/glass.mp3');
let AUDIO_WIN = new Audio('audio/win.mp3')
let AUDIO_BGM = new Audio('audio/el_pollo_loco.mp3');
AUDIO_BGM.loop = true;
AUDIO_BGM.volume = 0.2;


function init() {
    loadInitialImage();
    preloadImages(imagePathsJump, imagesJump);
    preloadImages(imagePathsIdle, imagesIdle);
    preloadImages(imagePathsWalk, imagesWalk);
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    createChickenList();
    checkForRunning();
    draw();
    calculateCloudOffset();
    listenForKeys();
    calculateChickenPosition();
    checkForCollision();


}

function loadInitialImage() {
    base_image = new Image();
    base_image.src = imagePathsIdle[0];
    currentCharacterImage = base_image;
}

function preloadImages(path, newArray) {

    for (let i = 0; i < path.length; i++) {
        let image = new Image();
        image.src = path[i];
        newArray.push(image);
    }
}

function checkForCollision() {
    setInterval(function () {
        //Check chicken
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            let chicken_x = chicken.position_x + bg_elements;
            if ((chicken_x - 35) < character_x && (chicken_x + 35) > character_x) {
                if (character_y > 150 && character_energy != 0) {
                    character_energy -= 1;
                }

                if (character_energy == 0) {
                    characterLostAt = new Date().getTime();
                    game_finished = true;
                }


            }
        }

        for (let i = 0; i < placedBottles.length; i++) {
            let bottle_x = placedBottles[i] + bg_elements;
            if ((bottle_x - 50) < character_x && (bottle_x + 50) > character_x) {
                if (character_y > 150) {
                    AUDIO_BOTTLE.play();
                    placedBottles.splice(i, 1);
                    colectedBottles++;
                }
            }
        }

        //// Check Final boss
        if (trownBottleX > BOSS_POSITION + bg_elements - 100 && trownBottleX < BOSS_POSITION + bg_elements + 100) {
            if (finalBossEnergy != 0) {
                finalBossEnergy -= 20;
                AUDIO_GLASS.play();
            } else if (bossDefeatedAt == 0) {
                bossDefeatedAt = new Date().getTime();
                finishLevel();
            }

        }
    }, 200);
}

function finishLevel() {
    AUDIO_CHICKEN.play();
    setTimeout(function () {
        AUDIO_WIN.play();
    }, 500);
    game_finished = true;

}

function calculateChickenPosition() {
    setInterval(function () {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x - chicken.speed;
        }
    }, 200);


}
function createChickenList() {
    chickens = [

        createChicken(2, 600),
        createChicken(1, 1000),
        createChicken(2, 1400),
        createChicken(1, 1900),
        createChicken(1, 2400),
        createChicken(2, 2900),
        createChicken(1, 3400),
        createChicken(1, 4000)

    ];


}
function calculateCloudOffset() {
    setInterval(function () {
        cloudOffset = cloudOffset + 0.25;
    }, 50);

}

function checkForRunning() {

    setInterval(function () {
        if (isMovingRight) {
            AUDIO_RUNNING.play();
            let index = characterGraphicsIndex % imagesWalk.length;
            currentCharacterImage = imagesWalk[index];
            characterGraphicsIndex++;
        }

        if (isMovingLeft) {
            AUDIO_RUNNING.play();
            let index = characterGraphicsIndex % imagesWalk.length;
            currentCharacterImage = imagesWalk[index];
            characterGraphicsIndex++;
        }

        if (!isMovingLeft && !isMovingRight && !isJumping && !isFalling) {
            let index = characterGraphicsIndex % imagesIdle.length;
            currentCharacterImage = imagesIdle[index];
            characterGraphicsIndex++;
            AUDIO_RUNNING.pause();
        }

    }, 300);
    setInterval(() => {
        if (isJumping) {
            let index = characterGraphicsIndex % imagesJump.length;
            currentCharacterImage = imagesJump[index];
            characterGraphicsIndex++;
        }

    }, 60);

}

function draw() {


    drawBackground();
    if (game_finished) {
        drawfinalScreen();
    } else {

        updateCharacter();
        drawChicken();
        drawBottles();
        requestAnimationFrame(draw);
        drawEnergyBar();
        drawInformation();
        drawThrowBottle();
        drawFinalBoss();
    }
}


function drawfinalScreen() {
    ctx.fillStyle = "orange";
    ctx.font = '80px Comic Sans MS';
    let msg = 'You Won!'
    if (characterLostAt > 0) {
        msg = 'You Lost!'
    }
    ctx.textAlign = "center";
    ctx.fillText(msg, canvas.width / 2, canvas.height / 2);

}


function drawFinalBoss() {
    let chicken_x = BOSS_POSITION;
    let bossIamge = 'img/chicken_big.png';
    let chicken_y = 98;
    let energyBarX = BOSS_POSITION - 5;
    let energyBarY = 75;

    if (bossDefeatedAt > 0) {
        let timePassed = new Date().getTime() - bossDefeatedAt;
        chicken_x = chicken_x + timePassed * 0.7;
        chicken_y = chicken_y - timePassed * 0.3;
        energyBarX = energyBarX + timePassed * 0.7;
        energyBarY = energyBarY - timePassed * 0.3;
        bossIamge = 'img/chicken_dead.png';

    }

    addBackgroundObject(bossIamge, chicken_x, chicken_y, 0.45, 1);

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "red";
    ctx.fillRect(BOSS_POSITION + bg_elements, 80, 2 * finalBossEnergy, 10);

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "blue";
    ctx.fillRect(energyBarX + bg_elements, energyBarY, 210, 20);
    ctx.globalAlpha = 1;
}

function drawThrowBottle() {
    if (bottleThrowTime) {
        let timePassed = new Date().getTime() - bottleThrowTime;
        let gravity = Math.pow(9.81, timePassed / 289)
        trownBottleX = 220 + (timePassed * 0.9);
        trownBottleY = 300 - (timePassed * 0.4 - gravity);

        let base_image = new Image();
        base_image.src = 'img/tabasco.png';
        if (base_image.complete) {
            ctx.drawImage(base_image, trownBottleX, trownBottleY, base_image.width * 0.5, base_image.height * 0.5);
        };
    }


}

function drawInformation() {
    let base_image = new Image();
    base_image.src = 'img/tabasco.png';
    if (base_image.complete) {
        ctx.drawImage(base_image, 0, 0, base_image.width * 0.4, base_image.height * 0.4);
    };
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    ctx.font = '30px Comic Sans MS';
    ctx.strokeText(colectedBottles, 50, 45);
}

function drawBottles() {
    for (let i = 0; i < placedBottles.length; i++) {
        let bottle_x = placedBottles[i];
        addBackgroundObject('img/tabasco.png', bottle_x, 353, 0.47, 1);
    }
}

function drawEnergyBar() {

    let base_image = new Image();
    base_image.src = 'img/lives.png';
    if (base_image.complete) {
        ctx.drawImage(base_image, 90, -5, base_image.width * 0.4, base_image.height * 0.4);
    };
    ctx.globalAlpha = 1;

    ctx.font = '30px Comic Sans MS';
    ctx.strokeText(character_energy, 150, 45);
}

function drawChicken() {

    for (i = 0; i < chickens.length; i = i + 1) {
        let chicken = chickens[i];
        addBackgroundObject(chicken.img, chicken.position_x, chicken.position_y, chicken.scale, 1);
    }

}

function createChicken(type, position_x) {
    let position_y = 345;
    if (type == 2) {
        position_y = 363;
    } if (type == 1) {
        position_y = 355;
    }
    return {
        "img": "img/chickens/c" + type + "-1.png",
        "position_x": position_x,
        "position_y": position_y,
        "scale": 0.3,
        "speed": (Math.random() * 5)
    };
}

function updateCharacter() {

    let base_image = currentCharacterImage;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME && isJumping) {
        character_y = character_y - 10;

    } else {
        if (character_y < 190) {

            character_y = character_y + 10;
        }
    }

    if (base_image.complete) {
        if (isMovingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(base_image, (-character_x - 90) + 20, character_y, base_image.width * 0.17, base_image.height * 0.2);
            ctx.scale(-1, 1);
        }
        if (isMovingRight) {
            ctx.drawImage(base_image, character_x - 20, character_y, base_image.width * 0.17, base_image.height * 0.2);
        }
        if (!isMovingRight && isLookingRight) {
            ctx.drawImage(base_image, character_x - 20, character_y, base_image.width * 0.17, base_image.height * 0.2);
        }
        if (!isMovingLeft && isLookingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(base_image, (-character_x - 90) + 20, character_y, base_image.width * 0.17, base_image.height * 0.2);
            ctx.scale(-1, 1);
        }

    }
}



function drawBackground() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    drawGround();

    for (let i = 0; i < cloudType.length; i++) {
       num = cloudType[i]; 
        addBackgroundObject('img/cloud'+ num +'.png', (i * canvas.width) - cloudOffset, 20, 0.4, 1);
    }

}

function drawGround() {

    if (isMovingRight) {
        bg_elements = bg_elements - GAME_SPEED;
    }

    if (isMovingLeft && bg_elements < 0) {
        bg_elements = bg_elements + GAME_SPEED;
    }
 for (let i = 0; i < 10; i++) {

        addBackgroundObject('img/bg/2.png', i * canvas.width, 75, 0.375, 1);
        addBackgroundObject('img/bg/3.png', (i + 1) * canvas.width, 75, 0.375, 1);

    }
    for (let i = 0; i < 10; i++) {

        addBackgroundObject('img/bg/0.png', i * canvas.width, 75, 0.375, 1);
        addBackgroundObject('img/bg/1.png', (i + 1) * canvas.width, 75, 0.375, 1);

    }
   
    //draw Ground
    for (let i = 0; i < 10; i++) {
        addBackgroundObject('img/bg/4.png', i * canvas.width, 75, 0.375, 1);
        addBackgroundObject('img/bg/5.png', (i + 1) * canvas.width, 75, 0.375, 1);
    }

}

function addBackgroundObject(src, offsetY, offsetX, scale, opacity) {
    if (opacity != undefined) {
        ctx.globalAlpha = opacity;
    }

    let base_image = new Image();
    base_image.src = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, offsetY + bg_elements, offsetX, base_image.width * scale, base_image.height * scale);
    };
    ctx.globalAlpha = 1;
}

function listenForKeys() {
    document.addEventListener("keydown", e => {
        const k = e.key;
        if (k == 'ArrowRight') {
            isMovingRight = true;
            isLookingRight = true;
            isLookingLeft = false;
        }
        if (k == 'ArrowLeft') {
            isMovingLeft = true;
            isLookingRight = false;
            isLookingLeft = true;
        }

        if (k == 'd') {
            let timePassed = new Date().getTime() - bottleThrowTime;
            if (timePassed > 1000) {
                AUDIO_THROW.play();
                colectedBottles--;
                bottleThrowTime = new Date().getTime();
            }

        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (k == ' ' && timePassedSinceJump > JUMP_TIME * 2) {
            isJumping = true;
            AUDIO_JUMP.play();
            lastJumpStarted = new Date().getTime();
            setTimeout(function () {
                isJumping = false;
            }, 600);

        }


    });
    document.addEventListener("keyup", e => {
        const k = e.key;
        if (k == 'ArrowRight') {
            isMovingRight = false;
        }
        if (k == 'ArrowLeft') {
            isMovingLeft = false;
        }


    });
}
