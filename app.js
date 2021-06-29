const express = require('express')
const app = express()

const fs = require('fs')
const PORT=8000


app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res)=>{
    fs.readFile('data/tasklist.json','utf8', function(error, data){
        if (error) throw error
        const tasklist = JSON.parse(data)
        res.render('home', {tasklist: tasklist} )
    })
})
app.post('/add', (req, res)=>{
    const formData = req.body
    if (formData.task.trim()==''){
        fs.readFile('data/tasklist.json', (err, data)=>{
            if (err) throw err

            const tasklist= JSON.parse(data)
            res.render('home', {error: true, tasklist: tasklist})
        })
    }else{
        fs.readFile('data/tasklist.json', (err, data)=>{
            if (err) throw err
            const tasklist = JSON.parse(data)
            const task = {
                id: id(),
                description: formData.task,
                time:formData.time,
                done: false
            }
            tasklist.push(task)
            fs.writeFile('data/tasklist.json', JSON.stringify(tasklist), (err)=>{
                if (err) throw err
                fs.readFile('data/tasklist.json', (err, data)=>{
                    if (err) throw err

                    const tasklist= JSON.parse(data)

                    res.render('home', {success: true, tasklist: tasklist})
                })
                
            })
        })
    }
})

app.get('/:id/delete', (req, res)=>{
    const id = req.params.id
    fs.readFile('data/tasklist.json', (err, data)=>{
        if (err) throw err

        const tasklist= JSON.parse(data)

        const filterList=tasklist.filter(task=> task.id !=id)
        fs.writeFile('data/tasklist.json', JSON.stringify(filterList), (err)=>{
            if (err) throw err

            res.render('home', {tasklist: filterList, delete: true})
        })
    })
})
app.get('/:id/update', (req, res)=>{
    const id = req.params.id
    fs.readFile('data/tasklist.json', (err, data)=>{
        if (err) throw err

        const tasklist= JSON.parse(data)

        const task=tasklist.filter(task=> task.id ==id)[0]
        const taskIdx=tasklist.indexOf(task)
        const spliceTask = tasklist.splice(taskIdx, 1)[0]
        spliceTask.done=true
        tasklist.push(spliceTask)

        fs.writeFile('data/tasklist.json', JSON.stringify(tasklist), (err)=>{
            if (err) throw err
            res.render('home', {tasklist: tasklist})
        })       
    })
})

app.listen(PORT, (err)=>{
    if (err) throw err

    console.log("This app is running on port "+PORT)
})
function id() {
  return '_' + Math.random().toString(36).substr(2, 9)
}