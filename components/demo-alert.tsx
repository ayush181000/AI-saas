import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const DemoAlert = () => {
  return (
    <Alert variant='destructive' className='m-8 w-200'>
      <Terminal className='h-4 w-4' />
      <AlertDescription>
        As the website depends upon OpenAI and Replicate API which is paid,
        pre-fetched results are shown here
      </AlertDescription>
    </Alert>
  );
};

export default DemoAlert;
