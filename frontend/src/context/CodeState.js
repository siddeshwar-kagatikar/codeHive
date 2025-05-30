import { useState } from 'react';
import CodeContext from './codeContext';

const CodeState = (props) => {

    const [prevcode, setprevCode] = useState("");
    const [plags, setPlags] = useState("");
    const host = "http://localhost:5000";

    const getCode = async (qid, language) => {
        try{
            const response = await fetch(`${host}/api/code/fetchcode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({ qid, language })
            });
            const json = await response.json();
            // console.log(json);
            setprevCode(json);
        }catch(err){
            console.log(err);
        }
    }

    const getAllCode = async () => {
        try {
            const response = await fetch(`${host}/api/code/fetchallcode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                }
            });
            const json = await response.json();
            console.log(json);
            return json;
        } catch (err) {
            console.log(err);
        }
    }

    const saveCode = async (qid, language, code, solved) => {
        console.log(language,code);
        const response = await fetch(`${host}/api/code/savecode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ qid, code, language, solved })
        });
        const json = await response.json();
        console.log(json);
        // setprevCode(json.code); 
    }

    const plagCheck = async (qid) => {
        try {
            const response = await fetch(`${host}/api/code/plagcheck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ qid })
            });

            const json = await response.json();
            setPlags(json.comparisons || []); // Safely access comparisons
            console.log(json);
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <CodeContext.Provider value={{ prevcode, plags, getCode, getAllCode, saveCode, plagCheck }}>
          {props.children}
        </CodeContext.Provider>
      );
};

export default CodeState;

