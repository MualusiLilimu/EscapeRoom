import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js';

const DIRECTIONS = ['w', 'a', 's', 'd'];

export class CharacterControls {

    walkDirection = new THREE.Vector3();
    rotateAngle = new THREE.Vector3(0, 1, 0);
    rotateQuaternion = new THREE.Quaternion();
    cameraTarget = new THREE.Vector3();

    fadeDuration = 0.2;
    walkSpeed = 7;

    cameraModes = { THIRD_PERSON: 0, FIRST_PERSON: 1 };
    currentCameraMode = 0; // start in third-person

    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.orbitControl = orbitControl;
        this.camera = camera;

        this.currentAction = null;
        this.toggleRun = true;

        this.playAction(currentAction);  // start idle immediately
    }

    playAction(name) {
        if (this.currentAction === name) return;

        if (this.currentAction) {
            const prev = this.animationsMap.get(this.currentAction);
            if (prev) prev.fadeOut(this.fadeDuration);
        }

        const action = this.animationsMap.get(name);
        if (action) {
            action.reset().fadeIn(this.fadeDuration).play();
            this.currentAction = name;
        }
    }

    switchRunToggle() {
        this.toggleRun = !this.toggleRun;
    }

    toggleCameraMode() {
        this.currentCameraMode = (this.currentCameraMode === this.cameraModes.THIRD_PERSON)
                                 ? this.cameraModes.FIRST_PERSON
                                 : this.cameraModes.THIRD_PERSON;

        // Optional: hide model in first-person
        this.model.visible = this.currentCameraMode === this.cameraModes.THIRD_PERSON;
    }

    update(delta, keysPressed) {
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] === true);
        let play = directionPressed ? "walk" : "idle";

        if (this.currentAction !== play) {
            const toplay = this.animationsMap.get(play);
            const current = this.animationsMap.get(this.currentAction);
            if (current) current.fadeOut(this.fadeDuration);
            if (toplay) toplay.reset().fadeIn(this.fadeDuration).play();
            this.currentAction = play;
        }

        this.mixer.update(delta);

        if (this.currentAction === 'walk') {
            // rotation
            const directionOffset = this.directionoffset(keysPressed);

            this.camera.getWorldDirection(this.walkDirection);
            this.walkDirection.y = 0;
            this.walkDirection.normalize();
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

            const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, 1),
                this.walkDirection.clone().normalize()
            );
            this.model.quaternion.rotateTowards(targetQuaternion, 0.2);

            // movement
            const velocity = this.toggleRun ? this.walkSpeed : this.walkSpeed / 2;
            const moveX = this.walkDirection.x * velocity * delta;
            const moveZ = this.walkDirection.z * velocity * delta;
            this.model.position.x += moveX;
            this.model.position.z += moveZ;
        }

        this.updateCameraTarget();
    }

    directionoffset(keysPressed) {
        let directionOffset = 0;
        if (keysPressed['w']) {
            if (keysPressed['a']) directionOffset = Math.PI / 4;
            else if (keysPressed['d']) directionOffset = -Math.PI / 4;
        } else if (keysPressed['s']) {
            if (keysPressed['a']) directionOffset = Math.PI / 4 + Math.PI / 2;
            else if (keysPressed['d']) directionOffset = -Math.PI / 4 - Math.PI / 2;
            else directionOffset = Math.PI;
        } else if (keysPressed['a']) directionOffset = Math.PI / 2;
        else if (keysPressed['d']) directionOffset = -Math.PI / 2;
        return directionOffset;
    }

    updateCameraTarget() {
        const smoothSpeed = 0.1;

        if (this.currentCameraMode === this.cameraModes.THIRD_PERSON) {
            const behindDistance = 5;
            const upDistance = 8;

            const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.model.quaternion).normalize();
            const desiredPosition = new THREE.Vector3()
                .copy(this.model.position)
                .addScaledVector(forward, -behindDistance)
                .add(new THREE.Vector3(0, upDistance, 0));

            this.camera.position.lerp(desiredPosition, smoothSpeed);

            const desiredTarget = new THREE.Vector3().copy(this.model.position);
            desiredTarget.y = this.model.position.y + 5;
            this.cameraTarget.lerp(desiredTarget, smoothSpeed);

            this.camera.lookAt(this.cameraTarget);
            this.orbitControl.target.copy(this.cameraTarget);

        } else if (this.currentCameraMode === this.cameraModes.FIRST_PERSON) {
            const headHeight = 7.5; // adjust to model height
            const cameraPosition = new THREE.Vector3().copy(this.model.position);
            cameraPosition.y += headHeight;

            const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.model.quaternion).normalize();
            const cameraTarget = new THREE.Vector3().copy(cameraPosition).add(forward);

            this.camera.position.lerp(cameraPosition, 0.05);
            this.camera.lookAt(cameraTarget);

            this.orbitControl.target.copy(cameraPosition);
        }
    }
}
