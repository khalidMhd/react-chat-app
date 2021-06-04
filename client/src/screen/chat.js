import React, { useState } from 'react'
import '../style/chat.css'
import axios from '../axios'
function ChatScreen({messages}) {

  const [input, setInput] = useState("")

  const sendMessage = async (e) => {
    e.preventDefault()
    await axios.post("/messages/new", {
        message: input,
        name: "demo app",
        timestamp: "Just Now",
        recieved: false
      })
      // .then(res => )
      // .catch(err => console.error(err));
      setInput("")
  }

    return(
      <div className='container'>
        <div className='d-flex justify-content-between bg-info'>
          {/* <h5>icone</h5> */}

          <div className='col-sm'>
            <h3>Room Name</h3>
            <p>last seen at ...</p>
          </div>

          <div className='col-sm'>
            <p>icone</p>
          </div>

        </div>

        <div className='chat_body'>
          {messages.map(message => (
            <p className={`chat_message ${message?.recieved && "chat_reciever"}`}>
             <span className={`chat_name`}>{message?.name}</span> <br />
             {message?.message}
             <span className='chat_timestamp'>
               {message?.timestamp}
             </span>
           </p>
          ))}
          
          
        </div>

        <div className='chat_footer'>
          <form>
            <input value={input} onChange={(e) => setInput(e.target.value)} type='text' placeholder='Type a message'/>
            <button type='submit' onClick={sendMessage}>send a Message</button>
          </form>
        </div>

      </div>
    )
}

export default ChatScreen;