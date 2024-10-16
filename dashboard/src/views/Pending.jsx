import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate to handle navigation

const Pending = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleChatSupport = () => {
    navigate("/seller/dashboard/chat-support"); // Navigate to chat-support page
  };

  return (
    <div style={{ color: "white", textAlign: "center", margin: "10px 0" }}>
      <p>
        Account Pending . . . Please Contact Admin for Approval and Usage of the
        Platform as Seller.
      </p>
      <button
        onClick={handleChatSupport}
        style={{
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Chat Admin
      </button>
    </div>
  );
};

export default Pending;
