const MediaInput = ({ label = "Select File", style, ...inputProps }) => {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#f1f1f1",
        minWidth: "500px",
        minHeight: "100px",
        borderRadius: "2px",
        cursor: "pointer",
        height: "300px",
        ...style,
      }}
    >
      <label
        htmlFor="file-input"
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <p
          style={{
            padding: "16px",
            backgroundColor: "purple",
            fontWeight: "bold",
            color: "white",
            borderRadius: "2px",
          }}
        >
          {label}
        </p>
      </label>
      <input
        type="file"
        name="file"
        id="file-input"
        {...inputProps}
        style={{
          opacity: 0,
          width: "0.1px",
          height: "0.1px",
          position: "absolute",
        }}
      />
    </div>
  );
};

export default MediaInput;
