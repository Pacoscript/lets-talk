import React from 'react'

function Thread(props) {



    return <div className='message'>
        <p className='message__name'>{props.name}:</p>
        <p className='message__paragraph'>{props.text}</p>
        
    </div>

}

export default Thread

