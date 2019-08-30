import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Route, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  files: any[] = [];
  private itemsCollection: AngularFirestoreCollection<any>;
  uid: string;

  constructor(public afs: AngularFirestore, public rout: Router, public aut: AngularFireAuth) {
    this.logueado();
   }

  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (!user) {
          } else {
            this.uid = user.uid;
          }
        }
      );
  }

  get_all_files() {
    this.itemsCollection = this.afs.collection<any>(this.uid);

    return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.files = [];

      for (const infos of info) {
        this.files.unshift(infos);
      }

      return this.files;
    }));
  }

}
