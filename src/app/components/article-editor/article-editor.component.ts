import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from '../../services/rest.service';
import { Article } from '../../domain/article';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
    private rest: RestService) { }

  @Input()
  article:Article;

  @Input()
  callback: BehaviorSubject<Article>;

  form: FormGroup;

  submitted: boolean;

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      title: this.fb.control(this.article.title, Validators.required),
      articleType: this.fb.control(this.article.articleType, Validators.required),
      text: this.fb.control(this.article.text),
      publishDate: this.fb.control(this.article.publishDate,Validators.required)
    });
  }
  onSubmit({ value, valid }: { value: Article, valid: boolean }) {
    this.submitted = true;
    if (valid) {
      if (this.article.id) {
        this.rest.update("api/articles/" + this.article.id, value)
          .subscribe(re => {
            this.activeModal.close();
            this.callback.next(re);
          });
      } else {
        this.rest.create("api/articles", value).subscribe(re => {
          this.activeModal.close();
          this.callback.next(re);
        });
      }
    }
  }

  invalid(field: string): boolean {
    var f = this.form.get(field);
    return f.invalid && (f.dirty || f.touched || this.submitted);
  }

}
