import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Song {
  name: string;
  bpm: number;
}

@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ConfigComponent {
  songs: Song[] = [];

  constructor(private router: Router) {
    const stored = localStorage.getItem('songs');
    if (stored) {
      this.songs = JSON.parse(stored);
    }
  }

  addSong() {
    this.songs.push({ name: '', bpm: 120 });
    this.save();
  }

  removeSong(index: number) {
    this.songs.splice(index, 1);
    this.save();
  }

  save() {
    localStorage.setItem('songs', JSON.stringify(this.songs));
  }

  startPlayer() {
    this.save();
    this.router.navigate(['/player']);
  }
}
