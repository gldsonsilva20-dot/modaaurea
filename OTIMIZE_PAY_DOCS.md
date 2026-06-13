# Documentação Otimize Pay

## Autenticação
- **Tipo**: Basic Access Authentication
- **Header**: `authorization: 'Basic ' + base64({SECRET_KEY}:x)`
- **URL Base**: https://api.otimizepagamentos.com/v1

## Criar Transação
**POST** `/transactions`

### Parâmetros Obrigatórios:
- `amount`: int32 - Valor em centavos (500 = R$ 5,00)
- `paymentMethod`: string - "credit_card", "boleto", "pix"
- `customer`: object - Dados do cliente
- `items`: array - Lista de itens da transação

### Parâmetros Opcionais:
- `card`: object - Informações do cartão (obrigatório se paymentMethod = "credit_card")
- `installments`: int32 - Quantidade de parcelas (obrigatório se paymentMethod = "credit_card")
- `shipping`: object - Dados de entrega
- `boleto`: object - Informações sobre expiração do boleto
- `pix`: object - Informações sobre expiração do PIX
- `postbackUrl`: string - URL para receber atualizações
- `metadata`: string - Metadados da transação
- `traceable`: boolean - Se o status de entrega será gerenciado pelo painel (padrão: false)
- `ip`: string - IP do cliente
- `splits`: array - Regras de divisão da transação

### Resposta de Sucesso (200):
```json
{
  "id": 282,
  "amount": 10000,
  "status": "paid",
  "paymentMethod": "credit_card",
  "secureId": "a4594817-be48-4a23-81aa-4bb01f95fe78",
  "secureUrl": "https://link.compra.com.br/pagar/a4594817-be48-4a23-81aa-4bb01f95fe78",
  "customer": {...},
  "card": {...},
  "items": [...],
  "createdAt": "2022-07-18T09:54:22.000Z",
  "paidAt": "2022-07-18T09:54:22.000Z"
}
```

## Postbacks/Webhooks
**URL**: postbackUrl fornecida ao criar transação

### Formato do Payload:
```json
{
  "id": 686401,
  "type": "transaction",
  "objectId": "282",
  "url": "https://test.com",
  "data": {
    "id": 282,
    "amount": 10000,
    "status": "paid",
    "paymentMethod": "credit_card",
    "metadata": null,
    "customer": {...},
    "card": {...},
    "items": [...],
    "createdAt": "2022-07-18T09:54:22.000Z",
    "paidAt": "2022-07-18T09:54:22.000Z"
  }
}
```

## Status Possíveis:
- `pending` - Aguardando pagamento
- `paid` - Pagamento confirmado
- `refused` - Pagamento recusado
- `refunded` - Reembolsado

## Métodos de Pagamento:
- `credit_card` - Cartão de crédito
- `boleto` - Boleto bancário
- `pix` - PIX

## Chaves Fornecidas:
- **Secret Key**: sk_live_v24isEI4MiAxs9qPUMOJFnEraks4M1VzTzCaGu3W0H
- **Public Key**: pk_live_v2NUgagxHch7WwiRx57gz059vAC7Fxc6d1
