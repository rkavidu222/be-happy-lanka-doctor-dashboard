import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artical',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './artical.component.html',
  styleUrls: ['./artical.component.css'],
})
export class ArticalComponent {
  title: string = '';
  article: string = '';
  posted: boolean = false;

  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;

  toggleBold() {
    this.isBold = !this.isBold;
    document.execCommand('bold'); // Apply bold formatting
    this.focusContentEditable(); // Keep focus in the editor
  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
    document.execCommand('italic'); // Apply italic formatting
    this.focusContentEditable(); // Keep focus in the editor
  }

  toggleUnderline() {
    this.isUnderline = !this.isUnderline;
    document.execCommand('underline'); // Apply underline formatting
    this.focusContentEditable(); // Keep focus in the editor
  }

  addEmoji(emoji: string) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!range) return;

    const emojiNode = document.createTextNode(emoji);
    range.deleteContents();
    range.insertNode(emojiNode);

    const newRange = document.createRange();
    newRange.setStartAfter(emojiNode);
    newRange.setEndAfter(emojiNode);
    selection?.removeAllRanges();
    selection?.addRange(newRange);

    this.focusContentEditable(); // Keep focus in the editor after adding emoji
  }

  focusContentEditable() {
    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.focus(); // Restore focus to the contenteditable area
    }
  }

  updateArticle(event: Event) {
    this.article = (event.target as HTMLElement).innerHTML; // Sync the content with the article property
  }

  postArticle() {
    if (!this.title.trim() || !this.article.trim()) {
      alert('Title and article content are required.');
      return;
    }

    this.posted = true;
    this.title = '';
    this.article = '';

    setTimeout(() => {
      this.posted = false;
    }, 3000); // Hide the success message after 3 seconds
  }

  cancel() {
    this.title = '';
    this.article = '';
    this.isBold = false;
    this.isItalic = false;
    this.isUnderline = false;
  }
}
