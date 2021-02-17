let canvas;
let ctx;
let character_x = 150;
let isMovingRight = false;
let isMovingLeft = false;
let isLookingRight = true;
let isLookingLeft = false;
let isJumping = false;
let isColiding = false;
let bg_elements = 0;
let bg_elements2 = 0;
let bg_elements3 = 0;
let lastJumpStarted = 0;
let character_energy = 10;
let finalBossEnergy = 100;
let character_y = 190;
let currentCharacterImage = '';
let characterGraphicsIndex = 0;
let cloudOffset = 0;
let cloudType = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
let chickens = [];
let placedBottles = [1000, 1400, 1700, 2300, 2500, 2900, 3300, 3900];
let colectedBottles = 0;
let bottleThrowTime = 0;
let trownBottleX = 0;
let trownBottleY = 0;
let bossDefeatedAt = 0;
let game_finished = false;
let game_started = false;
let characterLostAt = 0;

function init() {

    loadInitialImage();
    preloadImages(imagePathsJump, imagesJump);
    preloadImages(imagePathsIdle, imagesIdle);
    preloadImages(imagePathsWalk, imagesWalk);
    preloadImages(imagesPathsBg, imagesBg);
    preloadImages(imagesPathClouds, imagesCloud);
    preloadImages(imagesPathHit, imagesHit);
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    calculateCloudOffset();
    draw();
}


function startGame() {
    game_started = true;
    document.getElementById('startScreen').classList.add("d-none");
    createChickenList();
    checkForRunning();
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
                    isColiding = true;

                    character_energy -= 1;
                    setTimeout(() => {
                        isColiding = false;
                    }, 200);
                }

                if (character_energy == 0) {
                    characterLostAt = new Date().getTime();
                    game_finished = true;
                    AUDIO_OVER.play();
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
    }, 250);
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
        if (isMovingRight && !game_finished && !isColiding) {
            AUDIO_RUNNING.play();
            let index = characterGraphicsIndex % imagesWalk.length;
            currentCharacterImage = imagesWalk[index];
            characterGraphicsIndex++;
        }

        if (isMovingLeft && !game_finished && !isColiding) {
            AUDIO_RUNNING.play();
            let index = characterGraphicsIndex % imagesWalk.length;
            currentCharacterImage = imagesWalk[index];
            characterGraphicsIndex++;
        }

        if (!isMovingLeft && !isMovingRight && !isJumping && !isColiding) {
            let index = characterGraphicsIndex % imagesIdle.length;
            currentCharacterImage = imagesIdle[index];
            characterGraphicsIndex++;
            AUDIO_RUNNING.pause();
        }

        if (isColiding) {
            let index = characterGraphicsIndex % imagesHit.length;
            currentCharacterImage = imagesHit[index];
            characterGraphicsIndex++;
            AUDIO_HIT.play();
        }

    }, 100);
    setInterval(() => {
        if (isJumping) {
            let index = characterGraphicsIndex % imagesJump.length;
            currentCharacterImage = imagesJump[index];
            characterGraphicsIndex++;
        }

    }, 100);

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
    ctx.font = '30px Comic Sans MS';
    let msg = `You Won!  Press Enter to reload game`
    if (characterLostAt > 0) {
        msg = `You Lost!  Press Enter to reload game`
    }
    ctx.textAlign = "center";
    ctx.fillText(msg, canvas.width / 2, canvas.height / 2);


    document.addEventListener("keydown", e => {
        const k = e.key;
        if (k == "Enter") {
            window.location.reload();
        }
    });
}


function drawFinalBoss() {
    let chicken_x = BOSS_POSITION;
    let bossIamge = 'img/chicken_big.png';
    let chicken_y = 90;
    let energyBarX = BOSS_POSITION + 15;
    let energyBarY = 75;

    if (bossDefeatedAt > 0) {
        let timePassed = new Date().getTime() - bossDefeatedAt;
        chicken_x = chicken_x + timePassed * 0.7;
        chicken_y = chicken_y - timePassed * 0.3;
        energyBarX = energyBarX + timePassed * 0.7;
        energyBarY = energyBarY - timePassed * 0.3;
        bossIamge = 'img/chicken_dead.png';

    }

    addBackgroundObject(bossIamge, chicken_x, chicken_y, 0.30, 1, bg_elements);

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "red";
    ctx.fillRect(BOSS_POSITION + bg_elements + 20, 80, 2 * finalBossEnergy, 10);

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "blue";
    ctx.fillRect(energyBarX + bg_elements, energyBarY, 210, 20);
    ctx.globalAlpha = 1;
}

function drawThrowBottle() {
    if (bottleThrowTime) {
        let timePassed = new Date().getTime() - bottleThrowTime;
        let gravity = Math.pow(9.81, timePassed / 289);
        trownBottleX = 200 + (timePassed * 0.7);
        trownBottleY = 250 - (timePassed * 0.4 - gravity);

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
        addBackgroundObject('img/tabasco.png', bottle_x, 353, 0.47, 1, bg_elements);
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
        addBackgroundObject(chicken.img, chicken.position_x, chicken.position_y, chicken.scale, 1, bg_elements);
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
        addBackgroundObject(imagesCloud[num - 1], (i * canvas.width) - cloudOffset, 20, 0.4, 1, bg_elements3);

    }

}

function drawGround() {

    if (isMovingRight) {
        bg_elements = bg_elements - GAME_SPEED;
        bg_elements2 = bg_elements2 - (GAME_SPEED - 3);
        bg_elements3 = bg_elements3 - (GAME_SPEED - 4);
    }

    if (isMovingLeft && bg_elements < 0) {
        bg_elements = bg_elements + GAME_SPEED;
        bg_elements2 = bg_elements2 + (GAME_SPEED - 3);
        bg_elements3 = bg_elements3 + (GAME_SPEED - 4);
    }
    for (let i = 0; i < 10; i++) {

        addBackgroundObject(imagesBg[2], i * canvas.width, 75, 0.375, 1, bg_elements3);
        addBackgroundObject(imagesBg[3], (i + 1) * canvas.width, 75, 0.375, 1, bg_elements3);

    }
    for (let i = 0; i < 10; i++) {
        addBackgroundObject(imagesBg[0], i * canvas.width, 75, 0.375, 1, bg_elements2);
        addBackgroundObject(imagesBg[1], (i + 1) * canvas.width, 75, 0.375, 1, bg_elements2);
    }

    //draw Ground
    for (let i = 0; i < 10; i++) {
        addBackgroundObject(imagesBg[4], i * canvas.width, 75, 0.375, 1, bg_elements);
        addBackgroundObject(imagesBg[5], (i + 1) * canvas.width, 75, 0.375, 1, bg_elements);
    }
}


function addBackgroundObject(src, offsetY, offsetX, scale, opacity, bg_elements) {
    if (opacity != undefined) {
        ctx.globalAlpha = opacity;
    }

    let base_image;

    if (typeof src == "string") {
        base_image = new Image();
        base_image.src = src;
    } else {
        base_image = src;
    }

    if (base_image.complete) {
        ctx.drawImage(base_image, offsetY + bg_elements, offsetX, base_image.width * scale, base_image.height * scale);
    };
    ctx.globalAlpha = 1;
}

