import { Component } from '@angular/core';
import { ConfigComponent } from './config.component';
import { PlayerComponent } from './player.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConfigComponent, PlayerComponent, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  started = false;
  songs: { name: string; bpm: number }[] = [];

  ngOnInit() {
    const stored = localStorage.getItem('songs');
    if (stored) {
      this.songs = JSON.parse(stored);
    }
  }

  onStart(songs: { name: string; bpm: number }[]) {
    this.songs = songs;
    localStorage.setItem('songs', JSON.stringify(songs));
    this.started = true;
  }

  onStop() {
    this.started = false;
  }
}
