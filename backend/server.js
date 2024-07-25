const {createServer} = require("http")
const {Server} = require('socket.io')
const cors = require('cors')

const httpServer = createServer()

const io = new Server(httpServer, {
    cors: {
        origin:"http://localhost:5173",
    },
})

let crudData = [] ;

io.on('connection', (socket) => {
    // console.log(socket) ;  
 
    socket.on('SouravData', (data) => {
        crudData.push(data) ;
        console.log(crudData) ;

        socket.emit('curdData', crudData) ;            
    })

    // For edit
    socket.on('editData', (response) => {
        console.log(response)

        let currIdx = crudData.findIndex((data) => data.id === response.id) ;

        if(currIdx !== -1) {
            crudData[currIdx] = {...response} ;
        }
    })

    socket.on('deleteData', (id) => {
        let currIdx = crudData.findIndex((data) => data.id === id) ;

        if(currIdx !== -1) {
            crudData.splice(currIdx, 1) ;
        }
    })

    setInterval(() => {
        socket.emit('curdData', crudData) ;            
    }, 1000);
}) 

const Port = 5000 ;    

httpServer.listen(Port, () => {
    console.log(`Server is running at Port no. : ${Port}`)
})