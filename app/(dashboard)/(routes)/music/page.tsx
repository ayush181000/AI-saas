'use client';

import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Music } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatCompletionRequestMessage } from 'openai';

import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/empty';
import Loader from '@/components/loader';

import { formSchema } from './constants';

const testingMessages: ChatCompletionRequestMessage[] = [
  { role: 'user', content: 'What is the radius of the sun' },
  {
    role: 'assistant',
    content:
      'The radius of the Sun is approximately 696,340 kilometers (about 432,687 miles).',
  },
  { role: 'user', content: 'How much hot is sun' },
  {
    role: 'assistant',
    content:
      "The Sun is incredibly hot. Its core temperature is estimated to be around 15 million degrees Celsius (27 million degrees Fahrenheit). The temperature at the surface of the Sun, known as the photosphere, is relatively cooler at about 5,500 degrees Celsius (9,932 degrees Fahrenheit). Despite the lower temperature at the surface, it's still incredibly hot compared to anything we experience here on Earth. The Sun's intense heat is what enables it to generate the energy that sustains life on our planet and drives the various processes in our solar system.",
  },
];

const MusicPage = () => {
  const router = useRouter();
  const [music, setMusic] = useState<string>();

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
      setMusic(undefined);

      const response = await axios.post('/api/music', values);

      setMusic(response.data.audio);
      form.reset();
    } catch (error: any) {
      //TODO: Open Pro Modal
      console.log('Error ------> ', error.message);
      // setMessages(testingMessages);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title='Music Generation'
        description='Turn your prompt into music'
        icon={Music}
        iconColor='text-emerald-500'
        bgColor='bg-emerald-500/10'
      />
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
                        placeholder='Piano solo'
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
          {!music && !isLoading && <Empty label='No music generated' />}
          {/* Music Content */}
          {music && (
            <audio controls className='w-full mt-8'>
              <source src={music} />
            </audio>
          )}
          <div>Music will be generated here </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
