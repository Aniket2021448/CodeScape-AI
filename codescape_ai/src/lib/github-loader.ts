import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'

export const loadGithubRepo = async(githubUrl: string, githubToken?: string) =>{
    const loader = new GithubRepoLoader(githubUrl, 
        {
            accessToken: githubToken || ' ',
            branch: 'main',
            recursive: true,
            unknown: 'warn',
            maxConcurrency: 5,
 
        }
    
    )
    const docs = await loader.load()



    return docs
}