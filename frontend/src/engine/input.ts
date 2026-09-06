export class InputManager {
  private keys: Record<string, boolean> = {};
  private justPressed: Record<string, boolean> = {};
  private attached: boolean = false;

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
    this.attached = false;
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

    // Normalize diagonal movement speed
    if (dx !== 0 && dy !== 0) {
      const invSqrt = 1 / Math.SQRT2;
      dx *= invSqrt;
      dy *= invSqrt;
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
