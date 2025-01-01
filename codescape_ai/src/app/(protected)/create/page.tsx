// 'use client'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import useRefetch from '@/hooks/use-refetch'
// import { api } from '@/trpc/react'
// import React from 'react'
// import { useForm } from 'react-hook-form'
// import { toast } from 'sonner'


// type FormInput = {
//     repoUrl: string, 
//     projectName: string, 
//     githubToken?: string
// }


// const createPage = () => {
//     const {register, handleSubmit, reset} = useForm<FormInput>()
//     const createProject = api.project.createProject.useMutation()
//     const refetch = useRefetch()


    



//     function onSubmit(data: FormInput) {
//         // window.alert(JSON.stringify(data, null, 2))
//         createProject.mutate({
//             githubUrl: data.repoUrl,
//             name: data.projectName,
//             githubToken: data.githubToken
//         },{
//             onSuccess: () => {
//                 toast.success('Project created successfully')
//                 refetch()
//                 reset()
            
//             },
//             onError: (error) => {
//                 toast.error(error.message)
//             }
//         }
//     )
//         return true;
        
    
//     }

//     return (
            
//         <div className='flex items-center gap-12 h-full justify-center'>
//             <img src='/undraw-github-create.svg' alt='create page image' className = "h-60 w-auto"width={500} height={400}/>
//             <div>
//                 <div>
//                     <h1 className='font-semibold text-2xl items-center justify-center'>
//                         Link your github repository
//                     </h1>
//                     <p className='text-sm text-muted-foreground'>
//                         Enter the url of your github repository to connect it to codescape.
//                     </p>
//                     <div className='h-4'></div>
//                     <div>
//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             <Input {...register('projectName', {'required': true}) } placeholder='Project Name' required />
                            
//                             <div className='h-2'></div>
//                             <Input {...register('repoUrl', {'required': true}) } placeholder='Repository url' required />

//                             <div className='h-2'></div>
//                             <Input {...register('githubToken') } placeholder='Github Token (Optional: For private repositories)' />
                            
//                             <div className='h-4'></div>
//                             <Button type='submit' disabled={createProject.isPending}>Create Project</Button>
//                         </form>
//                     </div>

//                 </div>
//             </div>
//         </div>



//     )
// }

// export default createPage



'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useRefetch from '@/hooks/use-refetch';
import { api } from '@/trpc/react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  const [timeLeft, setTimeLeft] = useState<number>(0); // Timer state in seconds
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000); // Decrease time by 1 second
    } else if (timeLeft === 0 && isButtonDisabled) {
      setIsButtonDisabled(false); // Re-enable button after timer ends
    }
    return () => {
      if (timer) clearTimeout(timer); // Cleanup timer
    };
  }, [timeLeft, isButtonDisabled]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  function onSubmit(data: FormInput) {
    setIsButtonDisabled(true); // Disable the button
    setTimeLeft(300); // Set timer for 5 minutes (300 seconds)

    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success('Project created successfully');
          refetch();
          reset();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
    return true;
  }

  return (
    <div className="flex items-center gap-12 h-full justify-center">
      <img
        src="/undraw-github-create.svg"
        alt="create page image"
        className="h-60 w-auto"
        width={500}
        height={400}
      />
      <div>
        <div>
          <h1 className="font-semibold text-2xl items-center justify-center">
            Link your github repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the url of your github repository to connect it to codescape.
          </p>
          <div className="h-4"></div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register('projectName', { required: true })}
                placeholder="Project Name"
                required
              />

              <div className="h-2"></div>
              <Input
                {...register('repoUrl', { required: true })}
                placeholder="Repository url"
                required
              />

              <div className="h-2"></div>
              <Input
                {...register('githubToken')}
                placeholder="Github Token (Optional: For private repositories)"
              />

              <div className="h-4"></div>
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={isButtonDisabled || createProject.isPending}
                >
                  Create Project
                </Button>
                {isButtonDisabled && (
                  <span className="text-sm text-muted-foreground">
                    Time left: {formatTime(timeLeft)}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
