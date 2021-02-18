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

        if (k == 'd' && !game_finished && colectedBottles != 0) {
            let timePassed = new Date().getTime() - bottleThrowTime;
            if (timePassed > 1000) {
                AUDIO_THROW.play();
                colectedBottles--;
                bottleThrowTime = new Date().getTime();
            }

        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (k == ' ' && timePassedSinceJump > JUMP_TIME * 2 && !game_finished) {
            isJumping = true;
            AUDIO_JUMP.play();
            lastJumpStarted = new Date().getTime();
            setTimeout(function () {
                isJumping = false;
            }, 600);
        }
        if (k == "m") {
            if (!AUDIO_BGM.paused && !game_finished) AUDIO_BGM.pause();
            else if (AUDIO_BGM.paused && !game_finished) AUDIO_BGM.play();
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

    // touch controls
    document.getElementById("leftPad").addEventListener("touchstart", function (e) {
        isMovingLeft = true;
        isLookingRight = false;
        isLookingLeft = true;
        log("touchstart");
    });
    document.getElementById("leftPad").addEventListener("touchend", function (e) {
        isMovingLeft = false;
        log("touchend");
    });

    document.getElementById("rightPad").addEventListener("touchstart", function (e) {
        isMovingRight = true;
        isLookingRight = true;
        isLookingLeft = false;
        log("touchstart");
    });
    document.getElementById("rightPad").addEventListener("touchend", function (e) {
        isMovingRight = false;
        log("touchend");
    });

    document.getElementById("jumpPad").addEventListener("touchstart", function (e) {
        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (timePassedSinceJump > JUMP_TIME * 2 && !game_finished) {
            isJumping = true;
            AUDIO_JUMP.play();
            lastJumpStarted = new Date().getTime();
            setTimeout(function () {
                isJumping = false;
            }, 600);
        }
        log("touchstart");
    });

    document.getElementById("bottleTrow").addEventListener("touchstart", function (e) {
        if (!game_finished) {
            let timePassed = new Date().getTime() - bottleThrowTime;
            if (timePassed > 1000 && colectedBottles != 0) {
                AUDIO_THROW.play();
                colectedBottles--;
                bottleThrowTime = new Date().getTime();
            }
        }
        log("touchstart");
    });
}




