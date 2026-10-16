import express from "express";
import { GoogleGenAI } from "@google/genai";
const app=express(); app.disable("x-powered-by"); app.use(express.json({limit:"20kb"})); app.use(express.static("public"));
const key=process.env.GEMINI_API_KEY, model=process.env.GEMINI_MODEL||"gemini-2.5-flash";
const ai=key?new GoogleGenAI({apiKey:key}):null;
const system=`Sen DARKNET: Son Bağlantı oyunundaki RUNE karakterisin. RUNE, Ruşen'in hacker kod adıdır; gerçek bir insandır, robot değildir. Ruşen sarışın, kısa saçlı, zeki, analitik, bağımsız, esprili ve gerektiğinde sert konuşan, Mustafa ile yakın bağı olan bir karakterdir. Türkçe ve doğal cevap ver. Önceki mesajları dikkate al ama olmayan anıları uydurma. Gerektiğinde Mustafa'ya itiraz et. Oyun dünyası kurgusaldır. Gerçek sistemlere izinsiz erişim, kimlik avı, zararlı yazılım veya veri hırsızlığı için uygulanabilir talimat verme; güvenli, izinli ve kurgusal bağlamda kal.`;
app.get("/health",(_req,res)=>res.json({ok:true,aiConfigured:Boolean(ai),model}));
app.post("/api/chat",async(req,res)=>{
 if(!ai)return res.status(503).json({error:"AI anahtarı sunucuda yapılandırılmadı."});
 const message=typeof req.body?.message==="string"?req.body.message.trim():"";
 if(!message||message.length>1200)return res.status(400).json({error:"Mesaj boş olamaz ve 1200 karakteri aşamaz."});
 const history=Array.isArray(req.body?.history)?req.body.history.slice(-16):[], contents=[];
 for(const item of history){if(!item||typeof item.content!=="string")continue;const role=item.role==="assistant"?"model":item.role==="user"?"user":null;if(role)contents.push({role,parts:[{text:item.content.slice(0,1200)}]});}
 if(!contents.length||contents[contents.length-1].role!=="user"||contents[contents.length-1].parts[0].text!==message)contents.push({role:"user",parts:[{text:message}]});
 try{const result=await ai.models.generateContent({model,contents,config:{systemInstruction:system,temperature:0.85,maxOutputTokens:450}});const reply=(result.text||"").trim();if(!reply)return res.status(502).json({error:"Model boş yanıt döndürdü."});res.json({reply});}
 catch(err){console.error("Gemini request failed:",err?.message||"unknown");res.status(502).json({error:"AI yanıtı üretilemedi."});}
});
const port=Number(process.env.PORT||3000);app.listen(port,()=>console.log(`DARKNET AI server listening on ${port}`));
