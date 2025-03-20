import { useEffect } from "react"

const sampleFetch = async () => {
    const response = await fetch('http://localhost:3000/api/linked-pages?url=https://google.com' , {
        method: "GET"
    })
    const res = await response.json()
    return res
}

export default function Sample(){
    useEffect(() => {
        sampleFetch().then(res => console.log(res, 'this is a sample fetch'))
    },[])
    return(
        <h1>Hello</h1>
    )
}