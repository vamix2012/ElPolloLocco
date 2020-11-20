let canvas;
let ctx;
let character_x = 200;
let isMovingRight = false;
let isMovingLeft = false;
let bg_elements = 0;
let lastJumpStarted = 0;
let character_y = 250;
let currentCharacterImage = 'img/charakter_1.png';
let characterGraphicsRight = ['img/charakter_1.png', 'img/charakter_2.png', 'img/charakter_3.png', 'img/charakter_4.png'];
let characterGraphicsLeft = ['img/charakter_left_1.png', 'img/charakter_left_2.png', 'img/charakter_left_3.png', 'img/charakter_left_4.png'];
let characterGraphicsIndex = 0;
let cloudOffset = 0;

// ******************* Game config ****************** \\
let JUMP_TIME = 250; //in ms 
let GAME_SPEED = 5;
function init() {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    checkForRunning();
    draw();
    calculateCloudOffset();
    listenForKeys();
}

function calculateCloudOffset() {
    setInterval(function () {
        cloudOffset = cloudOffset + 0.25;
    }, 50);
}

function checkForRunning() {
    setInterval(function () {
        if (isMovingRight) {
            let index = characterGraphicsIndex % characterGraphicsRight.length;
            currentCharacterImage = characterGraphicsRight[index];
            characterGraphicsIndex++;
        }

        if (isMovingLeft) {
            let index = characterGraphicsIndex % characterGraphicsLeft.length;
            currentCharacterImage = characterGraphicsLeft[index];
            characterGraphicsIndex++;

        }
    }, 100);

}

function draw() {

    drawBackground();
    updateCharacter();
    drawChicken();
    requestAnimationFrame(draw);


}

function drawChicken() {
    let chickens = [
        createChicken(1, 200),
        createChicken(1, 400),
        createChicken(2, 600),
        createChicken(1, 700),
        createChicken(2, 800),
        createChicken(1, 900),
        createChicken(1, 1000),
        createChicken(2, 11000)
    ];
  
        for (i = 0; i < chickens.length; i = i + 1) {
            let chicken = chickens[i];
            addBackgroundObject(chicken.img, chicken.position_x, chicken.position_y, chicken.scale, 1);
        }
       
}

function createChicken(type, position_x) {
    return {
        "img": "img/chicken" + type + ".png",
        "position_x": position_x,
        "position_y": 325,
        "scale": 0.6
    };
}

function updateCharacter() {
    let base_image = new Image();
    base_image.src = currentCharacterImage;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 10;
    } else {
        if (character_y < 250) {
            character_y = character_y + 10;
        }
    }
    if (base_image.complete) {
        ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.35, base_image.height * 0.35);
    }
}



function drawBackground() {


    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGround();
    // Draw clouds
    addBackgroundObject('img/cloud1.png', 100 - cloudOffset, 20, 0.8, 1);
    addBackgroundObject('img/cloud2.png', 500 - cloudOffset, 20, 0.6, 1);
    addBackgroundObject('img/cloud1.png', 800 - cloudOffset, 20, 1, 1);
    addBackgroundObject('img/cloud2.png', 1300 - cloudOffset, 20, 0.6, 1);
    addBackgroundObject('img/cloud1.png', 1800 - cloudOffset, 20, 1, 1);
    addBackgroundObject('img/cloud2.png', 2300 - cloudOffset, 20, 0.6, 1);
    addBackgroundObject('img/cloud1.png', 2800 - cloudOffset, 20, 1, 1);
    addBackgroundObject('img/cloud2.png', 3500 - cloudOffset, 20, 0.6, 1);

}

function drawGround() {

    if (isMovingRight) {
        bg_elements = bg_elements - GAME_SPEED;
    }
    if (isMovingLeft) {
        bg_elements = bg_elements + GAME_SPEED;
    }
    addBackgroundObject('img/bg_elem_1.png', 0, 195, 0.6, 0.4);
    addBackgroundObject('img/bg_elem_2.png', 450, 120, 0.6, 0.5);
    addBackgroundObject('img/bg_elem_1.png', 700, 255, 0.4, 0.6);
    addBackgroundObject('img/bg_elem_2.png', 1100, 260, 0.3, 0.2);

    addBackgroundObject('img/bg_elem_1.png', 1300, 195, 0.6, 0.4);
    addBackgroundObject('img/bg_elem_2.png', 1450, 120, 0.6, 0.5);
    addBackgroundObject('img/bg_elem_1.png', 1700, 255, 0.4, 0.6);
    addBackgroundObject('img/bg_elem_2.png', 2000, 260, 0.3, 0.2);

    addBackgroundObject('img/bg_elem_1.png', 2300, 195, 0.6, 0.4);
    addBackgroundObject('img/bg_elem_2.png', 2450, 120, 0.6, 0.5);
    addBackgroundObject('img/bg_elem_1.png', 2700, 255, 0.4, 0.6);
    addBackgroundObject('img/bg_elem_2.png', 3000, 260, 0.3, 0.2);


    addBackgroundObject('img/bg_elem_1.png', 4300, 195, 0.6, 0.4);
    addBackgroundObject('img/bg_elem_2.png', 4450, 120, 0.6, 0.5);
    addBackgroundObject('img/bg_elem_1.png', 4700, 255, 0.4, 0.6);
    addBackgroundObject('img/bg_elem_2.png', 5000, 260, 0.3, 0.2);


    //draw Ground
    ctx.fillStyle = "#FFE699";
    ctx.fillRect(0, 375, canvas.width, canvas.height - 375);

    for (let i = 0; i < 10; i++) {
        addBackgroundObject('img/sand.png', i * canvas.width, 375, 0.36, 1);
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
            //character_x = character_x + 5;
        }
        if (k == 'ArrowLeft') {
            isMovingLeft = true;
            // character_x = character_x - 5;
        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (k == ' ' && timePassedSinceJump > JUMP_TIME * 2) {
            lastJumpStarted = new Date().getTime();
        }
    });
    document.addEventListener("keyup", e => {
        const k = e.key;
        if (k == 'ArrowRight') {
            isMovingRight = false;
            //character_x = character_x + 5;
        }
        if (k == 'ArrowLeft') {
            isMovingLeft = false;
            // character_x = character_x - 5;
        }
        /*if (k == ' '){
         isJumping = false;

        }*/
    });
}
