import { useEffect } from "react"

const sampleFetch = async (domain:string) => {
    const response = await fetch(`http://localhost:3000/api/sub-domain?url=${domain}` , {
        method: "GET"
    })
    const res = await response.json()
    return res
}

export default function Sample({domain }: {domain: string}){
    useEffect(() => {
        sampleFetch(domain).then(res => console.log(res, 'this is a sample fetch'))
    },[domain])
    return(
        <h1>Hello</h1>
    )
}