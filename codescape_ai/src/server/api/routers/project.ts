import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional(),
        })


    ).mutation(async ({ctx, input}) => {
        // console.log('input', input)
        // return true;
        const project = await ctx.db.project.create({
            data: {
                name: input.name,
                githubUrl: input.githubUrl,
                userToProjects: {
                    create:{
                        userId: ctx.user.userId!,
                    }
                }
            }
        })
    }),

    getProjects: protectedProcedure.query(async ({ctx}) => {
        return await ctx.db.project.findMany({
            where: {
                userToProjects: {
                    some: {
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }
        })

    
    
    })


})