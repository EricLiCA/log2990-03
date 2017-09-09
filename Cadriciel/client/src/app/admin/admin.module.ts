import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Home module */
import { AdminComponent } from './admin.component';

/* Feature modules */

/* Routing module */
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule
    ],
    declarations: [
        AdminComponent,
    ],
    exports: [
        AdminComponent,
    ],
    providers: [
    ]
})
export class AdminModule { }