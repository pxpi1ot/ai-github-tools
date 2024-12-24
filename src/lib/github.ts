
import { Octokit } from "octokit"
import axios from 'axios';
import { aiSummariseCommit } from "./gemini";
import { db } from "@/server/db";




export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})


type Response = {
    commitMessage: string
    commitHash: string
    commitAuthorName: string
    commitAuthorAvatar: string
    commitDate: string
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {

    const [owner, repo] = githubUrl.split('/').slice(-2)
    if (!owner || !repo) {
        throw new Error("无效的github url")
    }
    /*  获取github数据 */
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo
    })

    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime())
    return sortedCommits.slice(0, 10).map((commit: any) => ({
        commitMessage: commit.commit.message ?? "",
        commitHash: commit.sha as string,
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date
    }))
}

/* 获取项目的GithubUrl */
const fetchProjectGithubUrl = async (projectId: string) => {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
            githubUrl: true
        }
    })
    if (!project?.githubUrl) {
        throw new Error("该项目未链接Github")
    }

    return { project, githubUrl: project?.githubUrl }
}

/* 未保存在数据库的commit */
const filterUnprocessedCommits = async (projectId: string, commitHashes: Response[]) => {
    const processedCommits = await db.commit.findMany({
        where: { projectId }
    })

    /* 数据库里未保存的commit */
    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))

    return unprocessedCommits
}
/* 获取ai总结 */
const summariseCommit = async (githubUrl: string, commitHash: string) => {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })

    if (!data) {
        console.log(`${commitHash}的 git diff 为空`)

        return ""
    }

    return await aiSummariseCommit(data) || ""
}

export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    /* 未保存在数据库的commit */
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)

    const summaryRes = await Promise.allSettled(unprocessedCommits.map(commit => {
        return summariseCommit(githubUrl, commit.commitHash)
    }))
    const summarise = summaryRes.map(response => {
        if (response.status === "fulfilled") {
            return response.value as string
        }
        return ""
    })

    const commits = await db.commit.createMany({
        data: summarise.map((summary, index) => {
            return {
                projectId: projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary
            }
        })
    })

    return commits
}




