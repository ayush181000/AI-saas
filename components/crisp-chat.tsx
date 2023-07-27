'use client';

import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('3c0f0c5c-c5bc-4b28-ba4a-35e97a53309e');
  }, []);

  return null;
};

export default CrispChat;
