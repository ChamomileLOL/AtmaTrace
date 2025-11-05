// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThoughtGraph from '../components/ThoughtGraph';

const API_URL = '/api/thoughts'; 

const Home = () => {
  const navigate = useNavigate();
  // Get the user object (which contains the JWT token) from Redux state
  const { user } = useSelector((state) => state.auth); 

  const [content, setContent] = useState('');
  const [emotionTag, setEmotionTag] = useState('Neutral');
  const [message, setMessage] = useState('');
  const [thoughts, setThoughts] = useState([]); // State to hold all fetched thoughts

  // 1. Authentication and Data Fetching Side Effect
  useEffect(() => {
    if (!user) {
      // If user is logged out, redirect to login page
      navigate('/login');
    } else {
      // If user is logged in, fetch their thoughts
      fetchThoughts(); 
    }
  }, [user, navigate]);


  // Function to fetch thoughts from the backend
  const fetchThoughts = async () => {
    if (!user) return;
    try {
      // Configuration to send the JWT token in the header
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, 
        },
      };
      const response = await axios.get(API_URL, config);
      setThoughts(response.data);
    } catch (error) {
       // Handle errors, e.g., token expired
       setMessage(`Error fetching thoughts: ${error.response?.data?.message || error.message}`);
    }
  };


  // 2. Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      setMessage('Thought content is required!');
      return;
    }
    
    // Configuration to send the JWT token in the header
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      // POST the new thought to the protected API
      const response = await axios.post(API_URL, { content, emotionTag }, config);

      // Clear the form and show success message
      setContent('');
      setEmotionTag('Neutral');
      setMessage(`Thought traced! ID: ${response.data._id}`);
      
      // Add the new thought to the local state (and therefore the graph)
      setThoughts(prevThoughts => [response.data, ...prevThoughts]);

    } catch (error) {
      setMessage(`Error tracing thought: ${error.response?.data?.message || error.message}`);
    }
  };

  // Do not render the component if the user is null and we are waiting for redirect
  if (!user) return null; 

  // 3. Render the UI
  return (
    <div className="pt-8">
      <h1 className="text-4xl font-serif font-light text-center text-gray-700 mb-2">
        "Who Am I?"
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Trace the source of your thoughts.
      </p>

      {/* Capture Thought Form */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Capture the Thought
        </h2>
        
        {message && (
            <p className={`mb-4 p-2 rounded-lg text-center ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
            </p>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none"
            rows="5"
            placeholder="What thought or feeling is present now? E.g., 'I feel anxious about tomorrow's meeting.'"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          
          <div className="mt-4 flex justify-between items-center">
             <select
                className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                value={emotionTag}
                onChange={(e) => setEmotionTag(e.target.value)}
             >
                <option value="Neutral">Neutral</option>
                <option value="Joy">Joy</option>
                <option value="Fear">Fear</option>
                <option value="Anger">Anger</option>
                <option value="Calm">Calm</option>
                <option value="Other">Other</option>
             </select>

             <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
             >
                Trace Thought
             </button>
          </div>
        </form>
      </div>

      {/* Graph Visualization Area */}
      <div className="mt-12 text-center">
         <h2 className="text-3xl font-light text-gray-700 mb-4">
             Your Graph of Consciousness ({thoughts.length} Nodes)
         </h2>
         <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
             {thoughts.length > 0 ? (
                 <ThoughtGraph thoughts={thoughts} />
             ) : (
                 <div className="h-96 w-full flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                     Enter your first thought to begin the graph visualization.
                 </div>
             )}
         </div>

         {/* Optional: Thoughts Log for debugging/list view */}
         <div className="mt-8 max-w-4xl mx-auto p-4 bg-white rounded-xl shadow border border-gray-100 text-left">
            <h3 className="font-semibold text-gray-700 mb-2">Thoughts Log:</h3>
            <div className="max-h-60 overflow-y-scroll">
                {thoughts.map(t => (
                    <p key={t._id} className="text-sm border-b border-gray-300 py-1">
                        **{t.emotionTag}**: {t.content} 
                        <span className="text-xs text-gray-500 ml-2">({new Date(t.createdAt).toLocaleTimeString()})</span>
                    </p>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Home;