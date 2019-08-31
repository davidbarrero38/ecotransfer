import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { ServicesService } from '../services.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';


import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('imageProd') inputimageProd: ElementRef;
  @ViewChild('filechooser') fileChooserElementRef: ElementRef;

  uploadPercent: Observable<number>;
  urlImage: Observable<string>;

  fileTransfer: FileTransferObject;

  file2: string;
  files = [];
  type: string;
  uid: string;


  constructor(private afs: AngularFireStorage,
    public service: ServicesService,
    public loadingController: LoadingController,
    private aut: AngularFireAuth,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    private fileChooser: FileChooser,
    public actionSheetController: ActionSheetController,
    private router: Router) {
  }
  ngOnInit() {
    this.logueado();
    setTimeout(() => {
      this.getfiles();
    }, 1500);
  }

  async signOut() {
    const res = await this.aut.auth.signOut();
    console.log(res);
    this.router.navigateByUrl('/login');
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


  getfiles() {
    this.service.get_all_files(this.uid).subscribe((data: any) => {
      console.log(data);
      this.files = data;
    });
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
    const filePath = `${id}`;
    const ref = this.afs.ref(filePath);
    const task = this.afs.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.presentLoading();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
    console.log(file.name, file.type);
    this.file2 = file.name;
    this.type = file.type;
  }

  agregar() {
    const image = this.inputimageProd.nativeElement.value;

    this.service.upload(image, this.file2, this.type);
  }

  donwload(url) {
    console.log(url);
    this.fileTransfer.download(url, this.file.externalRootDirectory + 'Download').then((data) => {
      alert('Descarga Exitosa');
    });
  }


}
