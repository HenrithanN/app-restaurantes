import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './containers/login/login.component';
import { PrincipalComponent } from './containers/principal/principal.component';
import { RestauranteDetalhesComponent } from './containers/restaurante-detalhes/restaurante-detalhes.component';

const routes: Routes = [{
    path:'',
    pathMatch:'full',
    redirectTo:'login'
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'principal',
    component: PrincipalComponent
  },
  {
    path:'restaurante-detalhes',
    component: RestauranteDetalhesComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
