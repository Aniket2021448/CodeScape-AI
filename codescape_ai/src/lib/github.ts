import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
import {Octokit} from "octokit"
import axios from "axios"
import { AIsummariseCommit } from "./gemini";
import { promise } from "zod";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const githubUrl = 'https://github.com/docker/genai-stack'

type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;

}

export const getCommitHashes = async(githubUrl: string): Promise<Response[]> => {

    const [owner, repo] = githubUrl.split('/').slice(-2)

    if(!owner || !repo){
        throw new Error('Invalid Github URL')
    }

    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo
    })

    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]

    return sortedCommits.slice(0,15).map((commit: any) => (
        {
            commitHash: commit.sha as string,
            commitMessage: commit.commit.message ?? "",
            commitAuthorName: commit.commit?.author?.name ?? "",
            commitAuthorAvatar: commit?.author?.avatar_url ?? "",
            commitDate: commit.commit?.author?.date ?? ""
        }))
}


export const pullCommits = async(projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId)

    const commitHashes = await getCommitHashes(githubUrl)
    const unProcessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    
    const summaryResponses = await Promise.allSettled(unProcessedCommits.map(commit => {
        return summariseCommit(githubUrl, commit.commitHash)
    }))

    const summaries = summaryResponses.map((response)=>{


        if(response.status === 'fulfilled'){
            return response.value as string;
        }   
        return "";
    })
    const commits = await db.commit.createMany({
        data: summaries.map((summary, index)=>{
            console.log(`processing commits: , ${index}`)
            return {
                projectId: projectId,
                commitHash: unProcessedCommits[index]!.commitHash,
                commitMessage: unProcessedCommits[index]!.commitMessage,
                commitAuthorName: unProcessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unProcessedCommits[index]!.commitAuthorAvatar,
                commitDate: unProcessedCommits[index]!.commitDate,
                summary: summary!

            }
        })
    })
    return commits
}


async function summariseCommit(githubUrl: string, commitHash: string){
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })

    return await AIsummariseCommit(data) || "";


}

async function fetchProjectGithubUrl(projectId: string){
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }

    }) 
    if(!project?.githubUrl) {
        throw new Error('Project has no github url')
    }

    return {project, githubUrl: project.githubUrl}
}


async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]){
    const processedCommits = await db.commit.findMany({
        where: {
            projectId
        }
    })

    const unProcessedCommits = commitHashes.filter(commit => !processedCommits.some((processedCommits)=> processedCommits.commitHash === commit.commitHash))
    return unProcessedCommits;    
}
