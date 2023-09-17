import { FastifyInstance } from "fastify";
import { z } from "zod";
import { streamToResponse, OpenAIStream } from 'ai'
import { prisma } from "../../lib/prisma";
import { openai } from "../../lib/openia";

export async function generateIATranscription(app: FastifyInstance) {
  app.post('/videos/complete-transcription', async (request, response) => {
    const bodySchema = z.object({
      videoId: z.string().uuid(),
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    })

    const { temperature, videoId, prompt } = bodySchema.parse(request.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    })

    if (!video.transcription) {
      return response.status(400).send({ error: 'Video transcription was not generated yet.' })
    }

    const promptMessage = prompt.replace('{transcription}', video.transcription)

    console.log(promptMessage)

    const openAIResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [
        { role: 'user', content: promptMessage }
      ],
      stream: true,
    })

    const stream = OpenAIStream(openAIResponse)
    streamToResponse(stream, response.raw, {
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
      }
    })
  })
}