import {FormContainer, TaskInput, MinutesAmountInput } from './styles'
import { useContext } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { useFormContext } from 'react-hook-form'


export function NewCycleForm () {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()
    return (
        <FormContainer>
        <label htmlFor="">Vou trabalhar em</label>
        <TaskInput
            id="task"
            placeholder='Dê um nome para o seu projeto'
            list='task-suggestions'
            disabled={!!activeCycle}
            {...register('task')}
          />
        <datalist id='task-suggestions'>
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Projeto 3"></option>
        </datalist>
        <label htmlFor="minutesAmount">Durante</label>
        <MinutesAmountInput
            id="minutesAmount"
            placeholder='00'
            type='number'
            disabled={!!activeCycle}
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', {valueAsNumber: true})}
        />
        <span>minutos</span>
    </FormContainer>
    )
}