import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent {
  @Output() start = new EventEmitter<{ name: string; bpm: number }[]>();

  songs = [{ name: '', bpm: 120 }];

  ngOnInit() {
    const stored = localStorage.getItem('songs');
    if (stored) {
      this.songs = JSON.parse(stored);
    }
  }

  addSong() {
    this.songs.push({ name: '', bpm: 120 });
  }

  removeSong(index: number) {
    this.songs.splice(index, 1);
  }

  startApp() {
    this.start.emit(this.songs);
  }
}
