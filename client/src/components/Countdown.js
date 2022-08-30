import React, {useState, useEffect} from 'react'

function Countdown(){



    let dueDate = nextTuesday()

    const [countdown, setCountdown] = useState("")

    // let previous = 60

    useEffect(()=>{
            const x = setInterval(()=>{
            
            const now = new Date().getTime()

            const distance = Math.abs(dueDate-now)
            // console.log(countDownDate, now, distance)
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if(days > 6 && hours > 23 && minutes > 30){
                hours += 30
            }
            if(days > 6){
                days = 0
            }
        // if(seconds < previous){
            setCountdown(((days<10)?"0":"")+days + " : " + ((hours<10)?"0":"")+hours + " : "+ ((minutes<10)?"0":"")+minutes + " : " + ((seconds<10)?"0":"")+seconds)
        //     if(seconds <= 0){
        //         previous = 60
        //     }else{
        //         previous = seconds
        //     }
        // }

            if (distance < 0) {
                clearInterval(x)
                dueDate = nextTuesday
            }
        }, 1000)
    },[])

    function nextTuesday(){
        const d = new Date()
        d.setDate(d.getDate() + (((7 - d.getDay()) % 7 +2 ) % 7))
        d.setHours(20, 0, 0)
        d.getTime()
        return d
    }
    return(<div className="countdown">{countdown}</div>)
}

export default Countdown