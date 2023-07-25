'use client';

import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatCompletionRequestMessage } from 'openai';
import ReactMarkdown from 'react-markdown';

import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/empty';
import Loader from '@/components/loader';

import { formSchema } from './constants';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/user-avatar';
import BotAvatar from '@/components/bot-avatar';

const testingMessages: ChatCompletionRequestMessage[] = [
  {
    role: 'user',
    content: 'Simple toggle button using react hooks',
  },
  {
    role: 'assistant',
    content: `Sure! Below is an example of a simple toggle button using React hooks:
    
    \`\`\`
    import React, { useState } from 'react';

    const ToggleButton = () => {
    const [isToggled, setToggle] = useState(false);

    const handleToggle = () => {
      setToggle((prevState) => !prevState);
    };

    return (
      <button onClick={handleToggle}>
        {isToggled ? 'ON' : 'OFF'}
    </button>
    );
  };

  export default ToggleButton;

\`\`\`

    In this example, we use the useState hook to manage the state of the toggle button. The isToggled variable holds the current state (either true for 'ON' or false for 'OFF'), and the setToggle function is used to update the state when the button is clicked.
    
    When the button is clicked, the handleToggle function is called, which uses the setToggle function to toggle the state between true and false. The button text will change accordingly based on the current state, showing either 'ON' or 'OFF'.
    `,
  },
];

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] =
    useState<ChatCompletionRequestMessage[]>(testingMessages);

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
      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/code', {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);
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
        title='Code Generation'
        description='Generate code using descriptive text'
        icon={Code}
        iconColor='text-green-700'
        bgColor='bg-green-700/10'
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
                        placeholder='Simple toggle button using react hooks.'
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
                Generate (as API is paid, this is just a demo)
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
          {messages.length === 0 && !isLoading && (
            <Empty label='No conversation started' />
          )}
          {/* Messages Content */}
          <div className='flex flex-col-reverse gap-y-4'>
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'bg-white border border-black/10'
                    : 'bg-muted'
                )}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  className='text-sm overflow-hidden leading-7'
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className='bg-black/10  rounded-lg p-1'
                        {...props}
                      />
                    ),
                  }}
                >
                  {message.content || ''}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;