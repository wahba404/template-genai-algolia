import ollama from 'ollama'

let path = '/Users/ricky/Pictures/oldphone/pictures/IMG00033-20110410-1835.jpg'

const response = await ollama.chat({
  model: 'llama3.2-vision',
  messages: [{
    role: 'user',
    content: 'What is in this image?',
    images: [path]
  }]
})

console.log(response)