import { Component, signal, computed, input,  OnChanges, output, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-textarea',
  imports: [],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Textarea implements OnChanges {
  private startSelectionIdx = 0;
  private endSelectionIdx = 0;
  public synonym = input<string>('');
  public eventSelect = output<string>();
  public eventClick = output<void>();
  public text = signal<string>('');
  public selectedText = signal<string>('');
  public symbolsCount = computed(() => this.text().length);
  public wordsCount = computed(() => {
    if (!this.text().trim()) {
      return 0;
    }
    return this.text().trim().split(/\s+/).length;
  });


  ngOnChanges(changes: SimpleChanges): void {
    const newWord = this.synonym() ? this.synonym().trim() : '';
    if (newWord && this.endSelectionIdx > this.startSelectionIdx) {
      const updatedText = this.text().slice(0,this.startSelectionIdx) + newWord + this.text().slice(this.endSelectionIdx);
      this.text.set(updatedText);
      this.startSelectionIdx = 0;
      this.endSelectionIdx = 0;
      this.selectedText.set('');
    }
  }
  public onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.text.set(target.value);
    if (target.selectionStart === target.selectionEnd) {
      this.selectedText.set('');
      this.eventSelect.emit('');
    }
  }
  public textSelection(event: Event):void {
    const textarea = event.target as HTMLTextAreaElement;
    this.startSelectionIdx = textarea.selectionStart;
    this.endSelectionIdx = textarea.selectionEnd;
    this.selectedText.set(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd));
    this.eventSelect.emit(this.selectedText());
  }
  public getSynonyms(): void {
    this.eventClick.emit();
  }
}
