import { GoogleGenerativeAI } from "@google/generative-ai"
import { Document } from "@langchain/core/documents"


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})
/* 生成commit摘要 */
export const aiSummariseCommit = async (diff: string) => {
    const response = await model.generateContent([
        `以下是一段Git diff文本：
diff
复制代码
diff --git a/lib/index.js b/lib/index.js  
index aadf691..bfef603 100644  
--- a/lib/index.js  
+++ b/lib/index.js  
<其他diff内容>  
请根据这段文本总结其核心改动，并用以下格式呈现：

描述具体修改的功能或改动，例如功能添加、修复或优化。
列出修改涉及的文件路径（用方括号括起，多个文件用逗号分隔）。
仅提取用户可读的高层次信息，而不涉及低级实现细节。
示例输出格式：

* 修改描述 [文件路径1]、[文件路径2]
* 添加功能 [文件路径]
* 修复问题 [文件路径]
* 请根据上述要求生成类似的内容。`,
        `只要按照示例的格式输出我要的内容，不要输出其他内容，请对以下diff文件进行摘要总结，: \n\n${diff}`,
    ])

    return response.response.text()
}



/* 文件摘要 */
export const summariseCode = async (doc: Document) => {
    console.log("生成summary", doc.metadata.source)
    try {
        const code = doc.pageContent.slice(0, 10000)  //限制 10000 字符

        const res = await model.generateContent([
            `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects`,
            `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
    Here is the code:
    ---
    ${code}
    ---
    Give a summary in Chinese no more than 100 words of the code above.`
        ])
        return res.response.text()

    } catch (err) {
        return ""
    }


}

export const generateEmbedding = async (summary: string) => {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })

    const result = await model.embedContent(summary)
    const embedding = result.embedding
    return embedding.values
}

