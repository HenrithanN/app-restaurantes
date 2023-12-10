export interface Restaurante {
  IDRESTAURANTE: number
  NOME: string
  DESCRICAO: string
  NOTA: string
  TEMPOENTREGA: string
  VALORENTREGA: string
  IMAGEM: any
}

export interface AlterarRestauranteRequest {
    id: number
    nome: string
    descricao: string
    nota: string
    tempoEntrega: string
    valorEntrega: string
    imagem: string
}
