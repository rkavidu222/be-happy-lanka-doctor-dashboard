import { Component } from '@angular/core';

@Component({
  selector: 'app-artical',
  standalone: true,
  imports: [],
  templateUrl: './artical.component.html',
  styleUrl: './artical.component.css'
})
export class ArticalComponent {

  submitArticle(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = (form.querySelector('#articleTitle') as HTMLInputElement).value;
    const content = (form.querySelector('#articleContent') as HTMLTextAreaElement).value;
    const image = (form.querySelector('#articleImage') as HTMLInputElement).files?.[0];

    const newArticle = {
      title,
      content,
      image,
    };

    console.log('Article submitted:', newArticle);
}



}
