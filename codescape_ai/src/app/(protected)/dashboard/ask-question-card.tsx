import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import React, { use } from 'react'
import {Button} from '@/components/ui/button'

const AskQuestionCard = () => {
    const {project} = useProject()
    const [question, setQuestion] = React.useState('')

    const onSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        window.alert(question)

        console.log('submitting question', question)
    }


    return (
    //    <div>AskQuestionCard</div>
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder='Which file should i edit to change the home page' value={question} onChange={e => setQuestion(e.target.value)}/>
                        <div className='h-4'>
                            <Button>Ask Codescape!</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard