"use server"
import { streamText } from "ai"
import { createStreamableValue } from "ai/rsc"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateEmbedding } from "@/lib/gemini"
import { db } from "@/server/db"
import { defaultOverrides } from "next/dist/server/require-hook"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
})

export const askQuestion = async (question: string, projectId: string) => {
    const stream = createStreamableValue()

    /* 生成问题的向量 */
    const queryVector = await generateEmbedding(question)

    const vectorQuery = `[${queryVector.join(",")}]`

    const result = await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
    ` as { fileName: string; sourceCode: string; summary: string }[]

    let context = ''

    for (const doc of result) {
        context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
    }
}