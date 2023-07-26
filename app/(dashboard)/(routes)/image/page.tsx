'use client';

import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Heading from '@/components/heading';
import { Empty } from '@/components/empty';
import Loader from '@/components/loader';

import { amountOptions, formSchema, resolutionOptions } from './constants';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import DemoAlert from '@/components/demo-alert';
import { useProModal } from '@/hooks/use-pro-modal';

// prompt: 'spider man 2099 8k wallpaper';
const testingImages: string[] = [
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-ppsBDKjkfJ7qNLL822Z9uiQj/user-fVWP0tb2YELimSabCqCP7oEM/img-DlpQaHnPBrTlzY9SthQs3YtP.png?st=2023-07-26T03%3A07%3A04Z&se=2023-07-26T05%3A07%3A04Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-25T14%3A49%3A53Z&ske=2023-07-26T14%3A49%3A53Z&sks=b&skv=2021-08-06&sig=FGyr5769I50QDtTJtxHp0NEyw6a6ZsEmi8GbAdPnvYU%3D',
];

const ImagePage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [images, setImages] = useState<string[]>([]);
  const [demo, setDemo] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      amount: '1',
      resolution: '512x512',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setImages([]);

    try {
      const response = await axios.post('/api/image', values);
      const urls = response.data.map((image: { url: string }) => image.url);
      setImages(urls);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        // setting pre fetched results
        setDemo(true);
        setImages(testingImages);
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title='Image Generation'
        description='Our most advanced conversation model'
        icon={ImageIcon}
        iconColor='text-pink-700'
        bgColor='bg-pink-700/10'
      />
      {demo && <DemoAlert />}
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='rounded-lg 
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
                  <FormItem className='col-span-12 lg:col-span-6'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='A picture of a horse in Swiss alps'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name='amount'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-2'>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name='resolution'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-6'>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            <div className='p-20'>
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <Empty label='No images generated' />
          )}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
            {images.map((src) => (
              <Card key={src} className='rounded-lg overflow-hidden'>
                <div className='relative aspect-square'>
                  <Image fill alt='Image' src={src} />
                </div>
                <CardFooter className='p-2'>
                  <Button
                    onClick={() => window.open(src)}
                    variant='secondary'
                    className='w-full'
                  >
                    <Download className='h-4 w-4 mr-2' />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
