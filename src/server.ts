import { fastify } from 'fastify'
import {fastifyCors} from '@fastify/cors'
import { getAllPromptsRoute } from './routes/prompt/get-all';
import { uploadVideoRoute } from './routes/video/upload-video';
import { createTranscriptionRoute } from './routes/video/create-transcription';
import { generateIATranscription } from './routes/video/complete-transcription';

const app = fastify();
let port = 3333;

app.register(fastifyCors, {
  origin: '*', // url do domínio de produção caso vá para produção
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateIATranscription)


app.listen({
  port,
}).then(() => {
  console.log(`HTTP server running on port ${port}`)
})