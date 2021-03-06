import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatProgressSpinnerModule]
})
export class MaterialTheamsModule { }
