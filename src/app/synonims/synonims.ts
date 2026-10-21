import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-synonims',
  imports: [],
  templateUrl: './synonims.html',
  styleUrl: './synonims.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Synonims {
  public data = input<string[]>();
  public error = input<string>("");
  public eventClick = output<string>();

  public handleClick(event: Event) {
    const text = event.target as HTMLDivElement;
    this.eventClick.emit(text.textContent);
  }
}
