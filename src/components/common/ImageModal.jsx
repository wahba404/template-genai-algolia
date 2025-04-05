import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';

const ImageModal = ({ images, isOpen, onClose }) => {
  return (
    <Modal dismissible show={isOpen} onClose={onClose}>
      <ModalHeader>
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
            <img
              key={index}
              src={image.preview}
              alt={`image-${index}`}
              className='max-h-96 object-contain'
            />
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
};
export default ImageModal;
