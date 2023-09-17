import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getAllPromptsRoute(app: FastifyInstance){
  app.get('/prompts', async (request, response) => {
    const prompts = await prisma.prompt.findMany()
    return response.status(200).send(prompts)
  })
  
}