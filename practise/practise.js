const add = (a,b)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(a+b)
        },2000)
    })
}

const doWork = async()=>{
    const sum = await add(3,4);
    const sum1 = await add(sum,4);
    const sum2 = await add(sum1,4);
    return sum2
}
doWork().then(result =>{
    console.log("result is ",result)
}).catch(e =>{
    console.log("e",e)
})