import React, { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import LogInStore from "./AuthStore";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";

const MainPage = () => {
  const isLoggedIn = LogInStore((state) => state.isLoggedIn);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const handleMessages = async () => {
    if (!prompt.trim()) return;

    try {
      const authToken = localStorage.getItem("Authorization");
      setLoading(true);
      const response = await axios.get(
        `https://katalyst-backend-zlx6.onrender.com/chat?query=${encodeURIComponent(prompt)}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const responseData = response.data;
      setLoading(false);
      setMessages(responseData.result || []);
      setPrompt("");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
    finally{
        setLoading(false);
    }
  };

  const events = messages.filter((m) => m.type === "event");
  const messageCards = messages.filter((m) => m.type === "message");

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-neutral-900 min-h-screen px-12 py-6 text-white font-serif mt-12">
        <h1 className="text-3xl font-bold mb-1" >Please log in to continue</h1>
        <h2 className="text-lg font-semibold mb-6">
          The server may take up to 2 minutes to initialize after a cold start.
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 min-h-screen px-12 py-6 text-white font-serif flex flex-col">
      <h1 className="text-3xl font-extrabold mb-3 mt-12 text-white">Welcome</h1>
    <p className="text-gray-300 max-w-xl leading-relaxed text-sm">
    This calendar tool helps you effortlessly manage your events, track important dates, and stay organized with real-time updates.
    </p>


      {/* Events section grows and scrolls if needed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-auto mb-6">
        {events.map((event, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border font-sans h-fit ${
              event.isCompleted
                ? "border-green-700/30 bg-neutral-800/20 shadow-black/40 shadow-sm"
                : "border-blue-700/30 bg-neutral-800/20 shadow-black/40 shadow-sm"
            } shadow-md hover:shadow-xl transition`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">{event.title}</h2>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  event.isCompleted
                    ? "bg-green-700/40 text-green-300"
                    : "bg-blue-700/40 text-blue-300"
                }`}
              >
                {event.isCompleted ? "Completed" : "Upcoming"}
              </span>
            </div>

            <div className="text-sm text-gray-300">
              <p>
                <strong>Time:</strong> {formatDate(event.time)}
              </p>
              <p>
                <strong>Duration:</strong> {event.duration} mins
              </p>
              {event.attendees?.length > 0 && (
                <p>
                  <strong>Attendees:</strong> {event.attendees.join(", ")}
                </p>
              )}
              {event.description && (
                <p className="mt-2 text-gray-400 italic">"{event.description}"</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Messages list */}
      {messageCards.length > 0 && (
        <div className="mb-6 space-y-4 max-h-48 overflow-y-auto">
          {messageCards.map((msg, idx) => (
            <div
              key={idx}
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-5 py-3 text-gray-200 shadow-sm hover:shadow-md transition"
            >
            {msg.message}
            </div>
          ))}
        </div>
      )}

      {/* Input area fixed at bottom of container */}
      <div className="flex items-center gap-3">
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Enter your message"
          onKeyDown={(e) => e.key === "Enter" && handleMessages()}
          className="flex-grow rounded-3xl border border-neutral-700 bg-neutral-800 py-4 px-6 text-white text-xl placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleMessages}
          aria-label="Send Message"
          className="rounded-full bg-blue-600 p-4 hover:bg-blue-700 transition flex items-center justify-center"
        >
          {loading ? <BiLoaderAlt size={24} className="animate-spin"/> : <FiArrowUpRight size={24} />}
        </button>
      </div>
    </div>
  );
};

export default MainPage;
