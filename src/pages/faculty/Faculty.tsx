import axios from "axios";
import Single from "../../components/single/MechanicSingle";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./faculty.scss";

const Faculty = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [user, setUser] = useState(null);

  //Fetch data and send to Single Component
  const fetchUser = async () => {
    try {
      const res = await axios.get(`https://api.mfeel.co.in/partner/${id}`);
      console.log("driver", res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="user">
      <Single user={user} />
    </div>
  );
};

export default Faculty;
