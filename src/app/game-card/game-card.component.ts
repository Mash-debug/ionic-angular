import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent  implements OnInit {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  constructor() { }

  ngOnInit() {}

}
