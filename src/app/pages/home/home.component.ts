import { Component, OnInit } from '@angular/core';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  characters: any = undefined;
  filteredCharacters: any = undefined;
  totalCharacters: number = 0;
  p: number = 1;
  offset: number = 0;
  limit: number = 30;

  constructor(private characterService: CharactersService) {}

  ngOnInit(): void {
    this.getCharacters();
  }

  async getCharacters() {
    this.loading = true;
    try {
      const res = await this.characterService.getCharacters(
        this.offset,
        this.limit
      );
      this.totalCharacters = res.data.total;
      const limit = Math.ceil(this.totalCharacters / this.limit);
      let fetchArr: Array<unknown> = [];
      for (let i = 0; i < limit; i++) {
        fetchArr.push(this.characterService.getCharacters(limit * i, limit));
      }
      const data = await Promise.all(fetchArr);
      this.characters = data.map((item: any) => item.data.results).flat();

      this.filteredCharacters = this.characters;
      this.totalCharacters = this.characters.length;
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
  }

  filter(e: any) {
    const value = e.target.value;

    if (this.characters.length !== 0) {
      if (value === '') {
        this.filteredCharacters = this.characters;
      } else {
        this.filteredCharacters = this.characters
          .filter((character: { name: string }) => {
            return character.name.toLowerCase().includes(value.toLowerCase());
          })
          .sort();
      }
    }
  }
}
