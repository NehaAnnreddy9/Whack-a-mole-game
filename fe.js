//MVC Pattern-

const View = (()=>{

    const domSelector = {
        cir : document.getElementById("circles"),
        startg : document.getElementById("startgame"),
        scoreb: document.getElementById("score"),
        timel: document.getElementById("timeleft")
    }

    const render = (ele,x) =>{  //Function to render image
        const img = document.getElementById(ele.toString())
        if(x==2) {img.src = "./mine.jpeg"}
        else{img.src = "./mole.jpeg"}
        img.style.height = '200px'
        img.style.width = '200px' 
        img.style.visibility = 'visible'
    }

    const hide = (ele) =>{ //Function to hide image
        document.getElementById(ele).style.visibility = "hidden"
    }

    const renderTime = (timer) =>{  //Function to display time
        domSelector.timel.innerHTML = timer
    }

    const renderScore = (score) =>{ //Function to display score
        domSelector.scoreb.innerHTML = score
    }

    return {
        domSelector,
        render,
        hide,
        renderTime, renderScore
    }
})()


const Model = ((view) => {

    const {domSelector,render,hide,renderTime, renderScore} = view

    let objs = [{id:1,status:0},{id:2,status:0},{id:3,status:0},{id:4,status:0},{id:5,status:0},{id:6,status:0},{id:7,status:0},
        {id:8,status:0},{id:9,status:0},{id:10,status:0},{id:11,status:0},{id:12,status:0}] //array of objects having circles id and status

    const rand = (x) => { //select random id 
        r = Math.floor(Math.random() * (12 - 1 + 1) + 1);
        while(objs[r-1].status > 0)
        {
            r = Math.floor(Math.random() * (12 - 1 + 1) + 1);
        }
        if (x==1) {objs[r-1].status = 1}
        else {objs[r-1].status = 2}
        return r
    }

    return {
        rand,
        objs
    }
})(View)


const Controller = ((view, model) => {

        const {domSelector,render,hide,renderTime,renderScore} = view
        const {rand,objs} = model
        let score = 0
        let timer,timer2

        const changeHole = (id,x) =>{   //Function to change hole of mole and snake
            hide(id)
            let re = rand(x)
            objs[Number(id)-1].status = 0
            render(re,x)
            return re
        }

        domSelector.cir.addEventListener('click',(event)=>{ //function to make image dissappear on click or game over for snake
            let id = event.target.id
            if(id != "" && objs[Number(id)-1].status == 1){ //check if clicked on visible mole image
                score = score + 1
                renderScore(score)
                changeHole(id,1)
            }
            else if(id != "" && objs[Number(id)-1].status == 2){ //check if clicked on snake
                for(let i=1;i<13;i++){
                    objs[Number(i)-1].status = 2
                    render(i,2)
                }
                clearInterval(x)
                clearInterval(x2)
            }
        })

        const resetBoard = () => { //Function to reset board
            for(let i=1;i<13; i++){
                hide(i.toString())
                objs[i-1].status = 0
            }
        }

        const setTimer = () =>{ //to set timer and display time left
            timer = 30
            return x = setInterval(() => {
                if(timer > -1){
                    renderTime(timer)
                    timer = timer - 1
                }
                else{
                    clearInterval(x)
                    timer = 30
                    alert("Time is over!");
                    resetBoard() //reset board
                }
            },1000)
            return x
        }

        const setTimer2 = (one,two,three,mine) =>{  //Second timer to change positions of mole and snake every 2 seconds(if not changed)
            timer2 = 30
            let oldarr = [one,two,three] //array to store ids to be checked after 2 secs
            let m = mine
            return x2 = setInterval(() => {
                if(timer2 > 0){
                    if(timer2 < 30){
                        for(let i = 0; i < 12; i++){    
                            if(objs[i].status == 1  && oldarr.includes(i+1)){ //check if mole positions changed
                                changeHole(objs[i].id.toString(),1)
                            }
                        }
                        if(objs[m-1].status == 2){ //check if snake position changed
                            m = changeHole(objs[m-1].id.toString(),2)
                        }
                        oldarr = objs.filter(block => block.status == 1).map(x => x.id) //array to store ids to be checked after 2 secs(next iteration)
                    }
                    timer2 = timer2 - 2
                }
                else{
                    clearInterval(x2)
                    timer2 = 30
                }
            },2000)
            return x2
        }

        const bootstrap = () => {//bootstrap to start game on clicking on start game
            domSelector.startg.addEventListener('click', () => {
                if(timer != undefined && timer > -1){ //Clear old intervals on starting game again
                    clearInterval(x)
                }
                if(timer2 != undefined && timer2 > -1){
                    clearInterval(x2)
                }
                renderTime(30)
                renderScore(0)
                resetBoard() //reset board
                score = 0 //added score to zero
                //Start the game with any three positions
                const one = rand(1)
                const two = rand(1)
                const three = rand(1)
                const mine = rand(2)
                render(one,1)
                render(two,1)
                render(three,1)
                render(mine,2)
                setTimer()
                setTimer2(one,two,three,mine)
            })
        }
        return {bootstrap}
    

    })(View, Model)
    
Controller.bootstrap()
