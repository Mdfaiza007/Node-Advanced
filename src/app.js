import express from "express"
// Express framework import kar rahe hain (server + routing + middleware handling ke liye)

import cors from "cors"
// CORS middleware import kar rahe hain (cross-origin requests allow karne ke liye)

import cookieParser from "cookie-parser"
// Cookie parser import kar rahe hain (incoming request ki cookies read karne ke liye)

const app = express()
// Express application instance create kar rahe hain
// Ye tumhara main backend app object hai

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    // Sirf specified frontend origin ko allow karega (environment variable se controlled)

    credentials: true
    // Cookies aur authorization headers allow karega cross-origin requests me
}))
// CORS middleware register kiya gaya hai
// Ye har incoming request pe sabse pehle run hoga

app.use(express.json({ limit: "16kb" }))
// JSON body parser middleware
// Incoming JSON data ko parse karega aur req.body me convert karega
// 16kb limit security purpose ke liye (large payload attack se bachav)

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
// URL-encoded middleware (HTML form data handle karta hai)
// extended: true → nested objects allow karega
// limit → payload size restrict karega

app.use(express.static("public"))
// Static files serve karega (images, CSS, JS, uploads)
// "public" folder ke andar ke files directly browser se access ho sakte hain

app.use(cookieParser())
// Cookie parsing middleware
// Incoming request ki cookies ko parse karega
// req.cookies object available karata hai (JWT auth me useful)

export { app }
// App ko export kar rahe hain taaki server file me import karke listen kara sake
// Best practice: app configuration aur server start alag files me rakhte hain