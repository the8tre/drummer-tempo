import { provideRouter, Routes } from '@angular/router';
import { SetComponent } from './set.component';
import { PlayerComponent } from './player.component';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'set/:name', component: SetComponent },
  { path: 'player/:name', component: PlayerComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

export const appRouter = provideRouter(routes);
