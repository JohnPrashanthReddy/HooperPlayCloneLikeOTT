import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'movie-detail/:id',
    loadChildren: () => import('./pages/movie-detail/movie-detail.module').then(m => m.MovieDetailPageModule)
  },
  {
    path: 'see-all',
    loadChildren: () => import('./pages/see-all/see-all.module').then(m => m.SeeAllPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}