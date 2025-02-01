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
  uploadedImages: string[] = []; // Stores uploaded image URLs

  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;

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

  // Existing function - Keeps images inside the article text
  addImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imgElement = document.createElement('img');
        imgElement.src = reader.result as string;
        imgElement.style.width = '100%';
        imgElement.style.height = 'auto';
        imgElement.style.margin = '1rem 0';
        imgElement.alt = "Uploaded Image";

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(imgElement);

          const newRange = document.createRange();
          newRange.setStartAfter(imgElement);
          newRange.setEndAfter(imgElement);
          selection.removeAllRanges();
          selection.addRange(newRange);

          this.focusContentEditable();
        }
      };

      reader.readAsDataURL(file);
    }
  }

  // New function - Keeps images separate from the article text
  uploadImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.uploadedImages.push(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
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
    this.uploadedImages = [];
    this.resetFormatting();

    setTimeout(() => {
      this.posted = false;
    }, 3000);
  }

  cancel() {
    this.title = '';
    this.article = '';
    this.uploadedImages = [];
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
