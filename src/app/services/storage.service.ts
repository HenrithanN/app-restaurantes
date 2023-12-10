import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  static save(nomeItem: string, valor: any){
    sessionStorage.setItem(`@App-Restaurantes: ${nomeItem}`, JSON.stringify(valor));
  }

  static get(nomeItem: string){
    let valorStorage = null;
    const itemStorage = sessionStorage.getItem(`@App-Restaurantes: ${nomeItem}`);
    if(itemStorage){
      valorStorage = JSON.parse(itemStorage);
    }
    return valorStorage
  }

  static delete(nomeItem: string){
    sessionStorage.removeItem(`@App-Restaurantes: ${nomeItem}`);
  }

  static clear(){
    sessionStorage.clear();
  }
}
