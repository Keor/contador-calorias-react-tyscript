import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { categories } from "../data/categories"
import { Activity } from "../types"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"

type FormProps = {
    dispatch: Dispatch<ActivityActions>,
    state: ActivityState
}

const initialState : Activity = {
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0
}

export default function Form({dispatch, state} : FormProps) {

    const [activity,setActivity] = useState<Activity>(initialState)

    useEffect(() => {
        if(state.activeId) {
            const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId) [0]
            setActivity(selectedActivity)
        }
    }, [state.activeId])

    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const isNumberField = ['category', 'calories'].includes(e.target.id)
        
        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value : e.target.value
        })

    }

    const isValidActivity = () => {
        const {name,calories} = activity
        return name.trim() !== '' && calories > 0
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch({type: "save-activity", payload : {newActivity: activity}})

        setActivity({
            ...initialState,
            id: uuidv4()})

    }

    return (
        <form 
            className="space-y-5 bg-white p-10 rounded-lg"
            onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 gap-3">
                <label className="font-bold" htmlFor="category">Categorias</label>
                <select className="border border-slate-300 p-2 rounded-lg-w-full bg-white" id="category" value={activity.category} onChange={handleChange}>
                    {categories.map (category => (
                        <option key={category.id}
                                value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cp;s-1 gap-3">
                <label className="font-bold" htmlFor="name">Actividad</label>
                <input className="border border-slate-300 p-2 rounded-lg" type="text" id="name" value={activity.name} 
                 onChange={handleChange} placeholder="Ej. Comida, Ensalada, Ejercicio"/>
            </div>

            <div className="grid grid-cp;s-1 gap-3">
                <label className="font-bold" htmlFor="calories">Calorias</label>
                <input className="border border-slate-300 p-2 rounded-lg" type="number" id="calories" value={activity.calories} 
                 onChange={handleChange} placeholder="Ej. 300 o 500"/>
            </div>

            <input className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10" type="submit" 
             disabled={!isValidActivity()} value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}/>

        </form>
    )
}
