import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-artical',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Include FormsModule and CommonModule
  templateUrl: './artical.component.html',
  styleUrls: ['./artical.component.css']
})
export class ArticalComponent {
  title: string = '';
  article: string = '';
  posted: boolean = false;

  // Track the active state of each formatting option
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;

  // Function to format text (bold, italic, underline)
  formatText(format: string) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!range || range.collapsed) return;  // Do nothing if no text is selected

    const selectedText = range.toString();
    const parentElement = range.startContainer.parentElement;

    let shouldApplyStyle = false;

    switch (format) {
      case 'bold':
        // Toggle the bold style
        shouldApplyStyle = this.isBold ? false : true;
        this.isBold = shouldApplyStyle;
        break;
      case 'italic':
        // Toggle the italic style
        shouldApplyStyle = this.isItalic ? false : true;
        this.isItalic = shouldApplyStyle;
        break;
      case 'underline':
        // Toggle the underline style
        shouldApplyStyle = this.isUnderline ? false : true;
        this.isUnderline = shouldApplyStyle;
        break;
    }

    // Apply or remove the selected style to the text
    if (shouldApplyStyle) {
      document.execCommand(format);  // Apply the style
    } else {
      document.execCommand(format);  // Remove the style
    }

    // Move the cursor to the end of the newly formatted text
    const newRange = document.createRange();
    newRange.setStartAfter(range.endContainer);
    newRange.setEndAfter(range.endContainer);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  }

  // Function to insert emoji
  addEmoji(emoji: string) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!range) return;

    const emojiNode = document.createTextNode(emoji);
    range.deleteContents();  // Remove selected text
    range.insertNode(emojiNode);  // Insert emoji at cursor position

    // Move the cursor after the emoji
    const newRange = document.createRange();
    newRange.setStartAfter(emojiNode);
    newRange.setEndAfter(emojiNode);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  }

  // Function to post the article
  postArticle() {
    this.posted = true;
    // Reset title and article after posting
    this.title = '';
    this.article = '';
  }

  // Function to cancel the action
  cancel() {
    this.title = '';
    this.article = '';
  }
}
