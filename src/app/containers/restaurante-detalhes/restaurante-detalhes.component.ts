import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Produto } from 'src/app/interfaces/produtoInterface';
import { Restaurante } from 'src/app/interfaces/restaurante';
import { CommonService } from 'src/app/services/common.service';
import { ModalService } from 'src/app/services/modal.service';
import { StorageService as storage }  from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-restaurante-detalhes',
  templateUrl: './restaurante-detalhes.component.html',
  styleUrls: ['./restaurante-detalhes.component.css']
})
export class RestauranteDetalhesComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private myCommon: CommonService, public myUtils: UtilsService, private myModal: ModalService) { }

  restauranteSelecionado!: Restaurante;
  formAlterarRestaurante!: FormGroup;
  listaProdutos: Produto[] = [];

  ngOnInit(): void {
    const restauranteSelecionadoStorage = storage.get('restauranteSelecionado');
    if(restauranteSelecionadoStorage){
      this.restauranteSelecionado = restauranteSelecionadoStorage;
      this.buildFormAlterarRestaurante();
      this.listarProdutosPorRestaurante()
    }else{
      this.router.navigate([''])
    }
  }

  async listarProdutosPorRestaurante(){
    const dadosListarProdutoPorRestaurante$ = await this.myCommon.ListarProdutosPorRestaurante(this.restauranteSelecionado.IDRESTAURANTE).toPromise()
    .then((dados_listaProdutoRestaurante) => dados_listaProdutoRestaurante)
    .catch((error_listaProdutoRestaurante) => error_listaProdutoRestaurante)

    if(this.myUtils.RequisicaoPossuiErro(dadosListarProdutoPorRestaurante$)){
      this.myModal.modalContent = this.myUtils.verificacaoDeErro(dadosListarProdutoPorRestaurante$);
      this.myModal.showModalMessage();
    }else{
      this.listaProdutos = dadosListarProdutoPorRestaurante$;
      this.myModal.loader = false;
    }
  }
  async atualizarRestaurante(){
    const in_body = this.formAlterarRestaurante.getRawValue();

    const dadosAtualizaRestaurante$ = await this.myCommon.AlterarRestaurante(in_body).toPromise()
    .then((dados_AtualizarRestaurante) => dados_AtualizarRestaurante)
    .catch((error_AtualizarRestaurante) => error_AtualizarRestaurante)

    if(this.myUtils.RequisicaoPossuiErro(dadosAtualizaRestaurante$)){
      this.myModal.modalContent = this.myUtils.verificacaoDeErro(dadosAtualizaRestaurante$);
      this.myModal.showModalMessage();
    }else{
      this.myModal.showModalMessage(`As informações do Restaurante ${this.restauranteSelecionado.NOME} foram atualizadas com Sucesso!`);
    }
  }

  async buscarUmRestaurante(){

  }

  buildFormAlterarRestaurante(){
    this.formAlterarRestaurante = this.fb.group({
      id: [this.restauranteSelecionado.IDRESTAURANTE],
      nome: [this.restauranteSelecionado.NOME, Validators.required],
      descricao: [this.restauranteSelecionado.DESCRICAO, Validators.required],
      nota: [this.restauranteSelecionado.NOTA, Validators.required],
      tempoEntrega: [this.restauranteSelecionado.TEMPOENTREGA, Validators.required],
      valorEntrega: [this.restauranteSelecionado.VALORENTREGA, Validators.required],
      imagem: [this.restauranteSelecionado.IMAGEM, Validators.required],
    })
  }
}
