import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Resource } from '../../domain/resource';
import { User } from '../../domain/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Article } from '../../domain/article';
import { ArticleEditorComponent } from '../article-editor/article-editor.component';

const PAGE_SIZE:number=3;

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  constructor(private _rest: RestService, private _modalSv: NgbModal) { }

  articleList: Resource<Article>;
  page: number = 0;
  searchTerm: string = "";
  sortCol: string = "publishDate";
  sortDir: boolean = false;
  selectedId: number;

  changes: BehaviorSubject<Article> = new BehaviorSubject<Article>(null);

  ngOnInit() {
    this.load();
    this.changes.subscribe(u => {
      if (u !== null) {
        this.load();
      }
    });
  }

  private load() {
    var query: { [k: string]: any } = {};
    query.size = PAGE_SIZE;
    query.search = this.searchTerm;
    query.page = this.page - 1;
    query.sort = this.sortCol + "," + (this.sortDir ? "asc" : "desc");
    this._rest.getList<Article>("api/articles", query).subscribe(re => this.articleList = re);
  }

  sort(col: string): void {
    if (this.sortCol === col) {
      this.sortDir = !this.sortDir;
    } else {
      this.sortCol = col;
      this.sortDir = true;
    }
    this.load()
  }

  edit(a:Article): void {
    const modalRef = this._modalSv.open(ArticleEditorComponent);
    modalRef.componentInstance.article = a;
    modalRef.componentInstance.callback = this.changes;
  }

  deleteSelected(): void {
    this._rest.delete("api/articles/" + this.selectedId).subscribe(re => this.load());
  }

  createNew(): void {
    let a:Article = new Article();
    this.edit(a);
  }

}
