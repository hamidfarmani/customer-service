export interface CustomerServiceResponse {
  messageType?: string;
  feedback?: {
    isPositive?: boolean;
    text?: string;
  };
  support?: {
    type?: string;
    bug?: {
      description?: string;
      severity?: string;
    };
    technicalQuestion?: {
      question?: string;
      answer?: string;
      links?: string[];
      answered?: boolean;
    };
  };
  error?: {
    message: string;
    code?: string;
  };
}
