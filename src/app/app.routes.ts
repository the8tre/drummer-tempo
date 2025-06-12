import { provideRouter, Routes } from '@angular/router';
import { ConfigComponent } from './config.component';
import { PlayerComponent } from './player.component';

export const routes: Routes = [
  { path: '', component: ConfigComponent },
  { path: 'player', component: PlayerComponent },
  { path: '**', redirectTo: '' },
];

export const appRouter = provideRouter(routes);
