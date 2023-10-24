import * as crypto from 'crypto';
import { hasher, jwt } from './index';
import axios from './axios';
import {
  capitalizeFirstLetter, splitOnCapitalLetter,
  pipe, normalizeKeyName,
} from './format';

const { isValidToken, setSession } = jwt;
const { hashPassword, hashGooglePassword } = hasher;
describe('hashPassword', () => {
  const input = 'password123';
  it('should hash input string using SHA256 algorithm', () => {
    const expectedOutput = crypto.createHash('sha256').update(input).digest('hex');
    expect(hashPassword(input)).toEqual(expectedOutput);
  });
  it('should hash input string using SHA1 algorithm', () => {
    const expectOutput = crypto.createHash('sha1').update(input).digest('hex');
    expect(hashGooglePassword(input)).toEqual(expectOutput);
  });
});

describe('capitalizeFirstLetter', () => {
  it('should capitalize first letter of a string', () => {
    const input = 'test';
    const expectedOutput = 'Test';
    expect(capitalizeFirstLetter(input)).toEqual(expectedOutput);
  });
  it('should split string on capital letter', () => {
    const input = 'testString';
    const expectedOutput = 'test string';
    expect(splitOnCapitalLetter(input)).toEqual(expectedOutput);
  });

  it('should be exec multiple functions', () => {
    const input = 'testString';
    const expectedOutput = 'Test string';
    expect(pipe(splitOnCapitalLetter, capitalizeFirstLetter)(input)).toEqual(expectedOutput);
  });

  it('should normalize key name in sentence format', () => {
    const input = 'testString';
    const expectedOutput = 'Test string';
    expect(normalizeKeyName(input)).toEqual(expectedOutput);
  });
});
describe('jwt', () => {
  const validAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRmVybmFuZGEgTW9saW5hIiwiaWF0IjoxNjgyMTIwNzYwLCJleHAiOjI1MzE0NDI5MjZ9.uUYrJwBGzUKHySKxwmxKs9qEEl5cmcPOtjK7DO26EeM';
  it('should set session with valid access token', () => {
    setSession(validAccessToken);
    expect(localStorage.getItem('accessToken')).toBe(validAccessToken);
    expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${validAccessToken}`);
  });
  it('Should set session with invalid access token', () => {
    const accessToken = null;
    setSession(accessToken);
    expect(localStorage.getItem('accessToken')).toBe(null);
    expect(axios.defaults.headers.common['Authorization']).toBe(undefined);
  });

  it('Should remove nonexistent access token', () => {
    localStorage.removeItem('accessToken');
    setSession(null);
    expect(() => setSession(null)).not.toThrow();
  });

  it('Should be return true if is valid token', () => {
    const isValid = isValidToken(validAccessToken);
    expect(isValid).toBe(true);
  });
  it('Should be return false if is invalid token', () => {
    const isValid = isValidToken('');
    expect(isValid).toBe(false);
  });
});
