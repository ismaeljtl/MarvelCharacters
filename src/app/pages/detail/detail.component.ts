import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  loading: boolean = false;
  character: any;

  constructor(private route: ActivatedRoute, private characterService: CharactersService) { }

  ngOnInit(): void {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const characterId = Number(routeParams.get('characterId'));
    this.getCharacterInfo(characterId);
  }
  
  async getCharacterInfo(characterId: number) {
    this.loading = true;
    try {
      const res = await this.characterService.getCharacter(characterId);
      this.character = res.data.results[0];
    } catch (error) {
      alert('An error has occurred, please try again.');
      console.log(error);
    }
    this.loading = false;
  }

}
