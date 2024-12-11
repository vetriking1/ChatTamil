try{

    fetch('http://127.0.0.1:5000/chat'
        , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Hello, World!"
            })
        }
    )
   .then(data =>data.json()).then(d => {console.log(d.response)})
}
catch(error){
    console.log(error)
}
