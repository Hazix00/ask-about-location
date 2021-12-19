import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'

const materialModules: any[] = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
]

@NgModule({
  declarations: [],
  imports: materialModules,
  exports: materialModules
})
export class MaterialDesignModule { }
