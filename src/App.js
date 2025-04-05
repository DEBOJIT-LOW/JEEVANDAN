import { useState } from 'react';
import './App.css';
import api from './api';
import { useEffect } from 'react';


function App() {
  const [formData,setFormData]=useState({
    Age:0,
    Weight:0,
    BPM:0,
    SPO2:0
  })

  const[TidalVol,setTidalVol]=useState(0)
  const[RR,setRR]=useState(0)
  const[socket,setSocket]=useState(null)

  useEffect(() => {
    const ws=new WebSocket('ws://192.168.4.1:81')
    setSocket(ws)

    ws.onmessage = (event) =>{
      console.log('Received : ',event.data)
    };

    ws.onopen = ()=>{
      console.log('Connected to WebSocket')
    };

    ws.onclose = ()=>{
      console.log('WebSocket Connection closed')
    };

    return ()=>{
      ws.close();
    };
  },[])

  async function sendData(data){
    if (socket && socket.readyState === WebSocket.OPEN){
      socket.send(data);
      console.log('Data Send')
    } else {
      console.log('WebSocket is not open')
    }
  }

  const handleChange=(e)=>{
    const name = e.target.name;
    const value= parseInt(e.target.value);
    setFormData((prev)=>{
      return{...prev,
        [name]:value
      }
    })
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(formData)
    if (formData.Age>=0 && formData.Weight>=0 && formData.BPM>=0 && formData.SPO2>=0){
    const response=api.post('/predict',formData)
    console.log(response)
    response.then(value =>{
      console.log(value.data.Prediction)
      setTidalVol(value.data.Prediction.toFixed(2))
      console.log(TidalVol)
    })
    .catch(err => {
      console.log(err)
    })

    const response2=api.post('/predictRR',formData)
    response2.then(value => {
      console.log(value.data.prediction)
      setRR(value.data.prediction)
    })
    .catch(err =>{
      console.log(err)
    })

    ArduinoChange()
  }
  else {
    alert('Enter All the Parameters')
  }
  }

  useEffect(()=>{
    ArduinoChange();
  },[TidalVol,RR])

  const ArduinoChange = ()=>{
    const dataG=[TidalVol,RR]
    console.log(dataG)
    sendData(dataG)
  }
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-100">
      {/* Plus Animation */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="heart"></div>
      </div>

      <div className="bg-white bg-opacity-90 shadow-2xl rounded-3xl p-8 max-w-md w-full transform transition duration-500 hover:scale-105 z-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Jeevandan</h1>
        <form  className="space-y-8"onSubmit={handleSubmit}>
          {/* Input Fields */}
          <div className='flex flex-row justify-evenly'>
          <div className='flex flex-col gap-2'>
          <input
            type="text"
            placeholder="Age"
            name='Age'
            onChange={handleChange}
            className="w-24 h-24 p-4 placeholder-center text-center border rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 mx-auto"
          />
          <input
            type="text"
            placeholder="Weight"
            name='Weight'
            onChange={handleChange}
            className="w-24 h-24 p-4 placeholder-center text-center border rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 mx-auto"
          />
          </div>
          <div className='flex flex-col gap-2'>
          <input
            type="text"
            placeholder="BPM"
            name='BPM'
            onChange={handleChange}
            className="w-24 h-24 p-4 placeholder-center text-center border rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 mx-auto"
          />
          <input
            type="text"
            placeholder="SPO2"
            name='SPO2'
            onChange={handleChange}
            className="w-24 h-24 p-4 placeholder-center text-center border rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 mx-auto"
          />
          </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl shadow-lg transform transition duration-300 hover:bg-blue-500 hover:shadow-2xl hover:scale-110 focus:outline-none"
          >
            Submit
          </button>
        </form>

        {/* Output Fields */}
        <div className="mt-8">
          <div className="w-36 h-36 flex flex-col items-center justify-center p-6 bg-gray-200 bg-opacity-80 rounded-full shadow-inner mb-4 mx-auto">
            <strong className="text-lg">Tidal Vol</strong> {TidalVol}
          </div>
          <div className="w-36 h-36 flex flex-col items-center justify-center p-6 bg-gray-200 bg-opacity-80 rounded-full shadow-inner mx-auto">
            <strong className="text-lg">RR</strong> {RR}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
