let canvas;
let ctx;
let character_x = 0;
let isMovingRight = false;
let isMovingLeft = false;

function init() {
    
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
setInterval(function() {
     updateCharacter();
    drawBackground();
}, 50);
   
    listenForKeys();
}

function updateCharacter() {
 let base_image = new Image();
  base_image.src = 'img/charakter_1.png';
  base_image.onload = function(){
    ctx.drawImage(base_image, character_x, 250, base_image.width * 0.35, base_image.height * 0.35);
  }
}

function drawBackground() {
   ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGround();
}

function drawGround(){
    ctx.fillStyle = "#FFE699";
    ctx.fillRect(0, 375, canvas.width, canvas.height - 375);

    let base_image = new Image();
  base_image.src = 'img/bg_elem_1.png';
  base_image.onload = function(){
    ctx.drawImage(base_image, character_x, 190, base_image.width * 0.6, base_image.height * 0.6
    );
  }
}

function listenForKeys() {
    document.addEventListener("keydown", e => {
        const k = e.key;
        if (k == 'ArrowRight'){
            isMovingRight = true;
character_x = character_x + 5;
        }
        if (k == 'ArrowLeft'){
            isMovingLeft = true;
            character_x = character_x - 5;
                    }
    });
    document.addEventListener("keyup", e => {
        const k = e.key;
        if (k == 'ArrowRight'){
            isMovingRight = fasle;
character_x = character_x + 5;
        }
        if (k == 'ArrowLeft'){
            isMovingLeft = false;
            character_x = character_x - 5;
                    }
    });
}


