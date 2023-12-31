const express=require("express");
const bodyParser=require("body-parser");
const https = require('https');
require('dotenv').config()


const app =express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render(__dirname+"/public/index.ejs")
});

app.post('/submit',(req,res)=>{
    
    const city=req.body.city;
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_ID}&units=metric`;
    https.get(url,(response)=>{
        //console.log(response);
        response.on('data',(data)=>{
            try {
                const weatherData = JSON.parse(data);
                
                if (weatherData.cod === '404') {
                    // Handle the case when the city is not found
                    res.render(__dirname + "/public/submit.ejs", { temp: null, humidity: null, description: null, wind: null, city, err: 'City not found' });
                } else {
                    // Parse and render the weather data
                    const temp = weatherData.main.temp;
                    const description = weatherData.weather[0].description;
                    const wind = weatherData.wind.speed;
                    const humidity = weatherData.main.humidity;
            
                    res.render(__dirname + "/public/submit.ejs", { temp, humidity, description, wind, city, err: null });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.render(__dirname + "/public/submit.ejs", { temp: null, humidity: null, description: null, wind: null, city, err: 'Error fetching weather data' });
            }
        });
    });

});
   


app.listen(3000,()=>{
    console.log("server running at port :3000");
})