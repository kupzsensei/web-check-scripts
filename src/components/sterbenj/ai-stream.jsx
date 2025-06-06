import { useState } from "react";

export default function StreamingResponseComponent() {
    // State for the streaming API endpoint
    const [apiEndpoint, setApiEndpoint] = useState('http://10.254.10.25:11434/api/generate');
    // State for the model name, now defaulting to 'gemma3'
    const [model, setModel] = useState('gemma3');
    // State for the user's prompt, now defaulting to an empty string
    const [prompt , setPrompt] = useState('prompt here');
    // State to hold the streamed text content
    const [streamedContent, setStreamedContent] = useState('');
    // State to manage the loading status
    const [isLoading, setIsLoading] = useState(false);
    // State for any potential errors
    const [error, setError] = useState(null);
  
    /**
     * Fetches and processes a streaming response from the specified API endpoint.
     * This function is designed to work with APIs that return a stream of newline-delimited JSON objects,
     * such as the Ollama /api/generate endpoint.
     */
    const fetchStream = async () => {
      setIsLoading(true);
      setError(null);
      setStreamedContent(''); // Clear previous content
  
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            prompt: prompt,
            stream: true, // Ensure streaming is enabled
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (!response.body) {
          throw new Error("The response body is null.");
        }
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
  
        // Loop to continuously read from the stream
        while (true) {
          const { done, value } = await reader.read();
  
          if (done) {
            // Stream is finished
            break;
          }
  
          // Decode the chunk and add it to our buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process all complete JSON objects in the buffer
          const lines = buffer.split('\n');
          
          // The last line might be incomplete, so we keep it in the buffer
          buffer = lines.pop() || ''; 
  
          for (const line of lines) {
            if (line.trim() === '') continue; // Skip empty lines
            try {
              const parsedJson = JSON.parse(line);
              // Assuming the streamed JSON has a "response" field with the text
              if (parsedJson.response) {
                setStreamedContent((prevContent) => prevContent + parsedJson.response);
              }
              // Check if the generation is done
              if (parsedJson.done) {
                  reader.cancel(); // Stop reading from the stream
                  break;
              }
            } catch (e) {
              console.warn("Failed to parse JSON line:", line, e);
            }
          }
        }
  
      } catch (err) {
        console.error("Error fetching stream:", err);
        // NOTE: A common error is a CORS issue. The server at the API endpoint
        // must be configured to allow requests from the origin this app is running on.
        // For Ollama, you may need to set OLLAMA_ORIGINS environment variable.
        setError(`Failed to fetch the data stream. Check the console and ensure the API server allows CORS.`);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        {/* --- Input Configuration --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
           <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">Model Name</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., gemma3"
            />
          </div>
          <div>
            <label htmlFor="api-endpoint" className="block text-sm font-medium text-gray-300 mb-1">API Endpoint</label>
            <input
              type="text"
              id="api-endpoint"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="http://localhost:11434/api/generate"
            />
          </div>
        </div>
  
        <div className="mb-6">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">Prompt</label>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Enter your prompt here..."
          />
        </div>
        
        <div className="text-center mb-6">
          <button
            onClick={fetchStream}
            disabled={isLoading || !prompt.trim() || !model.trim()}
            className="px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            {isLoading ? 'Generating...' : 'Generate Response'}
          </button>
        </div>
  
        {/* --- Display Area for Streamed Content --- */}
        <div className="bg-gray-900 rounded-lg p-4 h-80 min-h-[20rem] overflow-y-auto border border-gray-700 whitespace-pre-wrap font-mono text-gray-300">
          {streamedContent}
          {isLoading && !streamedContent && (
            <span className="text-gray-500">Waiting for stream to start...</span>
          )}
          {isLoading && streamedContent && (
            <span className="inline-block w-3 h-3 bg-cyan-400 rounded-full animate-pulse ml-2" aria-label="typing indicator"></span>
          )}
        </div>
  
        {/* --- Error Message Display --- */}
        {error && (
          <div className="mt-4 text-center p-3 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </div>
    );
  }