import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Setlist } from './home.component';

@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SetComponent {
  private route = inject(ActivatedRoute);
  setName: string = '';
  set: Setlist = {
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
  };

  constructor(private router: Router) {
    const stored = localStorage.getItem('songs');
    if (stored) {
      this.set.songs = JSON.parse(stored);
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.setName = decodeURIComponent(params['name']);
      const rawSets = localStorage.getItem('drummer-cue-sets');
      if (rawSets) {
        const sets = JSON.parse(rawSets);
        this.set = sets.find((set: Setlist) => set.name === this.setName);
      }
    });
  }

  addSong() {
    this.set.songs.push({ name: '', bpm: 120, duration: undefined });
    this.save();
  }

  removeSong(index: number) {
    this.set.songs.splice(index, 1);
    this.save();
  }

  save() {
    const stored = localStorage.getItem('drummer-cue-sets');
    if (stored) {
      const sets = JSON.parse(stored);
      const existingSet = sets.find((s: Setlist) => s.name === this.set.name);
      if (existingSet) {
        existingSet.songs = this.set.songs;
      } else {
        sets.push(this.set);
      }
      localStorage.setItem('drummer-cue-sets', JSON.stringify(sets));
    }
  }

  startPlayer() {
    this.save();
    this.router.navigate(['/player/' + encodeURIComponent(this.set.name)]);
  }

  moveUp(index: number) {
    if (index > 0) {
      [this.set.songs[index - 1], this.set.songs[index]] = [
        this.set.songs[index],
        this.set.songs[index - 1],
      ];
      this.save();
    }
  }

  moveDown(index: number) {
    if (index < this.set.songs.length - 1) {
      [this.set.songs[index + 1], this.set.songs[index]] = [
        this.set.songs[index],
        this.set.songs[index + 1],
      ];
      this.save();
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
