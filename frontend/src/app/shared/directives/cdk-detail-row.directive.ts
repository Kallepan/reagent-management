import {Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[cdkDetailRow]',
  standalone: true,
})
export class CdkDetailRowDirective {
  private row: any;
  private tRef: TemplateRef<any>;
  private opened: boolean;
  private active: boolean;

  @HostBinding('class.expanded')
  get expanded(): boolean {
    return this.opened;
  }

  @Input()
  set cdkDetailRow(value: any) {
    if (value !== this.row) {
      this.row = value;
      // this.render();
    }
  }

  @Input('cdkDetailRowTpl')
  set template(value: TemplateRef<any> | null) {
    this.active = !!value;
    if (!value) return;

    if (value !== this.tRef) {
      this.tRef = value;
      // this.render();
    }
  }

  constructor(public vcRef: ViewContainerRef) { }

  @HostListener('click')
  onClick(): void {
    if (!this.active) return;
    this.toggle();
  }

  toggle(): void {
    if (this.opened) {
      this.vcRef.clear();
    } else {
      this.render();
    }
    this.opened = this.vcRef.length > 0;
  }

  private render(): void {
    this.vcRef.clear();
    if (this.tRef && this.row) {
      this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
    }
  }
}
