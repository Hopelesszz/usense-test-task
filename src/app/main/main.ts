import { Component, signal, inject, ChangeDetectionStrategy,DestroyRef } from '@angular/core';
import { Textarea } from '../textarea/textarea';
import { Synonims } from '../synonims/synonims';
import { HttpClient } from '@angular/common/http';
import { SynonymsData } from "../../types/types";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main',
  imports: [Textarea, Synonims],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Main {
  private readonly http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  public synonyms = signal<string[]>([]);
  public currentSelectedText = signal<string>('');
  public error = signal<string>('');
  public chosenSynonym = signal<string>('');
  public handleSelection(value: string): void {
    this.currentSelectedText.set(value);
  }
  public handleClick(value: string): void {
    this.chosenSynonym.set(value);
    this.synonyms.set([]);
  }
  public fetchSynonyms():void {
    let textToSearch = this.currentSelectedText().trim();
    if (!textToSearch) {
      this.currentSelectedText.set("");
      this.synonyms.set([]);
      this.error.set('Select some text containing words!');
      return;
    } else {
      this.error.set('');
    }
    const words = this.currentSelectedText().trim().split(/\s+/);
    if (words.length > 5) {
      this.currentSelectedText.set("");
      this.synonyms.set([]);
      this.error.set("Selected text is too long! Please select up to 5 words.");
      return;
    }
    else {
      this.error.set('');
    }
    this.http.get<SynonymsData[]>(`https://api.datamuse.com/words?ml=${encodeURIComponent(textToSearch)}&max=10`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if(data.length > 0) {
          const wordsArray = data.map((obj: SynonymsData) => obj.word);
          this.synonyms.set(wordsArray);
          this.error.set('');
        }
        else {
          this.error.set("There are not synonyms for thos word.");
          this.currentSelectedText.set("");
          this.synonyms.set([]);
        }
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}
