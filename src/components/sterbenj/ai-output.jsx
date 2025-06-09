import React, { useState, useRef, useEffect } from "react";
// Corrected: Use CDN URLs for dependencies to resolve import errors.
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// --- Main App Component ---
// This component renders the main application layout and the streaming component.

// --- StreamingResponseComponent ---
// This component handles fetching, rendering Markdown, and exporting to PDF.
export default function StreamingResponseComponent2({ scanResult }) {
  console.log(scanResult, "this is the scan result");
  // Hardcoded values for the model and endpoint
  const apiEndpoint = "http://10.254.10.25:11434/api/generate";
  const model = "gemma3";

  // State for the user's prompt
  const prompt = `
  I am a Cyber Security Analyst , I am investigating a potential security issue , 
  generate a cyber security Vulnerability Assessment Report in the main domain and each of subdomains, base on the provided information below:

  


  
  ${scanResult}

  
  `;
  // State to hold the raw streamed markdown content
  const [streamedContent, setStreamedContent] = useState("");
  // State to manage the loading/streaming status
  const [isLoading, setIsLoading] = useState(false);
  // State to track if the stream is complete, enabling the export button
  const [isComplete, setIsComplete] = useState(false);
  // State for any potential errors
  const [error, setError] = useState(null);
  // Ref to the DOM element that contains the content to be exported
  const contentRef = useRef(null);

  /**
   * Fetches and processes a streaming response from the specified API endpoint.
   */
  const fetchStream = async () => {
    setIsLoading(true);
    setIsComplete(false);
    setError(null);
    setStreamedContent(""); // Clear previous content

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt, stream: true }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error("The response body is null.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;
          try {
            const parsedJson = JSON.parse(line);
            if (parsedJson.response) {
              setStreamedContent((prev) => prev + parsedJson.response);
            }
            if (parsedJson.done) {
              reader.cancel();
              break;
            }
          } catch (e) {
            console.warn("Failed to parse JSON line:", line, e);
          }
        }
      }
      setIsComplete(true); // Mark stream as complete
    } catch (err) {
      console.error("Error fetching stream:", err);
      setError(
        `Failed to fetch stream. Check console & CORS policy on the server.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Exports the rendered content to a PDF file.
   */
  const exportToPdf = () => {
    if (!contentRef.current || !isComplete) return;

    // Temporarily set a specific background color for canvas capture
    const originalBg = contentRef.current.style.backgroundColor;
    contentRef.current.style.backgroundColor = "white";

    html2canvas(contentRef.current, {
      scale: 2, // Increase resolution for better quality
      useCORS: true,
      logging: true,
    })
      .then((canvas) => {
        // Restore original background color
        contentRef.current.style.backgroundColor = originalBg;

        const imgData = canvas.toDataURL("image/png");
        // A4 dimensions in points. jsPDF uses points by default.
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Calculate the aspect ratio to fit the content within the A4 page width
        const ratio = canvasWidth / canvasHeight;
        let imgWidth = pdfWidth - 40; // With some margin
        let imgHeight = imgWidth / ratio;

        // Handle content that is longer than one page
        let heightLeft = imgHeight;
        let position = 20; // Top margin

        pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 40;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight; // Or position = position - pdfHeight for next page
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight - 40;
        }

        pdf.save("white-paper-export.pdf");
      })
      .catch((err) => {
        console.error("Error exporting to PDF:", err);
        setError("Could not export to PDF. See console for details.");
      });
  };

  useEffect(() => {
    fetchStream();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto min-w-[8in]">
      {/* --- Header & Configuration --- */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          AI Report Generator
        </h1>
        {/* <p className="text-black mb-6">
          Enter a prompt to generate a report, then export it as a PDF. (Using
          model: {model})
        </p> */}

        {/* <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-black mb-1"
          >
            Prompt
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div> */}
      </div>

      {/* --- Action Buttons --- */}
      <div className="p-6 flex flex-col sm:flex-row gap-4">
        {/* <button
          onClick={fetchStream}
          disabled={isLoading || !prompt.trim()}
          className="flex-1 text-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </button> */}
        <button
          onClick={exportToPdf}
          disabled={!isComplete || isLoading}
          className="flex-1 text-center px-6 py-3 font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          {isLoading ? "Generating..." : "Export to PDF"}
        </button>
      </div>

      {/* --- Error Display --- */}
      {error && (
        <div className="p-6 pt-0">
          <div className="p-4 text-center bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* --- Display Area for "White Paper" --- */}
      <div className="p-2 sm:p-6 md:p-10 border-t border-gray-200 bg-gray-50 text-black">
        <div
          ref={contentRef}
          className="bg-white p-8 sm:p-12 shadow-lg min-h-[24rem] prose prose-lg max-w-[8in] prose-headings:font-bold prose-a:text-blue-600"
        >
          {streamedContent ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {streamedContent}
            </ReactMarkdown>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              {isLoading
                ? "Stream in progress..."
                : "Generated content will appear here."}
            </div>
          )}
          {isLoading && streamedContent && (
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse ml-2"></span>
          )}
        </div>
      </div>
    </div>
  );
}
