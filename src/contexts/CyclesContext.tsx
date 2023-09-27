import { ReactNode, createContext, useEffect, useReducer, useState } from "react"
import {  Cycle, cyclesReducer } from "../reducers/cycles/reducer"
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions"
import { differenceInSeconds } from "date-fns"


interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCycle: () => void
    markCurrentCycleAsFinished: () => void
}


export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode;
}


export function CyclesContextProvider( { children }: CyclesContextProviderProps) {

    const initialCycleState = {
        cycles: [],
        activeCycleId: null,
    }

    const [cyclesState, dispatch] = useReducer( 
        cyclesReducer, initialCycleState,
        ()  => {
            const storedStateAsJSON = localStorage.getItem(
                '@ignite-time:cycles-state-1.0.0'
            )
            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON)
            }

            return initialCycleState
        }
      
    )

    const { cycles, activeCycleId } = cyclesState 
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)
        localStorage.setItem('@ignite-time:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() =>{
        if (activeCycle){
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }
        return 0
    })

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        dispatch(addNewCycleAction(newCycle))
        setAmountSecondsPassed(0)
    }

    function interruptCycle() {
        dispatch(interruptCurrentCycleAction())
       
    }

    return (
        <CyclesContext.Provider
        value={{
           activeCycle,
           activeCycleId,
           markCurrentCycleAsFinished,
           amountSecondsPassed,
           setSecondsPassed,
           createNewCycle,
           interruptCycle,
           cycles
       }}>

            {children}
        </CyclesContext.Provider>
    )
}