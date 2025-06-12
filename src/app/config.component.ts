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
  songs: Song[] = [
    {
      name: 'My Immortal',
      bpm: 158,
    },
    {
      name: 'Black Velvet',
      bpm: 91,
    },
    {
      name: 'Locked Out Of Heaven',
      bpm: 144,
    },
    {
      name: 'Back To Black',
      bpm: 123,
    },
    {
      name: "What's Up",
      bpm: 134,
    },
    {
      name: "L'Envie",
      bpm: 74,
    },
    {
      name: "L'Envie rapide",
      bpm: 160,
    },
  ];

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
