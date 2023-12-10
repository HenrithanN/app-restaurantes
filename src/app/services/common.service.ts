import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlterarSenhaRequest, loginRequest } from '../interfaces/loginInterface';
import { ModalService } from './modal.service';
import { AlterarRestauranteRequest } from '../interfaces/restaurante';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient, private myModal: ModalService) { }

  EfetuarLogin(inBody: loginRequest){
    this.myModal.loader = true;
    return this.http.post(`${this.API_URL}/login/autenticar`, inBody);
  }

  BuscarUmUsuario(inBody: loginRequest){
    return this.http.post(`${this.API_URL}/usuario/listarUm`, inBody);
  }

  AlterarSenha(inBody: AlterarSenhaRequest){
    this.myModal.loader = true;
    return this.http.post(`${this.API_URL}/login/alterarSenha`, inBody);
  }

  ListarRestaurantes(){
    this.myModal.loader = true;
    return this.http.get(`${this.API_URL}/restaurante/listarTodos`);
  }

  AlterarRestaurante(inBody: AlterarRestauranteRequest){
    this.myModal.loader = true;
    return this.http.post(`${this.API_URL}/restaurante/atualizar`, inBody);
  }

  ListarProdutosPorRestaurante(idRestaurante: number){
    this.myModal.loader = true;
    return this.http.get(`${this.API_URL}/produto/listarProdutoPorIdRestaurante/${idRestaurante}`);
  }
}
