export interface TranslationPair {
  id: number;
  en: string;
  ar: string;
  arVerified: string;
  verified: boolean;
}

export interface CSVData {
  text: string;
  textVerified?: string;
  verified?: boolean;
}