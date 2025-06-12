import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent {
  @Input() songs: { name: string; bpm: number }[] = [];
  @Output() stop = new EventEmitter<void>();
  currentIndex = 0;
  flashing = false;
  intervalId: any;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.startFlashing();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startFlashing() {
    this.setFlashInterval(this.songs[this.currentIndex]?.bpm);
  }

  setFlashInterval(bpm: number) {
    clearInterval(this.intervalId);
    const interval = 60000 / bpm;
    const flashDuration = interval * 0.2; // 20% of interval for flash fade-out
    const idleDuration = interval - flashDuration;

    this.updateTransitionStyles(flashDuration);

    this.intervalId = setInterval(() => {
      this.flashing = true;
      setTimeout(() => (this.flashing = false), flashDuration);
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
        this.flashing ? flashStyle : fadeStyle
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
      this.stop.emit();
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
