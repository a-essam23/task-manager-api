const Task = require('../models/task')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')



router.delete('/tasks/:id', auth, async (req, res) => {
    try {

        const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })
        if (!task) {
            res.status(500)
        }
        res.status(200).send(`Task "${task.description}" has been deleted.`)
    }
    catch (e) {
        res.status(500).send()
    }
})


//GET all tasks (optional  ?completed=true/false)
//GET all tasks (optional  ?limit)
//GET all tasks (optional  ?sortBy)
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if (req.query.completion) {
        match.completion = req.query.completion === 'true'
    }
    let limit = 0
    if (req.query.limit) {
        limit = parseInt(req.query.limit)
    }
    let skip = 0
    if (req.query.skip) {
        skip = parseInt(req.query.skip)
    }
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? 1 : -1
    }
    try {
        //const tasks = await Task.find({createdBy:req.user.id})
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit,
                skip,
                sort
            }
        })
        res.send(req.user.tasks)
    }
    catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, createdBy: req.user._id })
        res.send(task)
    }
    catch {
        res.status(404).send()
    }

})


router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        createdBy: req.user._id,

    })

    try {

        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completion']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: "Key requested does not exist!" })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id })

        if (!task) {
            return res.status(404).send("Could not find task.")
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router