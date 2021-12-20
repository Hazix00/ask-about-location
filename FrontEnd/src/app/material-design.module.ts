import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatPaginatorModule } from '@angular/material/paginator'

const materialModules: any[] = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatPaginatorModule,
]

@NgModule({
  declarations: [],
  imports: materialModules,
  exports: materialModules
})
export class MaterialDesignModule { }
