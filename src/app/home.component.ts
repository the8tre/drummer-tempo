import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Song {
  name: string;
  bpm: number;
  duration?: number; // in seconds
}

export interface Setlist {
  name: string;
  songs: Song[];
}

@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FormsModule],
})
export class HomeComponent {
  sets: Setlist[] = [
    {
      name: 'Default Set',
      songs: [
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
      ],
    },
  ];

  constructor(private router: Router) {
    const stored = localStorage.getItem('drummer-cue-sets');
    if (stored) {
      this.sets = JSON.parse(stored);
    }
  }

  addSet() {
    const name = prompt('Enter the set name:');
    if (name) {
      this.sets.push({
        name: name,
        songs: [{ name: '', bpm: 120, duration: undefined }],
      });
      this.sets.sort((a, b) => a.name.localeCompare(b.name));
      this.save();
      this.openSet(name);
    }
  }

  renameSet(oldName: string) {
    const newName = prompt('Enter the new set name:', oldName);
    if (newName && newName !== oldName) {
      const index = this.sets.findIndex((set) => set.name === oldName);
      if (index !== -1) {
        this.sets[index].name = newName;
        this.sets.sort((a, b) => a.name.localeCompare(b.name));
        this.save();
      }
    }
  }

  removeSet(setName: string) {
    if (window.confirm(`Do you really want to delete "${setName}"?`)) {
      const index = this.sets.findIndex((set) => set.name === setName);
      if (index === -1) return;
      this.sets.splice(index, 1);
      this.save();
    }
  }

  save() {
    localStorage.setItem('drummer-cue-sets', JSON.stringify(this.sets));
  }

  openSet(setName: string) {
    this.save();
    this.router.navigate([`/set/${encodeURIComponent(setName)}`]);
  }
}
