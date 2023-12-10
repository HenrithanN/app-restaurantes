export interface loginRequest{
  email: string,
  senha: string
}

export interface AlterarSenhaRequest{
  email: string,
  senha: string,
  senhaConfirmacao: string,
}
