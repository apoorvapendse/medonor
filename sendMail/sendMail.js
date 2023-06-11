import nodemailer from 'nodemailer' 


let sendMail = (email,product,quality)=>{
    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"teammedonor@gmail.com",
            pass:"yvtcauwzkalasybh"
        }
    });
    let mailOptions = {
        from:"teammedonor@gmail.com",
        to:["sarveshpendse110503@gmail.com","apoorvavpendse@gmail.com","srujan.pat2004@gmail.com","hrishikeshpotnis3304@gmail.com","neharajas170289@gmail.com"],
        subject:"Donation of medical equipment",
        html:`
        <main>
        <h3>Hello, we are Team Medonor 
        <h5>We link people who want to donate medical equipment with the people who need it the most<h5>
        <p>We have a donor who is willing to donate ${quality} ${product}</p> 
        
        <p>If you are interested you can contact his email:${email}
        
        <span style="display: none !important;">11111</span>
        </p>
        <p>You can visit our site by clicking <a href="https://medonor.onrender.com">Here<span style="display: none !important;">23232</span></p>
       
        </main>
        `
    }
    
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("mail sent:",info.response)
        }
    })
}
export default sendMail;