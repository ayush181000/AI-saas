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
import { toast } from 'react-hot-toast';

import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/empty';
import Loader from '@/components/loader';
import UserAvatar from '@/components/user-avatar';
import BotAvatar from '@/components/bot-avatar';
import DemoAlert from '@/components/demo-alert';

import { formSchema } from './constants';
import { cn } from '@/lib/utils';
import { useProModal } from '@/hooks/use-pro-modal';

const testingMessages: ChatCompletionRequestMessage[] = [
  {
    role: 'user',
    content: 'Simple toggle button using react hooks',
  },
  {
    role: 'assistant',
    content:
      "Here is an example of a simple toggle button using ReactJS:\n\n```jsx\nimport React, { useState } from 'react';\n\nconst ToggleButton = () => {\n  const [isToggled, setIsToggled] = useState(false);\n\n  const handleToggle = () => {\n    setIsToggled(!isToggled);\n  };\n\n  return (\n    <button onClick={handleToggle}>\n      {isToggled ? 'ON' : 'OFF'}\n    </button>\n  );\n};\n\nexport default ToggleButton;\n```\n\nIn this example, we are using the `useState` hook to manage the state of the toggle button. The initial value of `isToggled` is set to `false`. The `handleToggle` function is responsible for flipping the value of `isToggled` when the button is clicked.\n\nThe button's text is dynamically rendered based on the value of `isToggled`. If `isToggled` is `true`, the text will be 'ON', otherwise it will be 'OFF'.\n\nTo use this `ToggleButton` component in your app, you can simply import and include it in your desired location:\n\n```jsx\nimport React from 'react';\nimport ToggleButton from './ToggleButton';\n\nconst App = () => {\n  return (\n    <div>\n      <h1>Toggle Button Example</h1>\n      <ToggleButton />\n    </div>\n  );\n};\n\nexport default App;\n```",
  },
  {
    role: 'user',
    content: 'Add css to it to make it prettier',
  },
  {
    role: 'assistant',
    content:
      "Sure! Here's an updated version of the `ToggleButton` component with some basic CSS styles to make it prettier:\n\n```jsx\nimport React, { useState } from 'react';\nimport './ToggleButton.css';\n\nconst ToggleButton = () => {\n  const [isToggled, setIsToggled] = useState(false);\n\n  const handleToggle = () => {\n    setIsToggled(!isToggled);\n  };\n\n  return (\n    <button className={isToggled ? 'toggle-button on' : 'toggle-button off'} onClick={handleToggle}>\n      {isToggled ? 'ON' : 'OFF'}\n    </button>\n  );\n};\n\nexport default ToggleButton;\n```\n\nIn this example, I have added a CSS file named `ToggleButton.css` in the same directory as the `ToggleButton` component. Here's an example of what the CSS file could look like:\n\n```css\n.toggle-button {\n  padding: 10px;\n  border: none;\n  border-radius: 4px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n.toggle-button.on {\n  background-color: green;\n  color: white;\n}\n\n.toggle-button.off {\n  background-color: red;\n  color: white;\n}\n```\n\nWith these styles, the button will have some padding, rounded corners, and a solid background color that changes based on the state of `isToggled`. The text color will be white for better visibility.\n\nRemember to import the CSS file in your main app component or index file using `import './ToggleButton.css';`.\n\nHope that helps!",
  },
];

const CodePage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [demo, setDemo] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
      // Setting fre fetched results
      else {
        setDemo(true);
        setMessages(testingMessages);
        toast.error('Something went wrong');
      }
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
