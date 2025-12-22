export enum EnumStatusPayment {
  Solicitado, //inicia o processo de pagamento
  Aprovado, //Foi efetuado o pagamento e aprovado pela Adyen
  Recusado, //Foi efetuado o pagamento e recusado pela Adyen
  Reembolsado, // adyen aprovou o reembolso
  Pendente, // Rotulo pendente de pgto, foi cadastrado pela cervejaria mas ainda não efetuado o pagamento
  Cancelado, //Entra no estado cancelado no periodo de espera entre a solicitação de reembolso e a resposta da Adyen
  Aguardando_Confirmacao, // Transição entre a confirmacao do pgto e o retorno da Adyen
  Aguardando_Confirmacao_Reembolso, // Transição entre a confirmacao do reembolso e o retorno da Adyen
  ReembolsoNaoAutorizado, // Reembolso não autorizado
}

export enum EnumUserTypes {
  Default = 0,
  Admin = 1,
  Operator = 2,
  Influencer = 3,
  Agent = 4,
  Other = 5,
}
