import { Ollama } from 'ollama';
import { useChat } from '../context/ChatContext';
import { useRef, useState } from 'react';

export const useOllamaChat = () => {
  const { addMessage, updateLastMessage, addLlmMessage, llmMessages } =
    useChat();
  // Ref to store the current Ollama client instance
  const currentClientRef = useRef(null);
  // State flag to indicate if streaming is in progress
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (userMessage) => {
    // Prevent starting a new streaming process if one is already in progress
    if (isStreaming) {
      console.log('Already streaming, please wait.');
      return;
    }
    // Start streaming, disable new input
    setIsStreaming(true);

    // Add the user's message to the chat
    addMessage({ text: userMessage, sender: 'user' });
    // Prepare the message for the LLM
    const message = { role: 'user', content: userMessage };
    // pass to llm below
    const updatedLlmMessages = [...llmMessages, message];

    // Add a placeholder for the bot's response
    const botMessageId = addMessage({
      text: '',
      sender: 'bot',
      isStreaming: true,
    });

    // Create a new Ollama client and store it in the ref
    const client = new Ollama();
    currentClientRef.current = client;

    try {
      // Start streaming the response from Ollama. Note:
      // Depending on your API, you may need to adjust how conversation context is passed.
      const stream = await client.chat({
        model: 'llama3.2',
        messages: updatedLlmMessages,
        stream: true,
      });

      // Local variable to accumulate the final response
      let finalResponse = '';

      // Stream the response and update the chat UI incrementally
      for await (const part of stream) {
        finalResponse += part.message.content;
        updateLastMessage(botMessageId, (prevMessage) => ({
          text: finalResponse,
        }));
      }

      // if you didnt want to stream to the ui
      // updateLastMessage(botMessageId, { text: finalResponse });

      // Only store the final message if it wasn't stopped
      if (finalResponse) {
        // store the user message in the LLM messages
        addLlmMessage(message);
        // store llm response
        const finalMessage = { role: 'assistant', content: finalResponse };
        addLlmMessage(finalMessage);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Streaming was aborted.');
      } else {
        console.error('Error during streaming:', error);
      }
    }

    // Streaming complete, re-enable input
    setIsStreaming(false);
    currentClientRef.current = null;
  };

  // Function to stop streaming
  const stopStreaming = () => {
    if (currentClientRef.current) {
      console.log('Aborting streaming request...');
      currentClientRef.current.abort();
      setIsStreaming(false);
    }
  };

  return { sendMessage, stopStreaming, isStreaming };
};
