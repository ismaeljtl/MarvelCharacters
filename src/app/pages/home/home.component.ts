import { Component, OnInit } from '@angular/core';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading: boolean = false;
  characters: any = undefined;
  filteredCharacters: any = undefined;
  totalCharacters: number = 0;
  p: number = 1;
  offset: number = 0;

  constructor(private characterService: CharactersService) { }

  ngOnInit(): void {
    this.getCharacters();
  }

  async getCharacters() {
    this.loading = true;
    try {
      const res = await this.characterService.getCharacters(this.offset);
      this.characters = res.data.results
      this.filteredCharacters = this.characters;
      this.totalCharacters = res.data.total;
    } catch (error) {
      alert('An error has occurred, please try again.');
      console.log(error);
    }
    this.loading = false;
  }

  pageChanged(page: number) {
    this.p = page;
    // we have to substract 1 to page because the first page have an offset of 0
    this.offset = 30 * (page - 1);
    this.getCharacters();
  }

  filter(e: any) {
    const value = e.target.value;
    
    if (this.characters.length !== 0) {
      if (value === '') {
        this.filteredCharacters = this.characters;
      } else {
        this.filteredCharacters = this.characters.filter((character: { name: string; }) => {
          return character.name.toLowerCase().includes(value.toLowerCase()) 
        }).sort();
      }
    }
  }

}
