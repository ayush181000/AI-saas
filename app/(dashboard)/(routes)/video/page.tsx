'use client';

import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatCompletionRequestMessage } from 'openai';

import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/empty';
import Loader from '@/components/loader';

import { formSchema } from './constants';
import DemoAlert from '@/components/demo-alert';
import { useProModal } from '@/hooks/use-pro-modal';

// prompt:Joker from batman dancing on batman grave
const testingVideo =
  'https://replicate.delivery/pbxt/2DyJC6tRNSIaDxlB9OYekt4rsVDnI8rWhRO0PHZnz6cV9vpIA/output-0.mp4';

const VideoPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [video, setVideo] = useState<string>();
  const [demo, setDemo] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      setVideo(undefined);

      const response = await axios.post('/api/video', values);

      setVideo(response.data[0]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        // setting pre fetched values
        setDemo(true);
        setVideo(testingVideo);
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title='Video Generation'
        description='Turn your prompt into a video'
        icon={Video}
        iconColor='text-orange-700'
        bgColor='bg-orange-700/10'
      />
      {demo && <DemoAlert />}
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='
            rounded-lg 
            border
            w-full
            p-4
            px-3
            md:px-6
            focus-within:shadow-sm
            grid
            grid-cols-12
            gap-2
            '
            >
              <FormField
                name='prompt'
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='Clown fish swimming around a coral reef'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className='col-span-12 lg:col-span-2 w-full'
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className='space-y-4 mt-4'>
          {isLoading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
              <Loader />
            </div>
          )}
          {!video && !isLoading && <Empty label='No video generated' />}
          {/* video Content */}
          {video && (
            <video
              controls
              className='w-full aspect-video mt-8 rounded-lg border bg-black'
            >
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
