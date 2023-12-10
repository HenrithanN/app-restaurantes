import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { StorageService as storage }  from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  readonly tipos_pontuacoes_remover: string[] = ['.', ',', '-', '/'];
  readonly erroGenerico: string = 'Ocorreu um erro inesperado!';

  constructor(private location: Location){}

  RetornaUsuarioLogado(){
    const flagUsuarioLogado = storage.get('UsuarioLogado');
    if(flagUsuarioLogado){
      return true;
    }
    return false;
  }

  IsNullOrEmpty(string_verificacao: string){
    if(string_verificacao == null || string_verificacao == ''){
      return true
    }
    return false;
  }

  buscaCampoNoArray(array_pesquisa: any[], valor_comparacao: any, campo_comparacao: string, campo_desejado: string){

    for (const item_pesquisado of array_pesquisa) {
      if(item_pesquisado[campo_comparacao] == valor_comparacao){
        return item_pesquisado[campo_desejado]
      }
    }
  }

  RequisicaoPossuiErro(response: any): boolean{
    if(response['error'] || response['CodigoErro'] || response['status'] >= 400){
      return true
    }
    return false;
  }

  verificacaoDeErro(error: any){
    let error_message: string = ''
    if(error.error){
      error_message =  this.returnError(error.error)
    }else{
      error_message = this.returnError(error)
    }
    return error_message;
  }

  private returnError(error: any){
    let error_message = '';
    if(error.error_description){
      error_message = error.error_description
    }
    else if(error['DetalhesAdicionais']){
      error_message = this.returnDetalhesAdicionaisErro(error['Mensagem'], error['DetalhesAdicionais'])
    }
    else if(error['Mensagem']){
      error_message = error['Mensagem']
    }else{
      error_message = this.erroGenerico
    }

    return error_message;
  }

  private returnDetalhesAdicionaisErro(message: string, error: string[]){
    let message_error = message
    for (const detalhe_erro of error) {
      message_error += '<br/>'
      message_error += detalhe_erro
    }
    return message_error
  }

  returnToLastPage(){
    this.location.back();
  }
}
