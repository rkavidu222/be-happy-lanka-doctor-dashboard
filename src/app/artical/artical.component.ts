import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artical',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './artical.component.html',
  styleUrls: ['./artical.component.css'],
})
export class ArticalComponent implements OnInit, OnDestroy {
  title: string = '';
  article: string = '';
  posted: boolean = false;
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  image: string | null = null;

  ngOnInit() {
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
  }

  handleKeyboardShortcuts(event: KeyboardEvent) {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'b':
          event.preventDefault();
          this.toggleBold();
          break;
        case 'i':
          event.preventDefault();
          this.toggleItalic();
          break;
        case 'u':
          event.preventDefault();
          this.toggleUnderline();
          break;
      }
    }
  }

  toggleBold() {
    this.isBold = !this.isBold;
    document.execCommand('bold');
    this.focusContentEditable();
  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
    document.execCommand('italic');
    this.focusContentEditable();
  }

  toggleUnderline() {
    this.isUnderline = !this.isUnderline;
    document.execCommand('underline');
    this.focusContentEditable();
  }

  addEmoji(emoji: string) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const emojiNode = document.createTextNode(emoji);
      range.deleteContents();
      range.insertNode(emojiNode);

      const newRange = document.createRange();
      newRange.setStartAfter(emojiNode);
      newRange.setEndAfter(emojiNode);
      selection.removeAllRanges();
      selection.addRange(newRange);

      this.focusContentEditable();
    }
  }

  triggerFileInput() {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Trigger the file input click programmatically
    }
  }

  addImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.image = reader.result as string; // Set the uploaded image data
      };

      reader.readAsDataURL(file);
    }
  }

  focusContentEditable() {
    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.focus();
    }
  }

  updateArticle(event: Event) {
    const content = (event.target as HTMLElement).innerHTML.trim();
    this.article = content;

    // Reset formatting when the article is cleared
    if (!content) {
      this.resetFormatting();
    }
  }

  postArticle() {
    if (!this.title.trim() || !this.article.trim()) {
      alert('Title and article content are required.');
      return;
    }

    this.posted = true;
    this.title = '';
    this.article = '';
    this.image = null; // Reset the image after posting
    this.resetFormatting();

    setTimeout(() => {
      this.posted = false;
    }, 3000);
  }

  cancel() {
    this.title = '';
    this.article = '';
    this.image = null; // Reset the image
    this.resetFormatting();

    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.innerHTML = '';
    }

    this.focusContentEditable();
  }

  resetFormatting() {
    this.isBold = false;
    this.isItalic = false;
    this.isUnderline = false;

    // Reset any applied formatting
    document.execCommand('removeFormat');
  }
}
