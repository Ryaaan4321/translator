import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetLang, sourceLang } = body;
    const translate = (await import('google-translate-api-x')).default;
    const result = await translate(text, {
      to: targetLang,
      from: sourceLang || 'auto',
    });
    if (Array.isArray(result)) {
      return NextResponse.json({
        translations: result.map(r => ({
          text: r.text,
          detectedLang: r.from.language.iso
        }))
      });
    } else if (typeof result === 'object' && result !== null && 'text' in result) {
      return NextResponse.json({
        translatedText: result.text,
        detectedSourceLang: result.from.text
      });
    } else {
      // handle  the dictionary case (if you passed options.keyed)
    //   throw new Error('Unexpected response format');
    }

  } catch (err: any) {
    console.error("err = ", err);
    return NextResponse.json(
      {
        err: "failed",
        details: err.message || err.toString(),
      },
      { status: 500 }
    );
  }
}