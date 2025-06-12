import { Component, HostListener, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    clearInterval(this.flashInterval);
  }

  startFlashing() {
    this.setFlashInterval(this.songs[this.currentIndex]?.bpm);
  }

  stopFlashing() {
    clearInterval(this.flashInterval);
    this.isFlashing = false;
  }

  setFlashInterval(bpm: number) {
    this.isFlashing = true;
    clearInterval(this.flashInterval);
    const interval = 60000 / bpm;
    const flashDuration = interval * 0.2; // 20% of interval for flash fade-out
    const idleDuration = interval - flashDuration;

    this.updateTransitionStyles(flashDuration);

    this.flashInterval = setInterval(() => {
      this.isFlashing = true;
      setTimeout(() => (this.isFlashing = false), flashDuration);
    }, interval);
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
      this.router.navigate(['/']);
    }
  }

  nextSong() {
    if (this.currentIndex < this.songs.length - 1) {
      this.currentIndex++;
      this.setFlashInterval(this.songs[this.currentIndex].bpm);
    }
  }

  prevSong() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.setFlashInterval(this.songs[this.currentIndex].bpm);
    }
  }
}
