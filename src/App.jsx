import React, { useState, useRef } from 'react';
import Footer from './components/common/Footer';
import Carousel from './components/common/Carousel';
import ImageModal from './components/common/ImageModal';
import {
  TextInput,
} from 'flowbite-react';
import { useChat } from './context/ChatContext';
import { useOllamaChat } from './utils/ollama';

function App() {
  const fileInputRef = useRef(null);
  const { chatMessages, addMessage } = useChat();
  const { sendMessage, stopStreaming, isStreaming } = useOllamaChat();
  const [attachments, setAttachments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);

  // Example function to handle message submission
  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = event.target.elements.message;
    const text = input.value.trim();
    // Allow sending if there's text or at least one attachment.
    if (text || attachments.length > 0) {
      // Create a message payload for the backend.
      const messagePayload = { text, attachments };
      // Immediately add the user message to the UI.
      addMessage({
        text,
        sender: 'user',
        type: 'text',
        attachments,
      });
      // Pass the payload to the backend.
      sendMessage(messagePayload);
      // Clear the input and attachments after sending.
      input.value = '';
      setAttachments([]);
    }
  };

  // Handle file selection from the file picker
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Use FileReader to convert the image file to a base64 preview.
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Preview = reader.result;
        const base64Data = base64Preview.split(',')[1]; // Extract base64 data
        // Add the image details to attachments.
        setAttachments((prev) => [
          ...prev,
          { preview: base64Preview, raw: base64Data, fileName: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // pass images to modal
  const openModalWithImages = (images) => {
    setModalImages(images);
    setIsModalOpen(true);
  };

  // handle image removal from the modal
  const handleRemoveImage = (index) => {
    setModalImages((prev) => prev.filter((_, i) => i !== index));
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-6 max-w-full mx-auto grid grid-cols-4 gap-x-6 gap-y-1 dark:bg-gray-900'>
        {/* ------------------ */}
        {/* Top Section: Search Bar */}
        {/* ------------------ */}
        <header className='col-span-2'>
          <TextInput
            id='search'
            type='text'
            placeholder='Search...'
            shadow
            autoComplete='off'
          />
        </header>

        {/* Right: Chat Interface */}
        <aside className='col-span-2 row-span-2 bg-white rounded-lg shadow flex flex-col dark:bg-gray-800 dark:text-white'>
          {/* Chat Header */}
          <div className='border-b border-gray-200 p-4'>
            <h2 className='text-lg font-semibold'>Chat</h2>
          </div>
          <div
            className='p-4 overflow-y-auto space-y-4 flex-1'
            style={{ height: '500px', maxHeight: '500px' }}
            ref={(el) => {
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }}
          >
            {chatMessages.map((message, index) => (
              // wrap each bubble in a flex container to control its alignment
              <div
                key={index}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[50%] break-words ${
                    message.sender === 'user'
                      ? 'bg-blue-100 text-right dark:bg-gray-700 dark:text-white'
                      : 'bg-gray-200 text-left dark:bg-gray-600 dark:text-white'
                  }`}
                >
                  {message.text || '...'}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className='mt-2 flex items-center gap-2'>
                      <small>📎</small>
                      <div className='flex gap-2'>
                        {message.attachments.map((att, index) => (
                          <img
                            key={index}
                            src={att.preview}
                            alt={`attachment-${index}`}
                            className='w-10 h-10 object-cover rounded-md'
                            onClick={() => openModalWithImages(message.attachments)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className='flex border-t border-gray-200 p-4 items-center gap-2'>
            <form
              autoComplete='off'
              onSubmit={handleMessageSubmit}
              className='flex-grow'
            >
              <input
                type='text'
                name='message'
                placeholder='Type a message...'
                className='w-full h-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white'
              />
            </form>
            {attachments.length > 0 && (
              <div
                onClick={() => openModalWithImages(attachments)}
                className='cursor-pointer relative'
              >
                <img
                  src={attachments[0].preview}
                  alt='attachment thumbnail'
                  className='h-10 w-10 object-cover rounded-md'
                />
                {attachments.length > 1 && (
                  <span className='absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-1'>
                    +{attachments.length - 1}
                  </span>
                )}
              </div>
            )}
            {/* Button to trigger the file picker */}
            <button
              className='cursor-pointer text-white p-2 rounded-full flex items-center justify-center w-10 h-10 bg-blue-500'
              onClick={() => fileInputRef.current.click()}
              title='Attach Image'
            >
              📎
            </button>
            {/* Hidden file input */}
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {isStreaming && (
              <button
                className='text-white p-2 rounded-full flex items-center justify-center w-10 h-10'
                onClick={() => {
                  console.log('Stop button clicked');
                  stopStreaming();
                }}
                title='Stop Response'
              >
                &#x1F6D1; {/* Unicode for stop sign symbol */}
              </button>
            )}
          </div>
        </aside>

        {/* ------------------ */}
        {/* Row 2, Cols 1-2: Product Grid */}
        {/* ------------------ */}
        <section className='mt-6 col-span-2 grid grid-cols-2 gap-6'>
          {/* Each product card is sized consistently using a fixed height */}
          <div className='bg-white rounded-lg shadow p-4 flex items-center justify-center h-48 dark:bg-gray-800 dark:text-white'>
            Product 1
          </div>
          <div className='bg-white rounded-lg shadow p-4 flex items-center justify-center h-48 dark:bg-gray-800 dark:text-white'>
            Product 2
          </div>
          <div className='bg-white rounded-lg shadow p-4 flex items-center justify-center h-48 dark:bg-gray-800 dark:text-white'>
            Product 3
          </div>
          <div className='bg-white rounded-lg shadow p-4 flex items-center justify-center h-48 dark:bg-gray-800 dark:text-white'>
            Product 4
          </div>
        </section>

        {/* ------------------ */}
        {/* Bottom Section: Groups and Carousel */}
        {/* ------------------ */}
        <section className='mt-6 col-span-4 flex items-start gap-6'>
          {/* Group cards with fixed sizing */}
          <div className='bg-white rounded-lg shadow p-4 w-64 h-128 flex items-center justify-center dark:bg-gray-800 dark:text-white'>
            Group 1
          </div>
          <div className='bg-white rounded-lg shadow p-4 w-64 h-128 flex items-center justify-center dark:bg-gray-800 dark:text-white'>
            Group 2
          </div>
          {/* Carousel using horizontal scrolling */}
          <div className='flex-1 overflow-x-auto border border-gray-200 rounded-lg p-4'>
            <div className='flex gap-6'>
              <div className='bg-white rounded-lg shadow p-4 min-w-[200px] h-64 flex items-center justify-center dark:bg-gray-800 dark:text-white'>
                Item 1
              </div>
              <div className='bg-white rounded-lg shadow p-4 min-w-[200px] h-64 flex items-center justify-center dark:bg-gray-800 dark:text-white'>
                Item 2
              </div>
              <div className='bg-white rounded-lg shadow p-4 min-w-[200px] h-64 flex items-center justify-center dark:bg-gray-800 dark:text-white'>
                Item 3
              </div>
              <div className='bg-white rounded-lg shadow p-4 min-w-[200px] h-64 flex items-center justify-center dark:bg-gray-800 dark:text-white'>
                Item 4
              </div>
            </div>
          </div>
          {/* <Carousel /> */}
        </section>
      </div>

      <ImageModal
        images={modalImages}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRemoveImage={handleRemoveImage}
        onAddMore={() => {
          setIsModalOpen(false);
          fileInputRef.current.click();
        }}
      />
      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
