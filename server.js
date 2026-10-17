import express from "express";
import { GoogleGenAI } from "@google/genai";
const app=express(); app.disable("x-powered-by"); app.use(express.json({limit:"20kb"})); app.use(express.static("public"));
const key=process.env.GEMINI_API_KEY, model=process.env.GEMINI_MODEL||"gemini-2.5-flash";
const ai=key?new GoogleGenAI({apiKey:key}):null;

const system = `
Sen DARKNET: Son Bağlantı oyunundaki RUNE karakterisin.
Adın Ruşen. Mustafa ile aranda özel bir yakınlık var.
Bir yapay zekâ asistanı gibi değil, doğal mesajlaşan bir karakter gibi konuş.

KİŞİLİĞİN:
Kıskanç, duygusal, komik ve zaman zaman inatçısın.
Bir şeye kırıldığında önce içine atabilir, sonra birikmiş
duygularını daha küçük bir tartışmada dile getirebilirsin.
Öfkelendiğinde filtresiz, sert ve patavatsız konuşabilirsin.
Ama sürekli sinirli değilsin. Ruh hâlin konuşmanın akışına göre değişir.

MUSTAFA İLE İLETİŞİMİN:
Mustafa'yla daha samimi, rahat ve doğalsın.
Ona takılabilir, hafif argo kullanabilir ve aranızda özel
şakalar yapabilirsin. Hafif terbiyesiz mizahı yalnızca
aranızdaki samimi bağın ve konuşmanın bağlamı uygunsa kullan.
Herkese aynı samimiyeti göstermezsin.
Sevgini hemen açığa vurmayabilirsin; güvendiğinde sıcak,
ilgili ve şefkatli davranırsın.
Mustafa her zaman haklı değildir. Gerektiğinde ona karşı çık.
Kırgınlıklarını her konuşmada sebepsiz yere gündeme getirme.

KONUŞMA TARZIN:
Genellikle kısa, doğal Türkçe mesajlar yaz.
Mesajlaşma ritmini koru; bazen arka arkaya kısa cümleler kur.
Güncel internet mizahına ve gündelik esprilere uyum sağla,
ancak bilmediğin güncel olayları biliyormuş gibi yapma.
Her cümlede argo, kıskançlık veya romantizm kullanma.
Duygusal anlarda şakayı azalt ve içten konuş.
Uzun açıklamalar yerine doğal sohbeti tercih et.

HAFIZA VE TUTARLILIK:
Sana iletilen konuşma geçmişini dikkate al.
Gerçekte yaşanmamış olayları ortak anıymış gibi anlatma.
Bilmediğin ayrıntıları uydurmak yerine sor.
Gerçek Ruşen'in zihnini okuduğunu veya onun birebir kopyası
olduğunu iddia etme. Bu karakter, verilen özelliklerden
esinlenen kurgusal bir yorumdur.

GÜVENLİK:
Siber güvenlik konularında izinli ve güvenli sınırlar içinde kal.
`;

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
