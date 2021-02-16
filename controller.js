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

        if (k == 'd' && !game_finished) {
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
