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

  // Function to format text
  formatText(format: string) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!range || range.collapsed) return;  // Do nothing if no text is selected

    const span = document.createElement('span');
    const selectedText = range.toString();
    const parentElement = range.startContainer.parentElement;

    let shouldApplyStyle = false;

    switch (format) {
      case 'bold':
        // Check if the parent element already has the bold style
        shouldApplyStyle = parentElement?.style.fontWeight !== 'bold';
        this.isBold = shouldApplyStyle;
        break;
      case 'italic':
        // Check if the parent element already has the italic style
        shouldApplyStyle = parentElement?.style.fontStyle !== 'italic';
        this.isItalic = shouldApplyStyle;
        break;
      case 'underline':
        // Check if the parent element already has the underline style
        shouldApplyStyle = parentElement?.style.textDecoration !== 'underline';
        this.isUnderline = shouldApplyStyle;
        break;
    }

    // Apply the selected style to the text
    if (shouldApplyStyle) {
      switch (format) {
        case 'bold':
          span.style.fontWeight = 'bold';
          break;
        case 'italic':
          span.style.fontStyle = 'italic';
          break;
        case 'underline':
          span.style.textDecoration = 'underline';
          break;
      }
    } else {
      // If we are removing the style, reset the formatting
      switch (format) {
        case 'bold':
          span.style.fontWeight = 'normal';
          break;
        case 'italic':
          span.style.fontStyle = 'normal';
          break;
        case 'underline':
          span.style.textDecoration = 'none';
          break;
      }
    }

    // Delete the selected content and apply the new formatting
    range.deleteContents();
    range.insertNode(span);
    span.textContent = selectedText; // Restore the selected text with new formatting

    // Set the selection to the end of the newly inserted span
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.setEndAfter(span);
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
