import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get(`/users/${id}`).then(res => setUser(res.data));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {user.profileImage && (
        <img src={user.profileImage} alt="profile" width={120} />
      )}
    </div>
  );
};

export default UserProfile;
