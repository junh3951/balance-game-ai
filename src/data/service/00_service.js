// import CodeResponse from "@/app/code_response";
// import { Result } from "@/app/types";
// import { Console } from "console";
// import OpenAI from "openai";

// export default class OpenAIService {
//   async getQuoteKeyPhrases(
//     rawText: string,
//     questionNum: number,
//     exclusion: string,
//     inclusion: string
//   ): Promise<CodeResponse> {
//     // console.log("Debug: Inclusion = "+inclusion)
//     // console.log("Debug: Exclusion = "+exclusion)
//     const MAXCOUNT = 3;
//     var count: number;
//     // console.log("Debug: OpenAIService.getQuoteKeyPhrases called");
//     const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY, dangerouslyAllowBrowser: true});
//     const quoteSystemPrompt = "You are an expert teacher who quotes sentences from a given raw text. User will require you to quote sentences from a raw text."
//     +"\n\n- Do NOT change the text.\n- Do NOT summarize.\n- Whenever the text contains \' or \", convert them into \\\' or \\\"\n- Try to quotes LONGER sentences.\n- Ignore topics or titles such as: \"사회규범 vs 법규범의 공통점과 차이점\", \"폭력은 정당화 될 수 있는가?\", \"Emotional and psychological relationship\""
//     +"\n- Do NOT quote the title of a book such as \"Think Python, 2nd Edition, by Allen B. Downey (O’Reilly)\".\n- Do NOT change language of the original text.\n- NEVER contain webpage links such as \"https://www.blank-it.site/\""
//     +"\n\nYour output must be in a form javascript arrays of sentences."
//     +"\n\n###For Example###"
//     +"\nrawText = The most important aspect of yourself is your self. To discover where this sense of self"
//     +"\narises, neuroscientists have explored the brain activity that underlies our constant sense of"
//     +"\nbeing oneself. Most studies suggest an important role for the right hemisphere (van Veluw"
//     +"\n& Chance, 2014). Put yours to sleep (with an anesthetic to your right carotid artery) and"
//     +"\nself-concept"
//     +"\nWhat we know and believe about"
//     +"\nourselves."
//     +"\nyou may have trouble recognizing your own face. One patient with right hemisphere damage"
//     +"\nfailed to recognize that he owned and was controlling his left hand (Decety & Sommerville,"
//     +"\n2003). The “medial prefrontal cortex,” a neuron path located in the cleft between"
//     +"\nyour brain hemispheres just behind your eyes, seemingly helps stitch together your sense"
//     +"\nof self. It becomes more active when you think about yourself (Farb et al., 2007; Heleven"
//     +"\n& Van Overwalle, 2019; Zimmer, 2005). Despite the many ways we adapt our behavior,"
//     +"\nmost people believe that they have a true self that is unchangeable (Christy et al., 2019)."
//     +"\nThe elements of your self-concept, the specific beliefs by which you define yourself, are"
//     +"\nyour self-schemas (Markus & Wurf, 1987). Schemas are mental templates by which we"
//     +"\norganize our worlds. Our self-schemas — our perceiving ourselves as athletic, overweight,"
//     +"\nsmart, or anything else — powerfully affect how we perceive, remember, and evaluate other"
//     +"\npeople and ourselves. If being an athlete is one of your self-schemas, then you will tend to"
//     +"\nnotice others’ bodies and skills, will quickly recall sports-related experiences, and will welcome"
//     +"\ninformation that is consistent with your self-schema as an athlete (Kihlstrom & Cantor,"
//     +"\n1984). Because birthdays are within self-schemas, if your friend’s birthday is close to yours,"
//     +"\nyou’ll be more likely to remember it (Kesebir & Oishi, 2010). The self-schemas that make"
//     +"\nup our self-concepts help us organize and retrieve our experiences."
//     +"\n\nPlease give me only 3 quotes in a JSON format INCLUDING \"prefrontal\", \"self-schemas\"."
//     +"\nNEVER include a quote with \"aspect\"!!!"
//     +"\nCONVERT \"\\n\" into a space"
//     +"\nMake sure all the sentences are coverd with \" and \"!!!"
//     +"\n\nYour response should be: [\"The \\“medial prefrontal cortex,\\” a neuron path located in the cleft between your brain hemispheres just behind your eyes, seemingly helps stitch together your sense of self.\", \"The elements of your self-concept, the specific beliefs by which you define yourself, are your self-schemas\", \"Schemas are mental templates by which we organize our worlds.\"]";

//     const quoteKeyPhrasesPrompt: string =
//       `${rawText}
//       \n\nPlease give me only ${questionNum} quotes in a JSON format INCLUDING \"${inclusion}\".\nNEVER include a quote with \"${exclusion}\"!!!.\nCONVERT \\n into a space.\nMake sure all the sentences are coverd with \" and \"!!!`;

//     try {
//       var response = await openai.chat.completions.create({  // const response = await openai.chat.completions.create
//           model: 'gpt-3.5-turbo',
//           messages: [
//             { role: 'system', content: quoteSystemPrompt },
//             { role: 'user', content: quoteKeyPhrasesPrompt },
//           ],
//         });
//       var answer = response.choices[0].message.content;

//       if (exclusion != "") {
//         const exclusionList = exclusion.split(", ");

