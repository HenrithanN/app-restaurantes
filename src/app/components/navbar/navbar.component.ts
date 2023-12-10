import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { StorageService as storage }  from 'src/app/services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public myUtils: UtilsService, private router: Router) { }

  realizarLogout(){
    storage.clear();
    this.router.navigate(['']);
  }

}
