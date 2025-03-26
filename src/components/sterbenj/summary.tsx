import styled from "styled-components";
import Nav from "components/Form/Nav";
import Heading from "components/Form/Heading";
import colors from "styles/colors";
import { useLocation } from "react-router-dom";
import ResultRow from "pages/ResultRow";

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

const SummaryPage = (): JSX.Element => {
  const location = useLocation();
  console.log(location.state);
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
          <Heading color={colors.textColor} size="medium">
            Scan Result
          </Heading>
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
