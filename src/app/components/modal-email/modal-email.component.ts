import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ModalService } from 'src/app/services/modal.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-modal-email',
  templateUrl: './modal-email.component.html',
  styleUrls: ['./modal-email.component.css']
})
export class ModalEmailComponent implements OnInit {

  formAlterarSenha!: FormGroup;
  erroSenhasDiferentes: boolean = false;
  tentouEnviarFormInvalido: boolean = false;
  constructor(private myUtils: UtilsService, private myCommon: CommonService, public myModal: ModalService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildFormAlterarSenha();
  }

  verificaSeSenhasSaoIguais(senha: string, senhaConfirmacao: string){
    if(senha != senhaConfirmacao){
      this.erroSenhasDiferentes = true;
    }else{
      this.erroSenhasDiferentes = false;
    }
  }

  async alterarSenha(){
    if(this.formAlterarSenha.invalid || this.erroSenhasDiferentes){
      this.tentouEnviarFormInvalido = true;
      this.formAlterarSenha.markAllAsTouched();
      return;
    }

    const in_body = {
      email: this.formAlterarSenha.value.email,
      senha: this.formAlterarSenha.value.senha,
      senhaConfirmacao: this.formAlterarSenha.value.confirmaSenha
    }
    const dadosAlterarSenha$ = await this.myCommon.AlterarSenha(in_body).toPromise()
    .then((dados_AlterarSenha) => dados_AlterarSenha)
    .catch((error_AlterarSenha) => error_AlterarSenha)

    this.formAlterarSenha.reset();
    if(this.myUtils.RequisicaoPossuiErro(dadosAlterarSenha$)){
      this.myModal.closeModalEmail();
      this.myModal.modalContent = this.myUtils.verificacaoDeErro(dadosAlterarSenha$);
      this.myModal.showModalMessage()
    }else{
      this.myModal.closeModalEmail();
      this.myModal.showModalMessage('Senha alterada com Sucesso!')
    }

  }

  buildFormAlterarSenha(){
    this.formAlterarSenha = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      confirmaSenha: ['', [Validators.required, Validators.minLength(3)]],
    })
  }
}
