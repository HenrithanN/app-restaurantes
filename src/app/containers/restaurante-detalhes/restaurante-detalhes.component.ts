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
  formAdicionarProduto!: FormGroup;
  listaProdutos: Produto[] = [];

  flgAdicionarProduto: boolean = false;
  ngOnInit(): void {
    const restauranteSelecionadoStorage = storage.get('restauranteSelecionado');
    if(restauranteSelecionadoStorage){
      this.restauranteSelecionado = restauranteSelecionadoStorage;
      this.buildFormAlterarRestaurante();
      this.buildFormAdicionarProduto();
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
      let quantidadeSegundosRedirect = 10;
      this.myModal.modalContent = `As informações do Restaurante ${this.restauranteSelecionado.NOME} foram atualizadas com Sucesso! <br />
          Você será redirecionado para a tela de Restaurantes em (${quantidadeSegundosRedirect}) segundos.`
      this.myModal.showModalMessage();

      setInterval(()=>{
        if(quantidadeSegundosRedirect > 0){
          quantidadeSegundosRedirect --
          this.myModal.modalContent = `As informações do Restaurante ${this.restauranteSelecionado.NOME} foram atualizadas com Sucesso! <br />
          Você será redirecionado para a tela de Restaurantes em (${quantidadeSegundosRedirect}) segundos.`
        }else{
          this.myModal.closeModal();
          this.router.navigate(['/principal'])
        }
      }, 1000);

    }
  }

  showAdicionarProduto(){
    const cardCadastroProduto = window.document.getElementById('cardProduto');
    if(!this.flgAdicionarProduto){
      if(cardCadastroProduto){
        cardCadastroProduto.classList.add('cardStyleCadastro');
        cardCadastroProduto.classList.remove('cardStyle');
      }
      this.flgAdicionarProduto = true;
    }
  }

  closeAdicionarProduto(){
    const cardCadastroProduto = window.document.getElementById('cardProduto');
    if(this.flgAdicionarProduto){
      if(cardCadastroProduto){
        cardCadastroProduto.classList.add('cardStyle');
        cardCadastroProduto.classList.remove('cardStyleCadastro');
      }
      this.flgAdicionarProduto = false;
      this.formAdicionarProduto.reset();
    }
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

  buildFormAdicionarProduto(){
    this.formAdicionarProduto = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: ['', Validators.required],
      imagem: ['', Validators.required],
      idRestaurante: [this.restauranteSelecionado.IDRESTAURANTE]
    })
  }

  async adiconarProduto(){
    if(this.formAdicionarProduto.invalid){
      this.formAdicionarProduto.markAllAsTouched();
      this.myModal.showModalMessage('Existem dados inválidos!');
      return;
    }

    const in_body = this.formAdicionarProduto.getRawValue();
    const dadosAdicionarProduto$ = await this.myCommon.AdicionarProduto(in_body).toPromise()
    .then((dadosAdicionarProduto) => dadosAdicionarProduto)
    .catch((errorAdicionarProduto) => errorAdicionarProduto)

    if(this.myUtils.RequisicaoPossuiErro(dadosAdicionarProduto$)){
      this.myModal.modalContent = this.myUtils.verificacaoDeErro(dadosAdicionarProduto$);
      this.myModal.showModalMessage();
    }else{
      this.closeAdicionarProduto()
      await this.listarProdutosPorRestaurante();
      this.myModal.loader = false;
    }
  }
}
