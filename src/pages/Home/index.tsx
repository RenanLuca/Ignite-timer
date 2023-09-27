import { HandPalm } from 'phosphor-react'
import { HomeContainer, StartCountDownButton, StopCountDownButton, } from './styles'
import { useContext } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { CyclesContext } from '../../contexts/CyclesContext'


export function Home() {  
    const {createNewCycle, activeCycle, interruptCycle} = useContext(CyclesContext)
    const newCycleFormValidationSchema = zod.object({
        task: zod.string().min(1, 'Informe a tarefa'),
        minutesAmount: zod.number()
        .min(5, 'O ciclo precisa ser de no mínimo 5 minutos!')
        .max(60, 'O ciclo precisa ser de no máximo 60 minutos!')
    })
    type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })
    const { handleSubmit, watch, reset } = newCycleForm

    function handleCreateNewCycle(data: NewCycleFormData ) {
        createNewCycle(data)
        reset()
    }
    const task = watch('task')
    const isSubmitDisabled = !task
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
                {activeCycle ? (
                    <StopCountDownButton onClick={interruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountDownButton>
                ) : (
                    <StartCountDownButton disabled={isSubmitDisabled} type="submit">
                        <HandPalm size={24} />
                        Começar
                    </StartCountDownButton>
                )}
             
            </form>
        </HomeContainer>
    )
}