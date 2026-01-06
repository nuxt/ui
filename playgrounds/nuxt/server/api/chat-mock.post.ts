import { simulateReadableStream } from 'ai'

export default defineEventHandler(async () => {
  return new Response(
    simulateReadableStream({
      initialDelayInMs: 500,
      chunkDelayInMs: 50,
      chunks: [
        `data: {"type":"start","messageId":"msg-${Date.now()}"}\n\n`,
        // Reasoning part
        `data: {"type":"reasoning-start","id":"reasoning-1"}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"Processing "}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"the user's "}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"request...\\n\\n"}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"1. **Understanding** "}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"- parsing the message\\n"}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"2. **Reasoning** "}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"- formulating a response\\n"}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"3. **Validating** "}\n\n`,
        `data: {"type":"reasoning-delta","id":"reasoning-1","delta":"- checking for accuracy"}\n\n`,
        `data: {"type":"reasoning-end","id":"reasoning-1"}\n\n`,
        // Text part
        `data: {"type":"text-start","id":"text-1"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"This is "}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"a **simulated** "}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"streaming response "}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"using the AI SDK's "}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"\`simulateReadableStream\` "}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"utility.\\n\\n"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"It demonstrates:\\n"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"- Reasoning blocks\\n"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"- Text streaming\\n"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"- Markdown rendering"}\n\n`,
        `data: {"type":"text-end","id":"text-1"}\n\n`,
        `data: {"type":"finish"}\n\n`,
        `data: [DONE]\n\n`
      ]
    }).pipeThrough(new TextEncoderStream()),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'x-vercel-ai-ui-message-stream': 'v1'
      }
    }
  )
})
