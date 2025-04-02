export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown): APIError => {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError(error.message);
  }

  return new APIError('An unexpected error occurred');
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'CLAUDE_API_ERROR':
        return 'The AI service is temporarily unavailable. Please try again later.';
      case 'INVALID_INPUT':
        return 'Please check your input and try again.';
      case 'RATE_LIMIT':
        return 'You\'ve reached the rate limit. Please wait a moment before trying again.';
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}; 