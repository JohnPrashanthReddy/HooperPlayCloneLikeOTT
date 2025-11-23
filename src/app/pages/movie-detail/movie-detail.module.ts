import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MovieDetailPageRoutingModule } from './movie-detail-routing.module';
import { MovieDetailPage } from './movie-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovieDetailPageRoutingModule,
    MovieDetailPage  // ⬅️ Import standalone component
  ],
  declarations: []  // ⬅️ Nothing here
})
export class MovieDetailPageModule {}