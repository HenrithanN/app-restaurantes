import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  showModal:boolean = false;
  modalContent: string = '';


  showModalEmail: boolean = false;
  modalEmailContent: string = '';

  loader: boolean = false;
  openModalEmail(content?: string){
    this.loader = false;
    if(content){
      this.modalEmailContent = content;
    }
    this.showModalEmail = true;
  }

  closeModalEmail(){
    this.loader = false;
    this.showModalEmail = false;
  }

  showModalMessage(message?: string){
    this.loader = false;
    if(message){
      this.modalContent = message;
    }
    this.showModal = true;
  }

  closeModal(){
    this.loader = false;
    this.showModal = false;
    this.modalContent = '';
  }
}
