import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from '../../services/rest.service';
import { User } from '../../domain/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
    private rest: RestService) { }

  @Input()
  user: User;

  @Input()
  callback: BehaviorSubject<User>;

  form: FormGroup;

  submitted: boolean;

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    console.log(this.user);
    this.form = this.fb.group({
      name: this.fb.control(this.user.fullName, Validators.required),
      username: this.fb.control(this.user.username, Validators.required),
      status: this.fb.control(this.user.status),
      role: this.fb.control(this.user.role)
    });
  }
  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    this.submitted = true;
    if (valid) {
      if (this.user.id) {
        this.rest.update("api/user/" + this.user.id, value)
          .subscribe(re => {
            this.activeModal.close();
            this.callback.next(re);
          });
      } else {
        this.rest.create("api/user", value).subscribe(re => {
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
