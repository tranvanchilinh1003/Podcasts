import { NgModule } from '@angular/core';
import { NbCardModule ,NbIconModule} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { PostRoutingModule, routedComponents } from './post-routing.module';
import { ListComponent } from './list/list.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    PostRoutingModule,
    NbEvaIconsModule,
    NbIconModule
  ],
  declarations: [
    ...routedComponents,
    ListComponent,
    EditComponent,
  ],
})
export class PostModule { }
