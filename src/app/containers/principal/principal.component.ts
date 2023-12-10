import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ModalService } from 'src/app/services/modal.service';
import { UtilsService } from 'src/app/services/utils.service';
import { StorageService as storage }  from 'src/app/services/storage.service';
import { Restaurante } from 'src/app/interfaces/restaurante';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private myCommon: CommonService, private myUtils: UtilsService, private myModal: ModalService, private router: Router) { }

  listaRestaurantes: Restaurante[] = [];
  ngOnInit(): void {
    this.listarRestaurantes();
  }

  async listarRestaurantes(){
    const dadosListaRestaurantes$ = await this.myCommon.ListarRestaurantes().toPromise()
    .then((dadosListaRestaurantes) => dadosListaRestaurantes)
    .catch((error_listaRestaurantes) => error_listaRestaurantes);
    this.myModal.loader = false;

    if(this.myUtils.RequisicaoPossuiErro(dadosListaRestaurantes$)){
      this.myModal.modalContent = this.myUtils.verificacaoDeErro(dadosListaRestaurantes$);
      this.myModal.showModalMessage();
    }else{
      this.listaRestaurantes = dadosListaRestaurantes$;
    }
  }

  verDetalhesRestaurante(restaurante: any){
    storage.save('restauranteSelecionado', restaurante);
    this.router.navigate(['/restaurante-detalhes'])
  }
}
