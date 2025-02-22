import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  posts: any[] = [];
  isEditing: boolean = false;
  editingIndex: number | null = null;
  selectedPost: any = null;
  safeHtmlContent: SafeHtml = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadPosts();
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
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
        this.cdr.detectChanges();
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
    const editableElement = event.target as HTMLElement;
    this.article = editableElement.innerHTML; // Capture the inner HTML
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

    if (this.isEditing && this.editingIndex !== null) {
      this.posts[this.editingIndex] = newPost;
      this.posted = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.posted = false;
        this.cdr.detectChanges();
      }, 3000);

      this.resetFormFields();
      this.isEditing = false;
      this.editingIndex = null;
    } else {
      this.posts.push(newPost);
      this.posted = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.posted = false;
        this.cdr.detectChanges();
      }, 3000);

      this.resetFormFields();
    }

    localStorage.setItem('posts', JSON.stringify(this.posts));
  }

  resetFormFields() {
    this.title = '';
    this.article = '';
    this.image = null;
    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.innerHTML = '';
    }
    this.resetFormatting();
    this.cdr.detectChanges();
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
    if (confirm('Are you sure you want to delete this post?')) {
      this.posts.splice(index, 1);
      localStorage.setItem('posts', JSON.stringify(this.posts));
      this.cdr.detectChanges();
    }
  }

  editPost(index: number) {
    const post = this.posts[index];
    this.title = post.title;
    this.article = post.article;
    this.image = post.image;

    const editableElement = document.querySelector('.article-textarea') as HTMLElement;
    if (editableElement) {
      editableElement.innerHTML = this.article;
    }

    this.isEditing = true;
    this.editingIndex = index;
    this.focusContentEditable();
  }

  viewPost(index: number) {
    this.selectedPost = this.posts[index];
    this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.selectedPost.article);
  }

  closeModal() {
    this.selectedPost = null;
    this.safeHtmlContent = '';
  }

  cancel() {
    this.resetFormFields();
    this.isEditing = false;
    this.editingIndex = null;
  }
}
