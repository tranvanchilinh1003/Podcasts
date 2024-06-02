import { NgModule } from '@angular/core';
import { NbCardModule ,NbIconModule} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { PostRoutingModule, routedComponents } from './post-routing.module';
import { ListComponent } from './list/list.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { EditComponent } from './edit/edit.component';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { environment } from '@environments/environment';
@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    PostRoutingModule,
    NbEvaIconsModule,
    NbIconModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  declarations: [
    ...routedComponents,
    ListComponent,
    EditComponent,
  ],
})
export class PostModule { }
