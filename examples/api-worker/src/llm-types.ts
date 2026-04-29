export interface LLMParseBlock {
  simplifiedPhrase: string;
  extractedClaim: string;
  extractedEntity?: string;
  isIdentityAttempt: boolean;
  confidence: number;
}

export interface LLMParseResponse {
  blocks: LLMParseBlock[];
  usage?: {
    inTokens: number;
    outTokens: number;
  };
}

export interface LLMAnswerResponse {
  answer: string;
  newHintFacts: string[];
  usage?: {
    inTokens: number;
    outTokens: number;
  };
}

export type AskRouteResponse =
  | { type: "need_input" }
  | { type: "need_choice"; blocks: LLMParseBlock[] }
  | { type: "answer"; block: LLMParseBlock; answer: string }
  | { type: "guess_result"; block: LLMParseBlock; isCorrect: boolean };
