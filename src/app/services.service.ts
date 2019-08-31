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
            console.log(this.uid);
          }
        }
      );
  }

  get_all_files(uid) {
    this.itemsCollection = this.afs.collection<any>(uid);

    return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.files = [];

      for (const infos of info) {
        this.files.unshift(infos);
      }
      console.log(this.files);
      return this.files;
    }));
  }

  upload(url , name, type) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(this.uid).add({
        url: url,
        name: name,
        type: type,
        uid: this.uid,
        date: Date.now()
      });
    });
  }

}
