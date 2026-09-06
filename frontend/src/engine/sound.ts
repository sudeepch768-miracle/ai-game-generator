// Web Audio API Retro Sound & Background Music Synthesizer
// Completely self-contained, no external asset files or network requests needed.

export interface ThemeTrack {
  bpm: number;
  bassWave: OscillatorType;
  leadWave: OscillatorType;
  filterFreq: number;
  bassNotes: number[]; // 16 steps (-1 = rest, frequencies in Hz)
  leadNotes: number[]; // 16 steps (-1 = rest, frequencies in Hz)
  beatClick?: boolean;
}

export const THEME_BGM: Record<string, ThemeTrack> = {
  hospital: {
    bpm: 94,
    bassWave: 'sine',
    leadWave: 'triangle',
    filterFreq: 850,
    // Gentle heartbeat-like pulse, soothing ambient clinic
    bassNotes: [73.42, -1, 73.42, -1, 87.31, -1, 73.42, -1, 65.41, -1, 73.42, -1, 98.00, -1, 87.31, -1],
    leadNotes: [293.66, -1, 349.23, -1, 440.00, -1, 523.25, -1, 587.33, 523.25, 440.00, -1, 392.00, -1, 349.23, -1],
    beatClick: true,
  },
  railway: {
    bpm: 124,
    bassWave: 'triangle',
    leadWave: 'square',
    filterFreq: 1400,
    // Driving train engine rhythm
    bassNotes: [110.00, 110.00, 130.81, 110.00, 164.81, 110.00, 146.83, 110.00, 110.00, 110.00, 130.81, 110.00, 196.00, 164.81, 146.83, 130.81],
    leadNotes: [440.00, -1, 523.25, -1, 659.25, 587.33, 523.25, -1, 440.00, -1, 523.25, -1, 783.99, -1, 659.25, -1],
    beatClick: true,
  },
  bank: {
    bpm: 108,
    bassWave: 'sawtooth',
    leadWave: 'sine',
    filterFreq: 750,
    // Tense stealth heist ticking
    bassNotes: [82.41, -1, 82.41, -1, 98.00, -1, 82.41, -1, 82.41, -1, 116.54, -1, 110.00, -1, 98.00, -1],
    leadNotes: [329.63, -1, -1, 392.00, -1, -1, 493.88, -1, 466.16, -1, -1, 392.00, -1, 329.63, -1, -1],
    beatClick: true,
  },
  police: {
    bpm: 128,
    bassWave: 'sawtooth',
    leadWave: 'triangle',
    filterFreq: 1600,
    // Pulsing action pursuit groove
    bassNotes: [98.00, 98.00, 116.54, 98.00, 130.81, 98.00, 87.31, 98.00, 98.00, 98.00, 116.54, 98.00, 146.83, 130.81, 116.54, 110.00],
    leadNotes: [392.00, -1, 466.16, -1, 523.25, -1, 587.33, 523.25, 466.16, -1, 392.00, -1, 587.33, -1, 523.25, -1],
    beatClick: true,
  },
  snow: {
    bpm: 92,
    bassWave: 'sine',
    leadWave: 'sine',
    filterFreq: 2200,
    // Ethereal sparkling icy glaciers
    bassNotes: [123.47, -1, -1, -1, 98.00, -1, -1, -1, 146.83, -1, -1, -1, 110.00, -1, -1, -1],
    leadNotes: [493.88, 587.33, 739.99, 880.00, 987.77, 880.00, 739.99, 587.33, 493.88, 587.33, 739.99, 987.77, 1174.66, 987.77, 880.00, 739.99],
    beatClick: false,
  },
  haunted: {
    bpm: 84,
    bassWave: 'sawtooth',
    leadWave: 'sine',
    filterFreq: 650,
    // Creepy chromatic crypt
    bassNotes: [73.42, -1, 77.78, -1, 73.42, -1, 69.30, -1, 73.42, -1, 77.78, -1, 87.31, -1, 82.41, -1],
    leadNotes: [293.66, -1, 311.13, -1, 415.30, -1, 440.00, -1, 587.33, -1, 554.37, -1, 466.16, -1, 440.00, -1],
    beatClick: false,
  },
  cyberpunk: {
    bpm: 122,
    bassWave: 'sawtooth',
    leadWave: 'square',
    filterFreq: 1800,
    // Darksynth rolling arpeggiator
    bassNotes: [92.50, 92.50, 92.50, 92.50, 110.00, 110.00, 123.47, 123.47, 138.59, 138.59, 123.47, 123.47, 110.00, 110.00, 92.50, 92.50],
    leadNotes: [369.99, 440.00, 554.37, 659.25, 739.99, 659.25, 554.37, 440.00, 369.99, 440.00, 554.37, 739.99, 880.00, 739.99, 659.25, 554.37],
    beatClick: true,
  },
  kitchen: {
    bpm: 118,
    bassWave: 'triangle',
    leadWave: 'triangle',
    filterFreq: 1500,
    // Upbeat culinary bounce
    bassNotes: [130.81, -1, 98.00, -1, 110.00, -1, 87.31, -1, 130.81, -1, 98.00, -1, 146.83, -1, 130.81, -1],
    leadNotes: [523.25, -1, 659.25, -1, 783.99, 880.00, 783.99, -1, 659.25, -1, 587.33, -1, 523.25, -1, -1, -1],
    beatClick: true,
  },
  airport: {
    bpm: 116,
    bassWave: 'triangle',
    leadWave: 'sine',
    filterFreq: 1400,
    // Smooth jetway glide
    bassNotes: [110.00, -1, 110.00, -1, 164.81, -1, 146.83, -1, 110.00, -1, 110.00, -1, 196.00, -1, 164.81, -1],
    leadNotes: [440.00, 554.37, 659.25, 739.99, 659.25, 554.37, 493.88, 440.00, 554.37, 659.25, 739.99, 880.00, 739.99, 659.25, 554.37, 440.00],
    beatClick: true,
  },
  volcano: {
    bpm: 102,
    bassWave: 'sawtooth',
    leadWave: 'sawtooth',
    filterFreq: 550,
    // Heavy magma pulse
    bassNotes: [65.41, 65.41, -1, 65.41, 77.78, -1, 65.41, -1, 65.41, 65.41, -1, 65.41, 87.31, -1, 77.78, -1],
    leadNotes: [130.81, -1, 155.56, -1, 196.00, -1, 185.00, -1, 196.00, -1, 233.08, -1, 196.00, -1, 155.56, -1],
    beatClick: true,
  },
  desert: {
    bpm: 98,
    bassWave: 'triangle',
    leadWave: 'triangle',
    filterFreq: 1200,
    // Arabian / Egyptian dune scales
    bassNotes: [73.42, -1, 73.42, -1, 77.78, -1, 73.42, -1, 73.42, -1, 98.00, -1, 87.31, -1, 77.78, -1],
    leadNotes: [293.66, 311.13, 369.99, 392.00, 440.00, 466.16, 554.37, 587.33, 554.37, 466.16, 440.00, 392.00, 369.99, 311.13, 293.66, -1],
    beatClick: true,
  },
  ocean: {
    bpm: 86,
    bassWave: 'sine',
    leadWave: 'sine',
    filterFreq: 500,
    // Abyssal deep sea undulation
    bassNotes: [65.41, -1, -1, -1, 87.31, -1, -1, -1, 98.00, -1, -1, -1, 77.78, -1, -1, -1],
    leadNotes: [261.63, 392.00, 523.25, 622.25, 783.99, 622.25, 523.25, 392.00, 261.63, 392.00, 523.25, 783.99, 622.25, 523.25, 392.00, 261.63],
    beatClick: false,
  },
  space: {
    bpm: 78,
    bassWave: 'sine',
    leadWave: 'sine',
    filterFreq: 1400,
    // Cosmic dark ambient
    bassNotes: [55.00, -1, -1, -1, 82.41, -1, -1, -1, 87.31, -1, -1, -1, 73.42, -1, -1, -1],
    leadNotes: [440.00, -1, 523.25, -1, 659.25, -1, 987.77, -1, 880.00, -1, 783.99, -1, 659.25, -1, 523.25, -1],
    beatClick: false,
  },
  nature: {
    bpm: 104,
    bassWave: 'triangle',
    leadWave: 'sine',
    filterFreq: 1300,
    bassNotes: [98.00, -1, 98.00, -1, 130.81, -1, 110.00, -1, 98.00, -1, 98.00, -1, 146.83, -1, 130.81, -1],
    leadNotes: [392.00, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00, 392.00, 440.00, 523.25, 659.25, 783.99, 659.25, 523.25, 440.00],
    beatClick: true,
  },
  office: {
    bpm: 110,
    bassWave: 'triangle',
    leadWave: 'square',
    filterFreq: 1100,
    bassNotes: [110.00, -1, 110.00, -1, 146.83, -1, 130.81, -1, 110.00, -1, 110.00, -1, 164.81, -1, 146.83, -1],
    leadNotes: [440.00, -1, 523.25, -1, 587.33, 523.25, 440.00, -1, 440.00, -1, 659.25, -1, 587.33, -1, 523.25, -1],
    beatClick: true,
  },
  classroom: {
    bpm: 112,
    bassWave: 'triangle',
    leadWave: 'sine',
    filterFreq: 1200,
    bassNotes: [130.81, -1, 130.81, -1, 164.81, -1, 146.83, -1, 130.81, -1, 130.81, -1, 196.00, -1, 164.81, -1],
    leadNotes: [523.25, -1, 659.25, -1, 783.99, -1, 880.00, -1, 783.99, -1, 659.25, -1, 587.33, -1, 523.25, -1],
    beatClick: true,
  },
  dungeon: {
    bpm: 88,
    bassWave: 'sawtooth',
    leadWave: 'triangle',
    filterFreq: 600,
    bassNotes: [82.41, -1, 82.41, -1, 98.00, -1, 82.41, -1, 73.42, -1, 82.41, -1, 110.00, -1, 98.00, -1],
    leadNotes: [329.63, -1, 392.00, -1, 440.00, -1, 493.88, -1, 587.33, -1, 493.88, -1, 440.00, -1, 392.00, -1],
    beatClick: false,
  },
  default: {
    bpm: 112,
    bassWave: 'triangle',
    leadWave: 'sine',
    filterFreq: 1100,
    bassNotes: [130.81, -1, 130.81, -1, 164.81, -1, 146.83, -1, 130.81, -1, 130.81, -1, 196.00, -1, 164.81, -1],
    leadNotes: [523.25, -1, 659.25, -1, 783.99, -1, 880.00, -1, 783.99, -1, 659.25, -1, 587.33, -1, 523.25, -1],
    beatClick: true,
  }
};

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public bgmEnabled: boolean = true;
  public bgmVolume: number = 0.15;

  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmIntervalId: any = null;
  private currentBgmTheme: string = '';
  private isBgmPlaying: boolean = false;
  private nextNoteTime: number = 0;
  private currentStep: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx) {
      if (!this.sfxGain) {
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);
      }
      if (!this.bgmGain) {
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);
      }
    }
  }

  // -------------------------------------------------------------
  // BACKGROUND MUSIC (BGM) SYNTHESIZER
  // -------------------------------------------------------------

  startBGM(themeName?: string) {
    if (!this.enabled || !this.bgmEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.bgmGain) return;

    const normalizedTheme = (themeName || 'default').toLowerCase();
    const track = THEME_BGM[normalizedTheme] || THEME_BGM.default;

    // If already playing the same track, ensure volume is restored and return
    if (this.isBgmPlaying && this.currentBgmTheme === normalizedTheme) {
      this.resumeBGM();
      return;
    }

    this.stopBGM(0.1);

    this.currentBgmTheme = normalizedTheme;
    this.isBgmPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    // Smooth fade in
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(0.001, now);
    this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, now + 0.35);

    const stepDur = 60 / track.bpm / 4; // 16th note step duration

    // Lookahead scheduler runs every 40ms
    this.bgmIntervalId = setInterval(() => {
      if (!this.ctx || !this.isBgmPlaying || !this.enabled || !this.bgmEnabled) return;

      const scheduleAheadTime = 0.15; // Schedule up to 150ms into the future
      while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
        this.scheduleBgmStep(track, this.currentStep, this.nextNoteTime, stepDur);
        this.nextNoteTime += stepDur;
        this.currentStep = (this.currentStep + 1) % 16;
      }
    }, 40);
  }

  private scheduleBgmStep(track: ThemeTrack, step: number, time: number, stepDur: number) {
    if (!this.ctx || !this.bgmGain) return;

    // 1. Bassline
    const bassFreq = track.bassNotes[step];
    if (bassFreq && bassFreq > 0) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = track.bassWave;
        osc.frequency.setValueAtTime(bassFreq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(track.filterFreq, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.18, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, time + stepDur * 0.95);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(time);
        osc.stop(time + stepDur);
      } catch (e) {
        // Silently skip if audio node error
      }
    }

    // 2. Melody / Lead Arpeggio
    const leadFreq = track.leadNotes[step];
    if (leadFreq && leadFreq > 0) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = track.leadWave;
        osc.frequency.setValueAtTime(leadFreq, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, time + stepDur * 1.5);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(time);
        osc.stop(time + stepDur * 1.6);
      } catch (e) {
        // Silently skip
      }
    }

    // 3. Subtle Rhythmic Percussion Tick (gentle retro 808 hi-hat / rim)
    if (track.beatClick && (step % 2 === 0)) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const isBackbeat = (step === 4 || step === 12);
        osc.frequency.setValueAtTime(isBackbeat ? 380 : 220, time);

        gain.gain.setValueAtTime(isBackbeat ? 0.035 : 0.015, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(time);
        osc.stop(time + 0.03);
      } catch (e) {
        // Silently skip
      }
    }
  }

  stopBGM(fadeDuration: number = 0.3) {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;

    if (this.ctx && this.bgmGain) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
      this.bgmGain.gain.linearRampToValueAtTime(0.001, now + fadeDuration);
    }
  }

  pauseBGM() {
    if (this.ctx && this.bgmGain) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.linearRampToValueAtTime(0.001, now + 0.15);
    }
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  resumeBGM() {
    if (!this.enabled || !this.bgmEnabled) return;
    if (!this.currentBgmTheme) {
      this.startBGM('default');
      return;
    }
    this.startBGM(this.currentBgmTheme);
  }

  duckBGM(ratio: number = 0.35, duration: number = 0.45) {
    if (!this.ctx || !this.bgmGain || !this.isBgmPlaying) return;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume * ratio, now + 0.04);
    this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, now + duration);
  }

  setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.bgmGain && this.isBgmPlaying) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, now + 0.05);
    }
  }

  // -------------------------------------------------------------
  // SOUND EFFECTS (SFX)
  // -------------------------------------------------------------

  playStep() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playCollect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.045;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.15);
    });
  }

  playKey() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  }

  playDialogue() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(320 + Math.random() * 80, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  playBump() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playWin() {
    if (!this.enabled) return;
    this.stopBGM(0.15);
    this.initCtx();
    if (!this.ctx) return;

    const melody = [
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.28 },
      { f: 587.33, d: 0.14 },
      { f: 659.25, d: 0.14 },
      { f: 783.99, d: 0.45 },
      { f: 1046.5, d: 0.70 },
    ];

    let t = this.ctx.currentTime;
    melody.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d);

      t += note.d + 0.02;
    });
  }

  playLose() {
    if (!this.enabled) return;
    this.stopBGM(0.15);
    this.initCtx();
    if (!this.ctx) return;

    const melody = [
      { f: 392.00, d: 0.25 },
      { f: 369.99, d: 0.25 },
      { f: 349.23, d: 0.25 },
      { f: 329.63, d: 0.60 },
    ];

    let t = this.ctx.currentTime;
    melody.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d);

      t += note.d + 0.04;
    });
  }

  playDash() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  playAlert() {
    if (!this.enabled) return;
    this.duckBGM(0.3, 0.4);
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.setValueAtTime(950, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  playHack() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [330, 440, 550, 660, 880];
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.05;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.08, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.09);
    });
  }

  playStun() {
    if (!this.enabled) return;
    this.duckBGM(0.3, 0.5);
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.29);
  }

  playSneakTakedown() {
    if (!this.enabled) return;
    this.duckBGM(0.3, 0.4);
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  playPurchase() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [659.25, 880, 1174.66];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.19);
    });
  }
}

export const sound = new SoundManager();
