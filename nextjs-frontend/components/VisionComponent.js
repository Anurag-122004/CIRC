import { useState } from "react";
import axios from "axios";

export default function VisionComponent() {
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const analyzeImage = async () => {
    if (!image) return alert("Please upload an image.");
    
    const formData = new FormData();
    formData.append("input_text", inputText);
    formData.append("image", image);

    try {
      const res = await axios.post(`${API_URL}/analyze-image`, formData);
      setResponse(res.data.response);
    } catch (error) {
      alert("Error analyzing image.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Image Analysis</h2>
      <input
        className="w-full p-2 border rounded mb-2"
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Describe the image..."
      />
      <input
        type="file"
        accept="image/*"
        className="w-full p-2 border rounded mb-2"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button className="bg-green-500 text-white p-2 rounded w-full" onClick={analyzeImage}>
        Analyze
      </button>
      {response && <p className="mt-4 p-2 bg-gray-200 rounded">{response}</p>}
    </div>
  );
}
