const languageCodeMap = {
    'python': 92,
    'cpp': 54,
    'java': 91,
    'javascript': 93
}

// const tokenId = '2e979232-92fd-4012-97cf-3e9177257d10';
async function getSubmission(tokenId,callback) {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key': '88f80e396emsh932ceb359d5e283p18c4e0jsn634b83dcacc1'
        }
    };

    try{
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    }catch(err){
        callback({
            apiStatus: 'error',
            message: JSON.stringify(err)
        });
    }
}


export async function makeSubmission({code, language, callback, stdin}) {
    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
    const httpOptions = {
        method: 'POST',
        headers: {
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key': '88f80e396emsh932ceb359d5e283p18c4e0jsn634b83dcacc1',
            'content-type': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language_id: languageCodeMap[language],
            source_code: btoa(code),
            stdin: btoa(stdin)
        })
    }

    try{
        callback({apiStatus: 'loading'});
        const response = await fetch(url, httpOptions);
        const result = await response.json();
        const tokenId = result.token;
        let statusCode = 1;
        let apiSubmissionResult;
        while(statusCode === 1 || statusCode === 2){
            try{
                apiSubmissionResult = await getSubmission(tokenId);
                statusCode = apiSubmissionResult.status.id;
            }catch(err){
                callback({
                    apiStatus: 'error',
                    message: JSON.stringify(err)
                });
                return;
            }
        }

        if(apiSubmissionResult){
            callback({
                apiStatus: 'success',
                data: apiSubmissionResult
            });
        }

    }catch(err){
        callback({
            apiStatus: 'error',
            message: JSON.stringify(err)
        });
    }
}