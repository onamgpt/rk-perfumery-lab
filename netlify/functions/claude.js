exports.handler = async function(event) {
  if(event.httpMethod === 'OPTIONS'){
    return {statusCode:200,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS'},body:''};
  }
  if(event.httpMethod !== 'POST'){
    return {statusCode:405,body:'Method Not Allowed'};
  }
  
  var apiKey = process.env.ANTHROPIC_API_KEY;
  if(!apiKey){
    return {statusCode:500,headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({error:{message:'ANTHROPIC_API_KEY not set in environment variables'}})};
  }

  try {
    var body = JSON.parse(event.body);
    var response = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key': apiKey,
        'anthropic-version':'2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: body.max_tokens || 1500,
        system: body.system || '',
        messages: body.messages
      })
    });
    var data = await response.json();
    return {
      statusCode: 200,
      headers: {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {statusCode:500,headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({error:{message:e.message}})};
  }
};
