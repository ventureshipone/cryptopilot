import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface TOTPQRCodeProps {
  secret: string;
  account: string;
  issuer: string;
  size?: number;
}

export function TOTPQRCode({ secret, account, issuer, size = 200 }: TOTPQRCodeProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Create a proper otpauth URL
        const label = encodeURIComponent(`${issuer}:${account}`);
        const params = `secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
        const totpUri = `otpauth://totp/${label}?${params}`;
        
        // Generate QR code
        const url = await QRCode.toDataURL(totpUri, {
          width: size,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
        setError('Failed to generate QR code');
        setLoading(false);
      }
    };

    generateQRCode();
  }, [secret, account, issuer, size]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <img 
        src={qrUrl} 
        alt={`QR code for ${account}`} 
        width={size} 
        height={size} 
        className="border border-gray-700 rounded p-1 bg-white"
      />
    </div>
  );
}