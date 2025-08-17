export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      function sendEvent(event: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      // Initial heartbeat
      controller.enqueue(encoder.encode(`: connected\n\n`))

      const activitySamples = [
        { type: 'activity', payload: { id: `a-${Date.now()}`, kind: 'quotation', company: 'Contoso', at: new Date().toISOString() } },
        { type: 'activity', payload: { id: `a-${Date.now()+1}`, kind: 'invoice', customer: 'Northwind', at: new Date().toISOString() } },
        { type: 'activity', payload: { id: `a-${Date.now()+2}`, kind: 'support', customer: 'Fabrikam', at: new Date().toISOString() } },
      ]

      const oppSamples = [
        { type: 'opportunityUpdated', payload: { id: 'OP-5001', stage: 'qualified' } },
      ]

      const interval = setInterval(() => {
        const idx = Math.floor(Math.random() * activitySamples.length)
        sendEvent(activitySamples[idx])
      }, 10000)

      const interval2 = setInterval(() => {
        sendEvent(oppSamples[0])
      }, 30000)

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`: keep-alive\n\n`))
      }, 15000)

      // Cleanup
      ;(globalThis as any).cleanup = () => {
        clearInterval(interval)
        clearInterval(interval2)
        clearInterval(keepAlive)
      }
    },
    cancel() {
      if ((globalThis as any).cleanup) (globalThis as any).cleanup()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}


