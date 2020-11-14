// ANGUALR
import { Component, OnInit } from '@angular/core';

// SERVICES
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService
    ) {}

  ngOnInit(): void {
    
  }
}
