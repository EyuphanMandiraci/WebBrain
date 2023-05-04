import express from 'express';
import {Configuration, OpenAIApi} from "openai";
import dotenv from 'dotenv';
dotenv.config();

var router = express.Router();
const config = new Configuration({apiKey: process.env.OPENAI_API_KEY});
const api = new OpenAIApi(config);


router.get('/', async function(req, res, next) {
    const prompt = req.query.prompt;
    let response = await api.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 2048,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        messages: [
            {
                role: "system",
                content: "You are an AI model that generates HTML&CSS page of given prompt"
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });
    response = response.data.choices[0].message.content;
    let htmlCode = await api.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 2048,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        messages: [
            {
                role: "system",
                content: "You are an AI model that extract html code from given AI result.\n" +
                    "You are returning HTML code from given text\n" +
                    "JUST RETURN HTML CODE\n" +
                    "REMOVE CSS FROM HTML CODE\n" +
                    "DON'T ADD ANY ADITIONAL TEXT, JUST RETURN CODE"
            },
            {
                role: "user",
                content: response
            }
        ]
    });
    htmlCode = htmlCode.data.choices[0].message.content;
    let cssCode = await api.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 2048,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        messages: [
            {
                role: "system",
                content: "You are an AI model that extract css code from given AI result.\n" +
                    "You are returning CSS code from given text\n" +
                    "JUST RETURN CSS CODE\n" +
                    "REMOVE HTML FROM CSS CODE\n" +
                    "DON'T ADD ANY ADITIONAL TEXT, JUST RETURN CODE"
            },
            {
                role: "user",
                content: response
            }
        ]
    });
    cssCode = cssCode.data.choices[0].message.content;
    await res.json({
        prompt: prompt,
        htmlCode: htmlCode,
        cssCode: cssCode
    })


});

export default router;
