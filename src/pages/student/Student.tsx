import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./student.scss";
import axios from "axios";
import UserSingle from "../../components/single/UserSingle";

const Student = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [user, setUser] = useState(null);

  //Fetch data and send to Single Component
  const fetchUser = async () => {
    try {
      const res = await axios.get(`https://api.mfeel.co.in/user/${id}`);
      console.log("driver", res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  //Fetch data and send to Single Component

  return (
    <div className="user">
      <UserSingle user={user} />
    </div>
  );
};

export default Student;
