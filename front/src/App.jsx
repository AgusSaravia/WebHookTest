import { useEffect, useState } from "react";
import React from "react";
import "./App.css";
import { octokit } from "./utils/Octokit";

const RepoInput = () => {
  const [formData, setFormData] = useState({ repository: "", username: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { repository, username } = formData;

      const response = await fetch("/api/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ owner: username, repo: repository }),
      });
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("Github Data: ", data);
      } else {
        console.error("Error: ", response.statusText);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <div>
      <form method="POST" onSubmit={handleSubmit}>
        <label htmlFor="Repository">
          Repository:
          <input
            type="text"
            name="repository"
            value={formData.repository}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="Repository">
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
    </div>
  );
};
function App() {
  return (
    <>
      <RepoInput />
    </>
  );
}

export default App;
