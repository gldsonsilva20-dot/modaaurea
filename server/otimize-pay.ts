import axios from "axios";
import { ENV } from "./_core/env";

const API_BASE_URL = "https://api.otimizepagamentos.com/v1";

// Criar header de autenticação Basic
function getAuthHeader() {
  const credentials = `${ENV.otimizePaySecretKey}:x`;
  const encoded = Buffer.from(credentials).toString("base64");
  return {
    authorization: `Basic ${encoded}`,
    "Content-Type": "application/json",
  };
}

export interface CreateTransactionPayload {
  amount: number; // em centavos
  paymentMethod: "credit_card" | "boleto" | "pix";
  customer: {
    name: string;
    email: string;
    phone?: string;
    document?: {
      type: "cpf" | "cnpj";
      number: string;
    };
    address?: {
      street: string;
      streetNumber: string;
      complement?: string;
      zipCode: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
    };
  };
  items: Array<{
    title: string;
    unitPrice: number; // em centavos
    quantity: number;
    tangible?: boolean;
  }>;
  card?: {
    holderName: string;
    number: string;
    expirationMonth: number;
    expirationYear: number;
    cvv: string;
  };
  installments?: number;
  shipping?: {
    name: string;
    phone: string;
    address: {
      street: string;
      streetNumber: string;
      complement?: string;
      zipCode: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
    };
  };
  postbackUrl?: string;
  metadata?: string;
  traceable?: boolean;
  ip?: string;
}

export interface TransactionResponse {
  id: number;
  amount: number;
  refundedAmount: number;
  installments: number;
  paymentMethod: string;
  status: "pending" | "paid" | "refused" | "refunded";
  secureId: string;
  secureUrl: string;
  createdAt: string;
  paidAt?: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    document: {
      number: string;
      type: string;
    };
  };
  card?: {
    brand: string;
    holderName: string;
    lastDigits: string;
  };
  items: Array<{
    title: string;
    unitPrice: number;
    quantity: number;
  }>;
  metadata?: string;
}

/**
 * Criar uma transação na Otimize Pay
 */
export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<TransactionResponse> {
  try {
    const response = await axios.post<TransactionResponse>(
      `${API_BASE_URL}/transactions`,
      payload,
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[Otimize Pay] Error creating transaction:", error.response?.data);
      throw new Error(`Otimize Pay Error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Buscar uma transação na Otimize Pay
 */
export async function getTransaction(transactionId: number): Promise<TransactionResponse> {
  try {
    const response = await axios.get<TransactionResponse>(
      `${API_BASE_URL}/transactions/${transactionId}`,
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[Otimize Pay] Error fetching transaction:", error.response?.data);
      throw new Error(`Otimize Pay Error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Estornar uma transação
 */
export async function refundTransaction(
  transactionId: number,
  amount?: number
): Promise<TransactionResponse> {
  try {
    const response = await axios.post<TransactionResponse>(
      `${API_BASE_URL}/transactions/${transactionId}/refund`,
      amount ? { amount } : {},
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[Otimize Pay] Error refunding transaction:", error.response?.data);
      throw new Error(`Otimize Pay Error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Listar transações
 */
export async function listTransactions(limit: number = 100, offset: number = 0) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transactions?limit=${limit}&offset=${offset}`,
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[Otimize Pay] Error listing transactions:", error.response?.data);
      throw new Error(`Otimize Pay Error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}
