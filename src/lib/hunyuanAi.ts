import { OpenAI } from "openai";


/* 生成commit摘要 */
export const aiSummariseCommit = async (diff: string) => {
    // 构造 client
    const client = new OpenAI({
        apiKey: "sk-KrFrP6qAy9eQQLJtJofcqbdrINjqiXrddxxdFrvXjBQW9uat", // 混元 APIKey
        baseURL: "https://api.hunyuan.cloud.tencent.com/v1", // 混元 endpoint
    });



    const prompt = `以下是一段Git diff文本：
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
* 请根据上述要求生成类似的内容。
`
    // 自定义参数传参示例
    const completion = await client.chat.completions.create({
        model: 'hunyuan-turbo',
        messages: [{ role: "system", content: prompt }, { role: 'user', content: `只要按照示例的格式输出我要的内容，不要输出其他内容，请对以下diff文件进行摘要总结，: \n\n${diff}` }],
        // @ts-expect-error key is not yet public
        enable_enhancement: true, // <- 自定义参数
    });

    return completion.choices[0]?.message?.content
}
