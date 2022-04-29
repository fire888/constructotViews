import React, { useState, useEffect } from 'react'
import '../../stylesheets/input.css'



export function AppInput (props) {
    const [inputValue, changeInputValue] = useState(props.val)

    useEffect(() => {
        changeInputValue(props.val)
        return () => changeInputValue('')
    }, [props.val])


    const changeHandler = event => {
        changeInputValue(event.target.value)
        props.onChange(event.target.value)
    }

    return (<input type="text" name="name" value={inputValue} onChange={changeHandler} />)
}