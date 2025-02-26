// src/utils/error-handler.ts
import { CustomBadException } from './error-handler';
import { HttpStatus } from '@nestjs/common';

const simplifyStackTrace = (stack: string): string[] => {
  return stack
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('at '))
    .map((line) => {
      const match = line.match(/\((.*)\)/);
      if (match) {
        // Extract the file path within the parentheses
        return match[1];
      }
      // If there's no match, return the line as is (or process differently if needed)
      return line.replace(/^at\s+/, '');
    });
};
/**
 * Utility function to handle a promise and throw a custom exception on error.
 * @param promise A promise to be resolved.
 * @returns An object containing the resolved data.
 * @throws CustomBadException if the promise is rejected.
 */
export async function handlePromise<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error: any) {
    const message = error.message || 'An unexpected error occurred';
    const stack = simplifyStackTrace(error.stack || 'No stack trace available');
    const deepNestedMessage = error?.errors?.[0]?.message;
    if (deepNestedMessage) {
      throw new CustomBadException(
        deepNestedMessage,
        HttpStatus.BAD_REQUEST,
        stack,
      );
    }
    throw new CustomBadException(message, HttpStatus.BAD_REQUEST, stack);
  }
}