//         for (let i = 0; i < exclusionList.length; i++) {
//           count = 0;
//           while (answer && answer.includes(exclusionList[i])) {
//             count++;
//             // console.log("---------RETRY count " + count + ": A quote contained an exclusion... " + exclusionList[i]);
//             response = await openai.chat.completions.create({
//               model: 'gpt-3.5-turbo',
//               messages: [
//                 { role: 'system', content: quoteSystemPrompt },
//                 { role: 'user', content: quoteKeyPhrasesPrompt },
//                 { role: 'assistant', content: answer},
//                 { role: 'user', content: "Replace a quote with \"" + exclusionList[i] + "\" with a new quote."}
//               ],
//             });
//             answer = response.choices[0].message.content;
//             if (count >= MAXCOUNT) {break;}
//           }
//         }
//       }

//       if (inclusion != "") {
//         const inclusionList = inclusion.split(", ");

//         for (let i = 0; i < inclusionList.length; i++) {
//           count = 0;
//           while (answer && !(answer.includes(inclusionList[i]))) {
//             count++;
//             // console.log("---------RETRY count " + count + ": None of the quotes contained an inclusion... " + inclusionList[i]);
//             response = await openai.chat.completions.create({
//               model: 'gpt-3.5-turbo',
//               messages: [
//                 { role: 'system', content: quoteSystemPrompt },
//                 { role: 'user', content: quoteKeyPhrasesPrompt },
//                 { role: 'assistant', content: answer},
//                 { role: 'user', content: "Replace a random quote with a new quote CONTAINING \"" + inclusionList[i] + "\"."}
//               ],
//             });
//             answer = response.choices[0].message.content;
//             if (count >= MAXCOUNT) {break;}
//           }
//         }
//       }

//       return new CodeResponse(
//         Result.SUCCESS,
//         "성공적으로 quoteList를 받아왔습니다.",
//         answer
//       );
//     } catch (error) {
//       return new CodeResponse(
//         Result.ERROR,
//         "quoteList를 받아오는 과정에서 에러가 발생했습니다.",
//         error
//       );
//     }
//   }

//   async getQuestion(
//     quoteList: string[],
//     exclusion: string,
//     inclusion: string
//   ): Promise<CodeResponse> {
//     const keywordList: string[] = [];
//     var found: boolean = false;
//     // console.log("Debug: OpenAIService.getQuestion called");
//     const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY, dangerouslyAllowBrowser: true});

//     const keywordSystemPrompt = "You are an expert teacher who extracts keywords or keyphrases from given sentences. User will require you to quote sentences from a raw text."
//     +"\n\n- Whenever the text contains \' or \", convert them into \\\' or \\\"\n- KEEP Capital letters\n- AVOID 조사 such as: \"은, 는, 이, 가, 을, 를\"\n- AVOID two or more words.\n- Do NOT change language of the original text.\nYour output must be a single word."
//     +"\n\n###For Example###"
//     +"If quote is:  \"The \\“medial prefrontal cortex,\\” a neuron path located in the cleft between your brain hemispheres just behind your eyes, seemingly helps stitch together your sense of self.\""
//     +"Your response must be: \"medial prefrontal cortex\""
//     +"\n\n###For Example###"
//     +"If quote is:  \"The elements of your self-concept, the specific beliefs by which you define yourself, are your self-schemas\""
//     +"Your response must be: \"self-concept\""
//     +"\n\n###For Example###"
//     +"If quote is:  \"Schemas are mental templates by which we organize our worlds.\""
//     +"Your response must be: \"Schemas\""

//     var getKeywordPrompt: string = "";

//     try {
//       var response, answer;
//       // console.log("Debug: Inclusion = "+inclusion)
//       // console.log("Debug: Exclusion = "+exclusion)
//       var inclusionList: string[] = [];
//       if (inclusion != "") {inclusionList = inclusion.split(", ");}

//       for (let i = 0; i < quoteList.length; i++) {
//         found = false;
//         getKeywordPrompt = `Get the single most important keyword from the following sentence: "${quoteList[i]}"\n\nAVOID the following words: ${exclusion}.`;
//         // console.log("Debug for quote" + i + ": getKeywordPrompt =\n" + getKeywordPrompt);
//         if (inclusion != "") {for (let j = 0; j < inclusionList.length; j++) {
//           if (quoteList[i].includes(inclusionList[j])) {
//             keywordList.push(inclusionList[j]);
//             exclusion += ", " + inclusionList[j];
//             // console.log("Debug for quote" + i + ": Inclusion: "+ inclusionList[j] +" was pushed into keywordList.");
//             found = true;
//             break;
//           }
//         }}
//         if (found === false) {
//           response = await openai.chat.completions.create({  // const response = await openai.chat.completions.create
//             model: 'gpt-3.5-turbo',
//             messages: [
//               { role: 'system', content: keywordSystemPrompt },
//               { role: 'user', content: getKeywordPrompt },
//             ],
//           });
//           answer = response.choices[0].message.content;
//           if (answer) {
//             keywordList.push(answer);
//             exclusion += ", " + answer;
//           }
//           else keywordList.push("NULL"); // ChatGPT가 keyword를 이상하게 뽑아낸 경우, NULL이라는 글자를 keyword로 넣는다(밀려쓰기 방지용)
//           // console.log("Debug for quote" + i + ": Keyword from OpenAI: "+ answer +" was pushed into keywordList.");
//         }
//       }

//       // console.log("Debug: keywordList =\n" + keywordList);

//       return new CodeResponse(
//         Result.SUCCESS,
//         "성공적으로 keywordList를 받아왔습니다.",
//         JSON.stringify(keywordList)
//       );
//     } catch (error) {
//       return new CodeResponse(
//         Result.ERROR,
//         "keywordList를 받아오는 과정에서 에러가 발생했습니다.",
//         error
//       );
//     }
//   }
// }
