const userTab = document.querySelector("[data-UserWeather]");
const searchTab = document.querySelector("[data-SearchWeather]");
const userContainer = document.querySelector(".Weather-container");

const grantAccessContainer = document.querySelector(".grant-location-Container");
const  searchFrom = document.querySelector("[data-Searchfrom]");
const loadingScreen = document.querySelector(".loading-Container");

const  userInfoContainer = document.querySelector(".your-info-container");

// initally variable need 
let oldTab = userTab ;
const API_KEY = "12099c9a82c1baa936609b882e54533a";
oldTab.classList.add("current-tab");
 getfromSessionStorage();
    
//  ek kaam ornepending hai 
function switchTab(newTab){
    if(newTab != oldTab){
       oldTab.classList.remove("current-tab");
       oldTab = newTab;
       oldTab.classList.add("current-tab");
    

if(!searchFrom.classList.contains("active")){
   userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    searchFrom.classList.add("active");
}

else{
    // search vale tab par pe tha ab your weather tab visible karana hai 
    searchFrom.classList.remove("active");
   userInfoContainer.classList.remove("active");
    // ab me your weather vale tab me a gaya hu to weather bhi display karna padega 
    getfromSessionStorage();
}
    }
}

userTab.addEventListener("click", () =>{
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
    switchTab(searchTab);
});

// check if cordinate are alredy  present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
   
    if(!localCoordinates){
        // yadi local cordinate nahi mile to  

        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
}
}

 async function fetchUserWeatherInfo(coordinates){
    const{lat, lon} = coordinates;
    // make grantcontainer invisible 
    grantAccessContainer.classList.remove("active");
    // make a loader visible 
    loadingScreen.classList.add("active");
     // Api call  
    try{ 
        const response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
   
        ); 
    const data =  await  response.json() ; 
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
        catch(err){
         loadingScreen.classList.remove("active");

        }

}

function renderWeatherInfo(weatherInfo){
   const cityName =  document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]")
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-Weather-icon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-Cloudiness]");


// agar json me jo property ssearch kar rahe agar o hai to visible kara dega nahi to 
// check krne ke liye optional chaining operater laga diya 


cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/w80/${weatherInfo.sys.country.toLowerCase()}.png`;
desc.innerText = weatherInfo?.weather?.[0]?.description;
weatherIcon.src =
`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;
temp.innerText = `${weatherInfo?.main?.temp}  °C`;
windspeed.innerText  = `${weatherInfo?.wind?.speed} m/s`;
humidity.innerText = `${weatherInfo?.main?.humidity} % `;
cloudiness.innerText = `${weatherInfo?.clouds?.all} % `;

}

function getLocation(){
    if(navigator.geolocation){
     navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{

    }
    function showPosition(position){
        
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
      sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
      fetchUserWeatherInfo(userCoordinates);
    }
}

const grantAccessButton = document.querySelector("[data-Grant-Access]");
 grantAccessButton.addEventListener("click",getLocation);

 const searchInput = document.querySelector("[data-searchInput]");

 searchFrom.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

 async function fetchSearchWeatherInfo(city){
      loadingScreen.classList.add("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");

      try{
           const response = await fetch(
               `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await  response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
      }
      catch{
        
      }
}



