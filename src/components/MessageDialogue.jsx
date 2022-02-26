import React from 'react'

const MessageDialogue = ({message, isOpen}) => {
  
  return (
    <div className={`absolute top-0 left-2/4 w-2/5 p-4 mt-10 shadow rounded bg-orange-100 ${isOpen ? 'block' : 'hidden'}`} style={{ transform: "translateX(-50%)"}}>
        {message}
    </div>
  )
}

export default MessageDialogue