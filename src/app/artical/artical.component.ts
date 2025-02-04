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
  posts: any[] = []; // Array to hold posts
  isEditing: boolean = false; // Track if we're editing a post
  editingIndex: number | null = null; // Store the index of the post being edited

  ngOnInit() {
    this.loadPosts(); // Load posts from localStorage
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

  addImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.image = reader.result as string;
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

    if (!content) {
      this.resetFormatting();
    }
  }

  postArticle() {
    if (!this.title.trim() || !this.article.trim()) {
      alert('Title and article content are required.');
      return;
    }

    const newPost = {
      title: this.title,
      article: this.article,
      image: this.image,
    };

    // If we are editing an existing post, update the post instead of adding a new one
    if (this.isEditing && this.editingIndex !== null) {
      this.posts[this.editingIndex] = newPost;
    } else {
      this.posts.push(newPost); // Add new post to the posts array
    }

    localStorage.setItem('posts', JSON.stringify(this.posts)); // Save to localStorage

    // Clear all fields after posting
    this.resetFormFields();

    this.posted = true;

    // Reset editing state
    this.isEditing = false;
    this.editingIndex = null;

    setTimeout(() => {
      this.posted = false;
    }, 3000);
  }

  resetFormFields() {
    this.title = '';   // Clear title
    this.article = ''; // Clear article content
    this.image = null;  // Clear image
    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.innerHTML = ''; // Clear the article content area
    }
    this.resetFormatting(); // Reset formatting (Bold, Italic, Underline)
  }

  resetFormatting() {
    this.isBold = false;
    this.isItalic = false;
    this.isUnderline = false;

    document.execCommand('removeFormat');
  }

  loadPosts() {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
    }
  }

  removePost(index: number) {
    this.posts.splice(index, 1); // Remove post from the array
    localStorage.setItem('posts', JSON.stringify(this.posts)); // Update localStorage
  }

  editPost(index: number) {
    const post = this.posts[index];

    // Set the post data into the form fields
    this.title = post.title;
    this.article = post.article;
    this.image = post.image;

    // Set the article content in the contenteditable area
    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.innerHTML = this.article; // Insert the article content back
    }

    // Mark as editing and store the index of the post being edited
    this.isEditing = true;
    this.editingIndex = index;

    // Focus the contenteditable area for immediate editing
    this.focusContentEditable();
  }

  cancel() {
    this.resetFormFields();
    this.isEditing = false;
    this.editingIndex = null;
  }
}
