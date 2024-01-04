
import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import './app.css';
import axios from 'axios';
import  {format} from "timeago.js";
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage=window.localStorage;
  const [currentUser,setCurrentUser]=useState(null);
  const [pins, setPins] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [currentPlaceId,setcurrentPlaceId]=useState(null);
  const [newPlace,setNewPlace]=useState(null);
  const [title,setTitle]=useState(null);
  const [desc,setDesc]=useState(null);
  const [rating,setRating]=useState(0);
  const [star, setStar] = useState(0);
  const [showRegister,setShowRegister]=useState(false);
  const [showLogin,setShowLogin]=useState(false);


  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("http://localhost:8800/api/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick=(id,lat,long)=>{
    setcurrentPlaceId(id);
  }

  const handleAddClick = (e) => {
    const { lngLat } = e;
    setNewPlace({
      lat: lngLat.lat,
      long: lngLat.lng,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
  
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };
  
    try {
      console.log("Making POST request with data:", newPin);
      const res = await axios.post("http://localhost:8800/api/pins", newPin);
      console.log("POST request successful:", res.data);
  
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.error("POST request failed:", err);
    }
  };
  const handleLogout=()=>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  }
  

  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      initialViewState={{
        longitude: 75,
        latitude: 16,
        zoom: 4,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={handleAddClick}
      
    >
      {pins &&
        pins.map((p) => (
          <>
            <Marker longitude={p.long} latitude={p.lat}>
              <RoomIcon style={{ fontSize: 20, color: p.username===currentUser?"tomato": 'slateblue',cursor:'pointer ' }} 
              onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
              />
            </Marker>
            {showPopup && p._id ===currentPlaceId && (
             
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                onClose={() => setcurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p>{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                   {Array(p.rating).fill(<StarIcon/>)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
              
            )}
          </>
        ))}
        {newPlace&&(
        <Popup
                longitude={newPlace.long}
                latitude={newPlace.lat}
                anchor="left"
                onClose={() => setNewPlace(null)}
              >
                <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
                </div>
              </Popup>
              )}
             {currentUser? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
/>)}
    </Map>   
  );
}

export default App;
