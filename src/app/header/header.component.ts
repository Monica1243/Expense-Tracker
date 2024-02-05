import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  SlideIn: boolean = false;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.SlideIn = true;
    }, 100); // Add a slight delay for better visual effect
  }
}
