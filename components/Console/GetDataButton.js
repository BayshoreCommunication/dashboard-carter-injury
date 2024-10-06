const GetDataButton = ({ setData }) => {
  const handleAuthClick = async () => {
    try {
      const response = await fetch("/api/google/data", {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        const { rows } = result;

        let data = {
          labels: [],
          clicks: [],
          impressions: [],
        };

        for (let i = 0; i < rows.length; i++) {
          const { keys, clicks, impressions } = rows[i];
          data.labels.push(keys[0]);
          data.clicks.push(clicks);
          data.impressions.push(impressions);
        }

        setData(data);
      } else {
        console.error("Authentication failed");
        // setMessage("Authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error.message);
    }
  };

  return (
    <div>
      {/* <p>{message}</p> */}
      <button
        type="button"
        onClick={handleAuthClick}
        className="bg-gray-500 text-white px-6 py-1.5 rounded-full"
      >
        Get Data
      </button>
    </div>
  );
};

export default GetDataButton;
