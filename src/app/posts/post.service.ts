import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postsCollection: AngularFirestoreCollection<Post>
  postDoc: AngularFirestoreDocument<Post>

  constructor(private afs: AngularFirestore) {
    this.postsCollection = this.afs.collection(`${environment.firebase.storagePath}`, ref =>
          ref.orderBy('published', 'desc'))
  }

  getPosts() {
    return this.postsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Post
        const id = a.payload.doc.id
        return {id, ...data}
      })
    })
  }

  getPostData(id: string) {
    this.postDoc = this.afs.doc<Post>(`${environment.firebase.storagePath}/${id}`)
    return this.postDoc.valueChanges()
  }

  create(data: Post) {
    this.postsCollection.add(data)
  }

  getPost(id: string) {
    return this.afs.doc<Post>(`${environment.firebase.storagePath}/${id}`)
  }

  delete(id: string) {
    return this.getPost(id).delete()
  }

  update(id: string, formData){
    return this.getPost(id).update(formData)
  }
}
