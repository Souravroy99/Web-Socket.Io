import { useEffect, useState } from "react";
import io from 'socket.io-client'
import {v4 as uuidv4} from 'uuid'


function App() {

  const port = 5000 ;
  const socket = io(`localhost:${port}`)

  const [info, setInfo] = useState({ name: "", age: "", score: "" }); 
  const [allInfos, setAllInfos] = useState([]) ;
  const [isEdit, setIsEdit] = useState(false) ;

  const handleSubmit = (e) => {
      e.preventDefault() ;

      socket.emit('SouravData', { ...info, id: uuidv4()}) ;

      socket.on('curdData', (data) => {
          setAllInfos(data) 
      })

      setInfo({ name:"", age:"", score:"" })
  }

  const deleteData = (id) => {
      socket.emit('deleteData', id) ;
  }


  const getEditData = (data) => {
      setInfo(data) ;
      setIsEdit(true) ;
  }


  const handleEdit = () => {
    // console.log(info)

    socket.emit('editData', info)

    setInfo({name:"", age:"", score:""})
    setIsEdit(false)
  }



  useEffect(() => {
    socket.on('curdData', (data) => {
      setAllInfos(data) 
  })
  }, [])

  
  const handleInput = (e) => {
      const name = e.target.name
      const value = e.target.value

      setInfo((prev) => ({
          ...prev,
          [name]: value,
      }))
    };


  return (
    <div className="container">
      <h1>CRUD Operations</h1>

      <div className="form-field">
        <input
          type="text"
          onChange={handleInput}
          name="name"
          value={info.name}
          placeholder="Enter your name"
          className="input-field"
        />
        <input
          type="text"
          onChange={handleInput}
          name="age"
          value={info.age}
          placeholder="Enter your age"
          className="input-field"
        />
        <input
          type="text"
          onChange={handleInput}
          name="score"
          value={info.score}
          placeholder="Enter your score"
          className="input-field"
        />
      </div>

      <button className="btn" type="submit" onClick={isEdit ? handleEdit : handleSubmit}> {isEdit ? "Edit" : "Add"} Data</button>

      <div>
      {
        allInfos.length > 0 
        ?  <table>
            <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Score</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
            </thead>
            <tbody>
              {allInfos.map((data, index) => (
                <tr key={index}>
                  <td>{data.name}</td>
                  <td>{data.age}</td>
                  <td>{data.score}</td>
                  <td><button onClick={() => getEditData(data)}>Edit</button></td>
                  <td><button onClick={() => deleteData(data.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>

          </table>
        : <h1>No Data Found!!</h1>
      }
      </div>
    </div>
  );
}

export default App;
