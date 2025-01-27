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

  addImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        // Create the image element
        const imgElement = document.createElement('img');
        imgElement.src = reader.result as string;
        imgElement.style.width = '100%'; // Resize image based on container width
        imgElement.style.height = 'auto'; // Maintain aspect ratio
        imgElement.style.margin = '1rem 0';
        imgElement.alt = "Uploaded Image";

        // Insert image in the contenteditable area
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents(); // Remove any selected text
          range.insertNode(imgElement); // Insert image node

          // Adjust caret position after image
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

  focusContentEditable() {
    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.focus();
    }
  }

  updateArticle(event: Event) {
    this.article = (event.target as HTMLElement).innerHTML;
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
    }, 3000);
  }

  cancel() {
    // Clear all fields and reset styling states
    this.title = '';
    this.article = '';
    this.isBold = false;
    this.isItalic = false;
    this.isUnderline = false;

    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.innerHTML = ''; // Clear content inside textarea
    }

    // Optional: focus back to the contenteditable area
    this.focusContentEditable();
  }
}
