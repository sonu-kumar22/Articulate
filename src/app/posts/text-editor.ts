import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-text-editor',
  imports: [FormsModule, QuillEditorComponent],
  template: `
    <quill-editor class="text-editor w-full" theme="snow" format="html" placeholder="Write your story..."
      [ngModel]="value()" (ngModelChange)="valueChange.emit($event ?? '')"
      [ngModelOptions]="{ standalone: true }" [disabled]="disabled()" [sanitize]="true"
      [formats]="formats" [defaultEmptyValue]="''" (onBlur)="touched.emit()"
      (onEditorCreated)="editorRoot.set($event.root)">
      <div quill-editor-toolbar>
        <span class="ql-formats">
          <button type="button" class="ql-header" value="1" aria-label="Heading 1" title="Heading 1">H1</button>
          <button type="button" class="ql-header" value="2" aria-label="Heading 2" title="Heading 2">H2</button>
          <button type="button" class="ql-header" value="3" aria-label="Heading 3" title="Heading 3">H3</button>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-bold" aria-label="Bold" title="Bold"></button>
          <button type="button" class="ql-italic" aria-label="Italic" title="Italic"></button>
          <button type="button" class="ql-underline" aria-label="Underline" title="Underline"></button>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-list" value="ordered" aria-label="Numbered list" title="Numbered list"></button>
          <button type="button" class="ql-list" value="bullet" aria-label="Bulleted list" title="Bulleted list"></button>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-link" aria-label="Insert link" title="Insert link"></button>
          <button type="button" class="ql-image" aria-label="Add image" title="Add image from your device"></button>
          <button type="button" class="ql-clean" aria-label="Clear formatting" title="Clear formatting"></button>
        </span>
      </div>
    </quill-editor>
    <p class="mt-2 text-xs text-muted-color">Images are embedded in the story. Use small images; the complete story must fit within 500 KB.</p>
  `,
  styles: `
    :host { display: block; min-width: 0; max-width: 100%; }
    .text-editor { background: var(--p-content-background); color: var(--p-text-color); border-radius: .5rem; }
    :host ::ng-deep .ql-container { font: inherit; }
    :host ::ng-deep .ql-editor { min-height: 18rem; overflow-wrap: anywhere; }
    :host ::ng-deep .ql-editor img { max-width: 100%; height: auto; object-fit: contain; }
    :host ::ng-deep .ql-toolbar .ql-header { width: 2.5rem; }
    :host ::ng-deep .ql-toolbar { border-radius: .5rem .5rem 0 0; }
    :host ::ng-deep .ql-container { border-radius: 0 0 .5rem .5rem; }
    :host ::ng-deep .ql-stroke { stroke: var(--p-text-color); }
    :host ::ng-deep .ql-fill { fill: var(--p-text-color); }
  `,
})
export class TextEditor {
  readonly value = input('');
  readonly valueChange = output<string>();
  readonly disabled = input(false);
  readonly labelledBy = input('post-body-label');
  readonly invalid = input(false);
  readonly describedBy = input('');
  readonly required = input(false);
  readonly touched = output<void>();
  protected readonly formats = ['header', 'bold', 'italic', 'underline', 'list', 'link', 'image'];
  protected readonly editorRoot = signal<HTMLElement | null>(null);

  constructor() {
    // ngx-quill manages editing and lifecycle; only accessibility metadata is applied here.
    effect(() => {
      const root = this.editorRoot();
      if (!root) return;
      root.setAttribute('role', 'textbox');
      root.setAttribute('aria-multiline', 'true');
      root.setAttribute('aria-labelledby', this.labelledBy());
      root.setAttribute('aria-invalid', String(this.invalid()));
      root.setAttribute('aria-required', String(this.required()));
      if (this.describedBy()) root.setAttribute('aria-describedby', this.describedBy());
      else root.removeAttribute('aria-describedby');
    });
  }
}
