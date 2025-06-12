import { MyContext } from "index";
import { useContext } from "react";

export type Item = {
  jobID: string;
  address: string;
  data: any;
};

const DownloadFile = () => {
  const arrayFile = useContext(MyContext)?.data as Item[]; // Ensure arrayFile is typed as Item[]
  const downloadArrayAsTxt = (data: Item[]) => {
    let fileContent = "";

    // Iterate through each object in the array
    data.forEach((item) => {
      fileContent += `<jobID ${item.jobID}>\n<address ${
        item.address
      }>\n<data ${JSON.stringify(item.data, null, 2)}>\n\n`;
    });

    const blob = new Blob([fileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.txt";
    link.click();
  };

  return (
    <div>
      <button
        style={{
          border: "1px solid lightgreen",
          backgroundColor: "transparent",
          outline: "1px solid lightgreen",
          padding: "10px 20px",
          color: "white",
        }}
        onClick={() => downloadArrayAsTxt(arrayFile ?? [])}
      >
        Download Scan Result
      </button>
    </div>
  );
};

export default DownloadFile;
