'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthModal from './AuthModal';

export default function AuthModalWrapper() {
  const searchParams = useSearchParams();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if auth=required parameter exists
    if (searchParams.get('auth') === 'required') {
      setShowAuthModal(true);
    }
  }, [searchParams]);

  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      initialTab="login"
    />
  );
}
