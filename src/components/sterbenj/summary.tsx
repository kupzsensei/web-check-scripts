import styled from "styled-components";
import Nav from "components/Form/Nav";
import Heading from "components/Form/Heading";
import colors from "styles/colors";
import { useLocation } from "react-router-dom";
import ResultRow from "pages/ResultRow";
import DownloadFile from "./download-file";
import { useEffect, useState } from "react";

const ResultsOuter = styled.div`
  display: flex;
  flex-direction: column;
  .masonry-grid {
    display: flex;
    width: auto;
  }
  .masonry-grid-col section {
    margin: 1rem 0.5rem;
  }
`;

const ResultsContent = styled.section`
  width: 95vw;
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  margin: auto;
  width: calc(100% - 2rem);
  padding-bottom: 1rem;
`;



const FilterButtons = styled.div`
  width: 95vw;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  .one-half {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }
  button,
  input,
  .toggle-filters {
    background: ${colors.backgroundLighter};
    color: ${colors.textColor};
    border: none;
    border-radius: 4px;
    font-family: "PTMono";
    padding: 0.25rem 0.5rem;
    border: 1px solid transparent;
    transition: all 0.2s ease-in-out;
  }
  button,
  .toggle-filters {
    cursor: pointer;
    text-transform: capitalize;
    box-shadow: 2px 2px 0px ${colors.bgShadowColor};
    transition: all 0.2s ease-in-out;
    &:hover {
      box-shadow: 4px 4px 0px ${colors.bgShadowColor};
      color: ${colors.primary};
    }
    &.selected {
      border: 1px solid ${colors.primary};
      color: ${colors.primary};
    }
  }
  input:focus {
    border: 1px solid ${colors.primary};
    outline: none;
  }
  .clear {
    color: ${colors.textColor};
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.8rem;
    opacity: 0.8;
  }
  .toggle-filters {
    font-size: 0.8rem;
  }
  .control-options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    a {
      text-decoration: none;
    }
  }
`;

const SummaryPage = (): JSX.Element => {
  const location = useLocation();
  const [loadingState , setLoadingState] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingState(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

    return (
      <main
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
      <ResultsOuter>
        <Nav>
            {!loadingState ? (
            <Heading color={colors.textColor} size="medium">
              <DownloadFile />
            </Heading>
            ) : (
            <Heading color={colors.textColor} size="medium">
              Scanning...
            </Heading>
            )}
        </Nav>
      
      </ResultsOuter>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          flex: 1,
          margin: "0 1rem",
          minHeight: 0,
          minWidth: 0,
          overflow: "auto",
        }}
      >
        <table>
          {/* <thead>
            <tr>
              <th>Domain</th>
              <th>Server Location</th>
              <th>SSL Certificate</th>
              <th>DNS Server</th>
              <th>Tech Stack</th>
              <th>DNSSEC</th>
              <th>Headers</th>
              <th>DNS Records</th>
              <th>HTTP Security</th>
              <th>Threats</th>
              <th>Socia Tags</th>
              <th>TLS Cipher Suites</th>
              <th>Archive History</th>
              <th>Block Lists</th>
              <th>HSTS Check</th>
              <th>Server Status</th>
              <th>Security.Txt</th>
              <th>Redirects</th>
              <th>Trace Routes</th>
              <th>TLS Handshake Simulation</th>
              <th>Firewall</th>
              <th>TLS Security Issues</th>
              <th>Linked Pages</th>
              <th>Open Ports</th>
              <th>Carbon Footprint</th>
            </tr>
          </thead> */}
          <tbody>
            {location.state?.map((obj: string) => (
              <ResultRow key={obj} address={obj} />
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default SummaryPage;
