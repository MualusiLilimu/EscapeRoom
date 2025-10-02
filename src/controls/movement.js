import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js';
const DIRECTIONS = ['w', 'a', 's', 'd'];
export class CharacterControls {
    

    walkDirection = new THREE.Vector3();
    rotateAngle = new THREE.Vector3(0, 1, 0);
    rotateQuaternion = new THREE.Quaternion();
    cameraTarget = new THREE.Vector3();

    fadeDuration = 0.2;
    walkSpeed = 2;
    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.orbitControl = orbitControl;
        this.camera = camera;

        this.currentAction = null;
        this.toggleRun = true;

        this.playAction(currentAction);  // <- force start idle immediately
    }

    playAction(name) {
        if (this.currentAction === name) return;

        // fade out the previous action
        if (this.currentAction) {
            const prev = this.animationsMap.get(this.currentAction);
            if (prev) prev.fadeOut(0.2);
        }

        // fade in the new action
        const action = this.animationsMap.get(name);
        if (action) {
            action.reset().fadeIn(0.2).play();
            this.currentAction = name;
        }
    }

    switchRunToggle() {
        this.toggleRun = !this.toggleRun;
    }

    update(delta, keysPressed) {
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true);
        var play = "";
        if(directionPressed){
            play = "walk";
        }
        else{
            play = "idle";
        }
        if(this.currentAction != play){
            const toplay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)
            current.fadeOut(this.fadeDuration)
            toplay.reset().fadeIn(this.fadeDuration).play()
            this.currentAction=play
        }

        
        this.mixer.update(delta);
        if(this.currentAction === 'walk') {
            var angleYCameraDirection = Math.atan2(
            (this.camera.position.z - this.model.position.z),
            (this.camera.position.x - this.model.position.x));
            var directionOffset = this.directionoffset(keysPressed);

            
            this.camera.getWorldDirection(this.walkDirection);
            this.walkDirection.y = 0;
            this.walkDirection.normalize();
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

            const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1), 
            this.walkDirection.clone().normalize());
            this.model.quaternion.rotateTowards(targetQuaternion, 0.2);


            const velocity = this.toggleRun ? this.walkSpeed : this.walkSpeed / 2;

            const moveX = this.walkDirection.x * velocity * delta;
            const moveZ = this.walkDirection.z * velocity * delta;
            this.model.position.x += moveX;
            this.model.position.z += moveZ;
            this.updateCameraTarget(moveX, moveZ);

    }
}
directionoffset(keysPressed) {
    var directionOffset = 0; 
    if (keysPressed['w']){
        if (keysPressed['a']) {
            directionOffset = Math.PI / 4; 
        }
        else if (keysPressed['d']) {
            directionOffset = -Math.PI / 4; 
        }
    }
    else if (keysPressed['s']) {
        if (keysPressed['a']) {
            directionOffset = Math.PI / 4 + Math.PI / 2; 
        }
        else if (keysPressed['d']) {
            directionOffset = -Math.PI / 4 - Math.PI / 2; 
        }
        else {
            directionOffset = Math.PI; 
        }
    }
    else if (keysPressed['a']) {
        directionOffset = Math.PI / 2; 
    }
    else if (keysPressed['d']) {
        directionOffset = -Math.PI / 2; 
    }
    return directionOffset;
}


updateCameraTarget(moveX, moveZ) {
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;
    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 1;
    this.cameraTarget.z = this.model.position.z;
    this.orbitControl.target = this.cameraTarget;
}
}
