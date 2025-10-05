import React, { useState } from "react";

interface PrimaryButtonProps {
  title: string;
  onClick: () => void;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onClick,
  style = {},
  textStyle = {},
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: disabled
          ? "#ECFDF3"
          : isHovered
          ? "#ABEFC6" // darker blue on hover
          : "#FF9933",
        border: "none",
        borderRadius: 24,
        height: 50,
        padding: "0 16px",
        color: "#fff",
        fontSize: 16,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
        transition: "background-color 0.2s ease",
        ...style,
      }}
    >
      <span style={{ ...textStyle }}>{title}</span>
    </button>
  );
};

export default PrimaryButton;
