import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';

const ImageModal = ({ images, isOpen, onClose, onRemoveImage, onAddMore }) => {
  return (
    <Modal dismissible show={isOpen} onClose={onClose}>
      <ModalHeader>
        <Button
          onClick={onAddMore}
          className='absolute top-2 left-2'
          color='gray'
        >
          Add More
        </Button>
        <Button
          onClick={onClose}
          className='absolute top-2 right-2'
          color='gray'
        >
          X
        </Button>
      </ModalHeader>
      <ModalBody>
        <div
          className='grid gap-2'
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
          }}
        >
          {images.map((image, index) => (
            <div key={index} className='relative group w-fit mx-auto'>
              <img
                src={image.preview}
                alt={`image-${index}`}
                className='max-h-96 object-contain rounded-md transition-transform duration-200 transform group-hover:scale-105'
              />
             <button
                onClick={() => onRemoveImage(index)}
                className='absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200'
                title='Remove Image'
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
};
export default ImageModal;
