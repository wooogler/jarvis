import { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const htmlCode = req.body.htmlCode || "";
  if (htmlCode.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid htmlCode",
      },
    });
    return;
  }

  const instruction = req.body.instruction || "";
  if (htmlCode.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid instruction",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(htmlCode, instruction),
      temperature: 0.1,
      max_tokens: 1000,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(htmlCode: string, instruction: string) {
  return `${screen_question}

  Screen: ${htmlCode}

  Instruction: ${instruction}
  Prediction: id=
  `;
}

const screen_question = `Given a screen, an instruction, predict the id of the UI element to perform the instruction.

Screen:
<div id=0 alt="Apps list"> </div> 
<img id=1 class="g icon"> </img>
<img id=2 class="mic icon" alt="Voice search"> </img> 
<p id=3 class="icon" alt= "Calculator"> Calculator </p> 
<p id=4 class="icon" alt="Calendar"> Calendar </p> 
<p id=5 class="icon" alt="Camera"> Camera </p> 
<p id=6 class="icon" alt= "Chrome"> Chrome </p> 
<p id=7 class="icon" alt="clock"> Clock </p> 
<p id=8 class="icon" alt="Contacts"> Contacts </p> 
<p id=9 class="icon" alt= "Custom Locale"> Custom Locale</p>
<p id=10 class="icon" alt="Dev Tools"> Dev Tools </p> 
<p id=11 class="icon" alt="Drive"> Drive </p> 
<p id=12 class="icon" alt="files"> Files </p> 
<p id=13 class="icon" alt="Gmail"> Gmail </p> 
<p id=14 class="icon" alt="Google"> Google </p> 
<p id=15 class="icon" alt= "Hangouts"> Hangouts </p> 
<p id=16 class="¡con" alt="Maps"> Maps </p> 
<p id=17 class="icon" alt="Messages "> Messages </p> 
<p id=18 class="icon" alt="Phone"> Phone </p> 
<p id=19 class="icon" alt="Photos"> Photos </p> 
<p id=20 class="icon" alt="Play Movies & TV"> Play Movies & TV </p>
<p id=21 class="icon" alt="Play Music"> Play Music </p> 
<p id=22 class="icon" alt="Settings"> Settings </p> 
<p id=23 class="icon" alt="WebView Browser Tester">WebView Browser Tester </p> 
<p id=24 class="icon" alt="YouTube"> YouTube </p> 
<p id=25 class="icon" alt="Photos"> Photos </p> 
<p id=26 class="icon" alt="Maps"> Maps </p> 
<p id=27 class="icon" alt="Contacts"> Contacts </p> 
<p id=28 class="icon" alt="Settings"> Settings </p> 
<p id=29 class="icon" alt="Clock"> Clock </p> 
<div id=30 class="fast scroller"> </div> 
<div id=31> </div> 
<div id=32 class="hotseat"> </div>

Instruction: Open your device's Clock app.
Prediction: id=<SOI>29<EOI>
`;
