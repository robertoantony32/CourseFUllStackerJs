const express = require("express")
const router = express.Router()
const { Users } = require("../models")
const bcrypt = require("bcryptjs")
const { validateToken } = require("../middlewares/AuthMiddlewares")
const { sign } = require('jsonwebtoken')

router.post('/', async (req, res) => {
    const {userName, passWord} = req.body
    bcrypt.hash(passWord, 10).then((hash) => {
        Users.create({
            userName: userName,
            passWord: hash,
        })
        res.json("sucess")
    })
})


router.post("/login", async (req, res) => {
    const { userName, passWord } = req.body

    const user = await Users.findOne({ where: { userName: userName } })

    if (!user) return res.json({ error: "User Doesn't Exist" })
    
    bcrypt.compare(passWord, user.passWord).then((match)=>{
        if (!match) return res.json({error: "Wrong Username and PassWord Combination"})


        const accesToken = sign({ userName: user.userName, id: user.id }, "importantsecret") 
        return res.json({token: accesToken, userName: userName, id: user.id})
    })
})


router.get("/auth", validateToken, (req, res) => {
    res.json(req.user)
})

router.get("/basicInfo/:id", async (req, res) => {
    const id = req.params.id

    const basicInfo = await Users.findByPk(id, {
        attributes: { exclude: ["passWord"]},
    })

    res.json(basicInfo)
})


router.put("/changepassword", validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await Users.findOne({ where: { userName: req.user.userName } })

    bcrypt.compare(oldPassword, user.passWord).then((match)=>{
        if (!match) return res.json({error: "Wrong password entered"})
        
        bcrypt.hash(newPassword, 10).then((hash) => {
            Users.update({passWord: hash}, {where: { userName: req.user.userName }})
            res.json("sucess")
        })
        
        
    })
})

module.exports = router