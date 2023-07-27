import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

const DAY_IN_MS = 86_400_400;

export const checkSubscription = async () => {
  const { userId } = auth();

  // No authenticated user present
  if (!userId) return false;

  const userSubsription = await prismadb.userSubscription.findUnique({
    where: { userId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  // No active subscrioptions
  if (!userSubsription) return false;

  const isValid =
    userSubsription.stripePriceId &&
    userSubsription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};
