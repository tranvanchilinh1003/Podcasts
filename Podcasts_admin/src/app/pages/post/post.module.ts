import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NbCardModule ,NbIconModule,NbSelectModule} from '@nebular/theme';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { environment } from '@environments/environment';
import { ThemeModule } from '../../@theme/theme.module';
import { PostRoutingModule, routedComponents } from './post-routing.module';
import { ListComponent } from './list/list.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { EditComponent } from './edit/edit.component';
// import{CreateComponent} from './create/create.component';
import { PaginatorModule } from '../../@theme/components/paginator/paginator.module';
import { TinymceModule } from 'app/@theme/components/tinymce/tinymce.module';
import { CommentComponent } from './comment/comment.component';
import { RatingComponent } from './comment/rating.component';
@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    PostRoutingModule,
    NbEvaIconsModule,
    NbIconModule,
    NbSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    PaginatorModule,
    TinymceModule
  ],
  declarations: [
    ...routedComponents,
    ListComponent,
    EditComponent,
    CommentComponent,
    RatingComponent
    // CreateComponent
  ],
})
export class PostModule { }