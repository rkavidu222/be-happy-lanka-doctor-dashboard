import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-artical',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './artical.component.html',
  styleUrls: ['./artical.component.css']
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
    document.execCommand('bold'); // Toggles bold formatting
  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
    document.execCommand('italic'); // Toggles italic formatting
  }

  toggleUnderline() {
    this.isUnderline = !this.isUnderline;
    document.execCommand('underline'); // Toggles underline formatting
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
  }

  postArticle() {
    this.posted = true;
    this.title = '';
    this.article = '';
  }

  cancel() {
    this.title = '';
    this.article = '';
  }
}
