'use client';

import axios from 'axios';
import { Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({
  isPro = false,
}: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stripe');

      window.location.href = response.data.url;
    } catch (error: any) {
      console.log('BILLING_ERROR', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isPro ? 'default' : 'premium'}
      onClick={onClick}
      disabled={loading}
    >
      {isPro ? 'Manage Subscriptions' : 'Upgrade'}
      {!isPro && <Zap className='h-4 w-4 ml-2 fill-white' />}
    </Button>
  );
};
