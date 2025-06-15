import {
  Component,
  HostListener,
  Renderer2,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Setlist, Song } from './home.component';
import { setPostSignalSetFn } from '@angular/core/primitives/signals';
@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent {
  private route = inject(ActivatedRoute);
  set: Setlist = {
    name: '',
    songs: [],
  };
  // Current song index in the set
  currentIndex = 0;
  isFlashing = false;
  flashInterval: any;
  autoNextTimeout: any;
  flashTimeout: any;
  setName: string = '';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.setName = decodeURIComponent(params['name']);
      const rawSets = localStorage.getItem('drummer-cue-sets');
      if (rawSets) {
        const sets = JSON.parse(rawSets);
        this.set = sets.find((set: Setlist) => set.name === this.setName);
      }
      this.startFlashing();
    });
  }

  ngOnDestroy() {
    this.stopFlashing();
  }

  startFlashing() {
    if (this.set) {
      this.setFlashInterval(this.set.songs[this.currentIndex]);
    }
  }

  stopFlashing() {
    this.isFlashing = false;
    this.updateTransitionStyles(0);
    clearInterval(this.flashInterval);
    clearTimeout(this.autoNextTimeout);
    clearTimeout(this.flashTimeout);
  }

  setFlashInterval(song: Song) {
    this.isFlashing = true;
    const bpm = song?.bpm;
    const interval = 60000 / bpm;
    const flashDuration = interval * 0.2; // 20% of interval for flash fade-out
    const idleDuration = interval - flashDuration;

    this.updateTransitionStyles(flashDuration);

    this.flashInterval = setInterval(() => {
      this.isFlashing = true;
      this.flashTimeout = setTimeout(
        () => (this.isFlashing = false),
        flashDuration
      );
    }, interval);

    if (song.duration && song.duration > 0) {
      this.autoNextTimeout = setTimeout(() => {
        this.nextSong();
      }, song.duration * 1000);
    }
  }

  updateTransitionStyles(durationMs: number) {
    const root = this.el.nativeElement.querySelector('.fullscreen');
    const flashStyle = `background-color var(--flash-fade-in, 0.05s) ease-out`;
    const fadeStyle = `background-color ${durationMs}ms ease-in`;

    if (root) {
      this.renderer.setStyle(
        root,
        'transition',
        this.isFlashing ? flashStyle : fadeStyle
      );
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const width = window.innerWidth;
    const x = event.clientX;
    if (x < width / 3) {
      this.prevSong();
    } else if (x > (2 * width) / 3) {
      this.nextSong();
    } else {
      this.backToConfig();
    }
  }

  nextSong() {
    if (this.set && this.currentIndex < this.set.songs.length - 1) {
      this.currentIndex++;
      this.stopFlashing();
      this.startFlashing();
    }
  }

  prevSong() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.stopFlashing();
      this.startFlashing();
    }
  }

  backToConfig() {
    this.stopFlashing();
    this.router.navigate(['/set/' + encodeURIComponent(this.setName)]);
  }
}
