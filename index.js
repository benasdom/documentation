function getdate(text){
    let year=new Date().getFullYear();
    text.innerText=text.innerText.replace("Unity Elites",year+" Unity Elites");

}
getdate(document.querySelector(".copy"));


document.body.onload=()=>{
    setTimeout(()=>{
    // let val=setInterval(()=>{
    //     numm+=1;
    //     if(numm<named.length+1){
    //         logoname.innerText=named.substr(0,numm);
    //     }
    // else{
    // clearInterval(val)}
    // },100) 
    // document.querySelector(".loader").style.cssText="opacity:0;z-index:-2";
    document.querySelector(".rmaincontent").style.animationName="slid";
},100);
}

function hideOptions(){

    [...document.querySelectorAll(".leftmain")].map(a=>a.classList.toggle("a"));
    [...document.querySelectorAll(".right")].map(a=>a.classList.toggle("b"));
    [...document.querySelectorAll(".lmaintop")].map(a=>a.classList.toggle("c"));
    [...document.querySelectorAll(".subtopa")][1].classList.toggle("d");
    [...document.querySelectorAll(".lmaintop")].map(a=>a.children[1].classList.toggle("e"));


    
}
document.querySelector(".hider")
.addEventListener('click',hideOptions)