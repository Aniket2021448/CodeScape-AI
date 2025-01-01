import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import React, { use } from 'react'
import {Button} from '@/components/ui/button'
import { Dialog, DialogHeader } from '@/components/ui/dialog'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import Image from "next/image";


const AskQuestionCard = () => {
    const {project} = useProject()
    const [question, setQuestion] = React.useState('')
    const [open, setOpen] = React.useState(false)

    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // window.alert(question)
        setOpen(true)
        console.log('submitting question', question)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Image src='/logo.png' alt={"codescape-logo"} width={60} height={60}/>
                        </DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Card className='relative col-span-5'>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea className= 'p-5' placeholder='Which file should i edit to change the home page' value={question} onChange={e => setQuestion(e.target.value)}/>
                        <div className='pt-5'>
                            <Button type="submit" >Ask Codescape!</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard