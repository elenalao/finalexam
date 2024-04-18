import axios from "axios"; // Importing Axios for making HTTP requests
import "./App.css"; // Importing CSS file for styling
import { useEffect, useState } from "react"; // Importing useEffect and useState hooks from React
import PhotoGallery from "./components/PhotoGallery"; // Importing the PhotoGallery component

axios.defaults.baseURL = "http://localhost:5000"; // Setting the default base URL for Axios requests

export default function App() {
  const [arts, setArts] = useState([]); // State variable to store arts data

  // useEffect hook to fetch arts data when the component mounts
  useEffect(() => {
    axios
      .get("/api/arts") // Sending a GET request to fetch arts data from the server
      .then((res) => {
        setArts(res.data); // Updating the arts state variable with the fetched data
      })
      .catch((err) => {
        console.log("Error from ArtList"); // Logging an error if the request fails
        console.log(err);
      });
  }, []); // Passing an empty dependency array to run the effect only once when the component mounts

  // Function to add a bid to an art piece
  const addBid = (id, bidName, bidAmount) => {
    const art = arts.find((art) => art._id === id); // Finding the art object by its ID

    // Checking if the new bid amount is less than all existing bids
    const isLessThanAllBids = art.bids.every((bid) => bid.bid < bidAmount);

    if (isLessThanAllBids) {
      const newBid = { user: bidName, bid: bidAmount }; // Creating a new bid object
      art.bids.push(newBid); // Adding the new bid to the art object
      axios.post(`/api/art/${id}`, art).then((response) => {
        console.log("Updated bids"); // Logging a message after successfully updating the bids
      });
    } else {
      console.log("The bid is less than the highest bid."); // Logging a message if the bid amount is not higher than all existing bids
    }
  };

  return (
    <div className="App">
      <div className="photo-gallery">
        {/* Mapping through the arts array and rendering PhotoGallery component for each art */}
        {arts.map((art, key) => (
          <PhotoGallery key={key} arts={art} addBid={addBid} />
        ))}
      </div>
    </div>
  );
}