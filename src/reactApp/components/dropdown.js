import React, {useEffect, useState} from 'react'
import '../../stylesheets/dropdown.css'


export function AppDropDown (props) {
    const [inputValue, changeInputValue] = useState(props.val)

    const changeHandler = event => {
        changeInputValue(event.target.value)
        props.onChange(event.target.value)
    }

    useEffect(() => {
        changeInputValue(props.val)
        return () => changeInputValue('')
    }, [props.val])

    return (
        <select value={inputValue} onChange={changeHandler}>
            {props.arrOptions && props.arrOptions.map((item, i) => <option key={i} value={item}>{item}</option>)}
        </select>
    )
}