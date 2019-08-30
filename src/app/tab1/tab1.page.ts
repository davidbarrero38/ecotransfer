import { Component , ElementRef, ViewChild  } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { ServicesService } from '../services.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('imageProd') inputimageProd: ElementRef;

  nombre: string;
  anuncio: string;
  id: string;
  precio: Number;
  telf: Number;
  cargando = false;
  @ViewChild('filechooser') fileChooserElementRef: ElementRef;

  uploadPercent: Observable<number>;
  urlImage: Observable<string>;


    constructor(private afs: AngularFireStorage,
      private service: ServicesService  , public loadingController: LoadingController , private aut: AngularFireAuth,
      public actionSheetController: ActionSheetController, private router: Router) {

      }

  async signOut() {
    const res = await this.aut.auth.signOut();
    console.log(res);
    this.router.navigateByUrl('/login');
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{
        text: 'Logout',
        icon: 'exit',
        handler: () => {
          this.signOut();
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }



  moveFocus(nextElement) {
    nextElement.setFocus();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading file',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  onUpload(e) {
    console.log(e.target.files[0]);

    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `image/pic_${id}`;
    const ref = this.afs.ref(filePath);
    const task = this.afs.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.presentLoading();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }

  agregar(nombre, anuncio, precio, telf) {
    const image = this.inputimageProd.nativeElement.value;
    const data = {
      nombre: nombre,
      anuncio: anuncio,
      precio: precio,
      telefono: telf,
      img: image
    };
    console.log(data);
  }
}
