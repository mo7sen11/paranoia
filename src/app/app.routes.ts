import { NotfoundComponent } from './components/notfound/notfound.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { authGaurdGuard } from './core/guards/auth-gaurd.guard';
import { blankGuardGuard } from './core/guards/blank-guard.guard';
import { DetailsComponent } from './components/details/details.component';
import { ShippingdetailsComponent } from './components/shippingdetails/shippingdetails.component';
import { AllordersComponent } from './components/allorders/allorders.component';

export const routes: Routes = [
    {path:'',component:AuthLayoutComponent,canActivate:[blankGuardGuard] ,children:[
        {path:'',redirectTo:'login',pathMatch:'full'},
        {path:'login',component:LoginComponent,title:'Login'},
        {path:'register',component:RegisterComponent,title:'Register'},
        {path:'forget',component:ForgetPasswordComponent,title:'ResetPassword'},
        
    ]},
    {path:'',component:BlankLayoutComponent,canActivate:[authGaurdGuard] ,children:[
        {path:'',redirectTo:'home',pathMatch:'full'},
        {path:'home',component:HomeComponent,title:'Home'},
        {path:'products',component:ProductsComponent,title:'Products'},
        {path:'cart',component:CartComponent,title:'Cart'},
        {path:'allorders',component:AllordersComponent,title:'All Orders'},
        {path:'details/:id',component:DetailsComponent,title:'product Details'},
        {path:'wishlist',component:WishlistComponent,title:'Wishlist'},
        {path: 'shipping/:id/:method', component: ShippingdetailsComponent, title: 'Shipping Details' }

    ]},
    {path:'**',component: NotfoundComponent,title:'page not found'}
];
