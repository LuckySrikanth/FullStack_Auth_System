import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./Users.css";

interface User {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get(`/users?page=${page}&search=${search}`)
      .then((res) => setUsers(res.data));
  }, [page, search]);

  const deleteUser = async (id: number) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
     <div className="users-page"> 
    <div className="users-container">
      <h2 className="users-title">Users</h2>

      <input
        className="users-search"
        placeholder="Search user"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="users-list">
        {users.length === 0 && (
          <p className="empty-text">No users found</p>
        )}

        {users.map((u) => (
          <div key={u.id} className="user-card">
            <span className="user-name">{u.name}</span>

            {user?.role === "admin" && (
              <button
                className="delete-btn"
                onClick={() => deleteUser(u.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
    </div>
  );
};

export default Users;
