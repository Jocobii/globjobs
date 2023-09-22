import CryptoJS from 'crypto-js';
import { base64Encode } from '@/utils/base64';

interface Details {
  expiryDate: Date,
  orderNumber: string,
}

const licenseVersion = '1';
export function getClearLicenseString(details: Details) {
  return `ORDER:${
    details.orderNumber
  },EXPIRY=${details.expiryDate.getTime()},KEYVERSION=${licenseVersion}`;
}

export function generateLicence(details: Details) {
  const clearLicense = getClearLicenseString(details);
  return `${CryptoJS.MD5(base64Encode(clearLicense))}${base64Encode(clearLicense)}`;
}

const nonExpiringDate = new Date();
nonExpiringDate.setDate(nonExpiringDate.getDate() + 30);
export const MuiLicense = generateLicence({
  expiryDate: new Date(nonExpiringDate.getTime()),
  orderNumber: 'MUI-123',
});
