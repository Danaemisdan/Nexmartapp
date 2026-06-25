import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    // Using a hyper-natural sweet female voice
    const voice = searchParams.get('voice') || "en-US-AriaNeural";

    if (!text) {
        return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    
    // Instead of streaming, we wait for the buffer to finish to prevent Vercel 500 crashes
    const { audioStream } = tts.toStream(text);
    
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ error: "Failed to synthesize speech" }, { status: 500 });
  }
}
