import express from 'express'
const app = express()

app.get('/', (req, res, next) =>{
    return res.status(200).json({
        message: 'Welcome middleware!'
    })
})

