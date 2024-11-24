import * as THREE from 'three';

export class Animations {
  private states: string[] = ["Idle", "Walking", "Running", "Dance", "Death", "Sitting", "Standing"];
  private emotes: string[] = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];
  private mixer: THREE.AnimationMixer;
  private actions: { [key: string]: THREE.AnimationAction } = {};
  private activeName: string = "Idle";
  private actionInProgress: boolean = false;

  constructor(object: THREE.Object3D, animations: THREE.AnimationClip[]) {
    this.mixer = new THREE.AnimationMixer(object);

    animations.forEach((clip) => {
      const action = this.mixer.clipAction(clip);
      this.actions[clip.name] = action;

      if (this.states.indexOf(clip.name) >= 4 || this.emotes.indexOf(clip.name) >= 0) {
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
      }
    });

    // Play the default action
    if (this.actions[this.activeName]) {
      this.actions[this.activeName].play();
    }
  }

  fadeToAction(name: string, duration: number): void {
    if (this.activeName !== name && !this.actionInProgress) {
      const previousName = this.activeName;
      this.activeName = name;

      if (this.actions[previousName]) {
        this.actions[previousName].fadeOut(duration);
      }

      if (this.actions[this.activeName]) {
        this.actions[this.activeName]
          .reset()
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(1)
          .fadeIn(duration)
          .play();
      }

      // Some actions must not be interrupted
      if (!["Idle", "Walking", "Running"].includes(this.activeName)) {
        this.mixer.addEventListener("finished", this.actionFinished.bind(this));
        this.actionInProgress = true;
      }
    }
  }

  private actionFinished(): void {
    if (this.actionInProgress) {
      this.actionInProgress = false;
      this.mixer.removeEventListener("finished", this.actionFinished.bind(this));
    }
  }

  update(deltaT: number): void {
    if (this.mixer) {
      this.mixer.update(deltaT);
    }
  }
}