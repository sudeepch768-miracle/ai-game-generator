export class InputManager {
  private keys: Record<string, boolean> = {};
  private justPressed: Record<string, boolean> = {};
  private attached: boolean = false;
  private virtualDx: number = 0;
  private virtualDy: number = 0;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  attach() {
    if (this.attached) return;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    this.attached = true;
  }

  detach() {
    if (!this.attached) return;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    this.keys = {};
    this.justPressed = {};
    this.virtualDx = 0;
    this.virtualDy = 0;
    this.attached = false;
  }

  /** Set virtual joystick movement from mobile touch controls */
  setVirtualMovement(dx: number, dy: number) {
    this.virtualDx = dx;
    this.virtualDy = dy;
  }

  /** Trigger virtual button action from mobile UI */
  triggerVirtualAction(action: 'dash' | 'interact' | 'stun' | 'stealth') {
    if (action === 'dash') {
      this.justPressed['space'] = true;
    } else if (action === 'interact') {
      this.justPressed['keye'] = true;
    } else if (action === 'stun') {
      this.justPressed['keyf'] = true;
    } else if (action === 'stealth') {
      this.justPressed['keyc'] = true;
      this.keys['keyc'] = !this.keys['keyc'];
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    // Prevent scrolling with arrows or space in game
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    const key = e.code.toLowerCase();
    if (!this.keys[key]) {
      this.justPressed[key] = true;
    }
    this.keys[key] = true;
  }

  private handleKeyUp(e: KeyboardEvent) {
    const key = e.code.toLowerCase();
    this.keys[key] = false;
    this.justPressed[key] = false;
  }

  private handleBlur() {
    this.keys = {};
    this.justPressed = {};
  }

  getMovementVector(): { dx: number; dy: number; facing: 'up' | 'down' | 'left' | 'right' | null } {
    let dx = 0;
    let dy = 0;

    const up = this.keys['arrowup'] || this.keys['keyw'];
    const down = this.keys['arrowdown'] || this.keys['keys'];
    const left = this.keys['arrowleft'] || this.keys['keya'];
    const right = this.keys['arrowright'] || this.keys['keyd'];

    if (up) dy -= 1;
    if (down) dy += 1;
    if (left) dx -= 1;
    if (right) dx += 1;

    let facing: 'up' | 'down' | 'left' | 'right' | null = null;
    if (down) facing = 'down';
    else if (up) facing = 'up';
    else if (left) facing = 'left';
    else if (right) facing = 'right';

    // Normalize diagonal movement speed for keys
    if (dx !== 0 && dy !== 0) {
      const invSqrt = 1 / Math.SQRT2;
      dx *= invSqrt;
      dy *= invSqrt;
    }

    // Merge virtual joystick if keyboard is idle
    if (dx === 0 && dy === 0 && (this.virtualDx !== 0 || this.virtualDy !== 0)) {
      dx = this.virtualDx;
      dy = this.virtualDy;
      if (Math.abs(dx) > Math.abs(dy)) {
        facing = dx > 0 ? 'right' : 'left';
      } else if (Math.abs(dy) > 0.05) {
        facing = dy > 0 ? 'down' : 'up';
      }
    }

    return { dx, dy, facing };
  }

  isDashJustPressed(): boolean {
    const pressed = this.justPressed['space'] || this.justPressed['shiftleft'] || this.justPressed['shiftright'];
    if (this.justPressed['space']) this.justPressed['space'] = false;
    if (this.justPressed['shiftleft']) this.justPressed['shiftleft'] = false;
    if (this.justPressed['shiftright']) this.justPressed['shiftright'] = false;
    return !!pressed;
  }

  isInteractJustPressed(): boolean {
    const pressed = this.justPressed['keye'] || this.justPressed['enter'];
    if (this.justPressed['keye']) this.justPressed['keye'] = false;
    if (this.justPressed['enter']) this.justPressed['enter'] = false;
    return !!pressed;
  }

  isStunJustPressed(): boolean {
    const pressed = this.justPressed['keyf'] || this.justPressed['keyq'] || this.justPressed['keyj'];
    if (this.justPressed['keyf']) this.justPressed['keyf'] = false;
    if (this.justPressed['keyq']) this.justPressed['keyq'] = false;
    if (this.justPressed['keyj']) this.justPressed['keyj'] = false;
    return !!pressed;
  }

  isStealthHeld(): boolean {
    return !!(this.keys['keyc'] || this.keys['controlleft'] || this.keys['controlright']);
  }

  isStealthJustToggled(): boolean {
    const pressed = this.justPressed['keyc'];
    if (this.justPressed['keyc']) this.justPressed['keyc'] = false;
    return !!pressed;
  }

  isKey(keyName: string): boolean {
    return !!this.keys[keyName.toLowerCase()];
  }
}
