import './App.css';
import SidebarScreen from './screen/sidebar'
import ChatScreen from './screen/chat';
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect, useState } from 'react';
import Pusher from "pusher-js";
import axios from './axios'

function App() {
  const [ messages, setMassages ] = useState([])
  useEffect(() => {
    axios
      .get("/messages/sync")
      .then(res => setMassages(res.data))
      .catch(err => console.error(err));
  }, [])

  useEffect(() => {
    const pusher = new Pusher('6c2ca9e2aff2bc52d06e', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessages) {
      // alert(JSON.stringify(newMessages));
      setMassages([...messages, newMessages])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe()
    }

  }, [messages])

  console.log(messages);

  return (
    <>
    {/* <SidebarScreen /> */}
    <ChatScreen messages={messages}/>
    </>
  );
}

export default App;
