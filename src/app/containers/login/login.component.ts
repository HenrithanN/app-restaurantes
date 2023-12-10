import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ModalService } from 'src/app/services/modal.service';
import { UtilsService } from 'src/app/services/utils.service';
import { StorageService as storage }  from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private myCommon: CommonService, public myModal: ModalService, private myUtils: UtilsService) { }

  formLogin!: FormGroup;
  modalContent: string = '';

  ngOnInit(): void {
    this.buildFormLogin();
  }

  buildFormLogin(){
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]]
    })
  }
  async efetuarLogin(){
    if(this.formLogin.invalid){
      this.formLogin.markAllAsTouched();
      this.myModal.showModalMessage('Existem campos inválidos!')
      return;
    }

    const in_body = {
      email: this.formLogin.value.email,
      senha: this.formLogin.value.senha
    }
    console.log('in', in_body)
    const dadosEfetuarLogin$ = await this.myCommon.EfetuarLogin(in_body).toPromise()
    .then((dadosEfetuarLogin) => dadosEfetuarLogin)
    .catch((errorEfetuarLogin) => errorEfetuarLogin)

    this.myModal.loader = false;
    if(this.myUtils.RequisicaoPossuiErro(dadosEfetuarLogin$)){
      this.myModal.modalContent = this.myUtils.verificacaoDeErro(dadosEfetuarLogin$);
      this.myModal.showModalMessage();
    }else{
      await this.buscarInformacoesUsuarioLogado(in_body.email);
    }
  }

  async buscarInformacoesUsuarioLogado(email: string){
    const in_body = {
      email: email,
      senha:''
    }

    const dadosUsuarioLogado$ = await this.myCommon.BuscarUmUsuario(in_body).toPromise()
    .then((dados_UsuarioLogado) => dados_UsuarioLogado)
    .catch((error_UsuarioLogado) => error_UsuarioLogado)

    if(this.myUtils.RequisicaoPossuiErro(dadosUsuarioLogado$)){
      this.myModal.modalContent = this.myUtils.verificacaoDeErro(dadosUsuarioLogado$);
      this.myModal.showModalMessage();
    }else{
      storage.save('UsuarioLogado', 'true');
      const dadosUsuarioLogado = {
        Nome: dadosUsuarioLogado$.NOME
      }
      storage.save('DadoUsuarioLogado', dadosUsuarioLogado)
      this.router.navigate(['/principal']);
    }
  }
}
