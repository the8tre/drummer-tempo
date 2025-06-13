import { Component, HostListener, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Song } from './config.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent {
  songs: { name: string; bpm: number }[] = [];
  currentIndex = 0;
  isFlashing = false;
  flashInterval: any;
  autoNextTimeout: any;
  flashTimeout: any;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    const stored = localStorage.getItem('songs');
    if (stored) {
      this.songs = JSON.parse(stored);
    }
    this.startFlashing();
  }

  ngOnDestroy() {
    this.stopFlashing();
  }

  startFlashing() {
    this.setFlashInterval(this.songs[this.currentIndex]);
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
    if (this.currentIndex < this.songs.length - 1) {
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
    this.router.navigate(['/']);
  }
}
