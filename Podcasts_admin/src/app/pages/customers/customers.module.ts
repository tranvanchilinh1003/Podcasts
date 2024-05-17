import { NgModule } from '@angular/core';
import { NbCardModule ,NbIconModule} from '@nebular/theme';
import { NbRadioModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { CustomersRoutingModule, routedComponents } from './customers-routing.module';
import { ListComponent } from './list/list.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    NbCardModule,
    NbEvaIconsModule,
    NbIconModule,
    NbRadioModule,
    ThemeModule,
    CustomersRoutingModule,
    
  ],
  declarations: [
    ...routedComponents,
    EditComponent,
  ],
})
export class CustomersModule { }
