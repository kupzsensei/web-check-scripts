import styled from "styled-components";
import colors from "styles/colors";
import Card from "components/Form/Card";
import Heading from "components/Form/Heading";
import { useState, useEffect, ReactNode } from "react";

const LoadCard = styled(Card)`
  margin: 0 auto 1rem auto;
  width: 95vw;
  position: relative;
  transition: all 0.2s ease-in-out;
  &.hidden {
    height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${colors.bgShadowColor};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarSegment = styled.div<{
  color: string;
  color2: string;
  width: number;
}>`
  height: 1rem;
  display: inline-block;
  width: ${(props) => props.width}%;
  background: ${(props) => props.color};
  background: ${(props) =>
    props.color2
      ? `repeating-linear-gradient( 315deg, ${props.color}, ${props.color} 3px, ${props.color2} 3px, ${props.color2} 6px )`
      : props.color};
  transition: width 0.5s ease-in-out;
`;

const Details = styled.details`
  transition: all 0.2s ease-in-out;
  summary {
    margin: 0.5rem 0;
    font-weight: bold;
    cursor: pointer;
  }
  summary:before {
    content: "►";
    position: absolute;
    margin-left: -1rem;
    color: ${colors.primary};
    cursor: pointer;
  }
  &[open] summary:before {
    content: "▼";
  }
  ul {
    list-style: none;
    padding: 0.25rem;
    border-radius: 4px;
    width: fit-content;
    li b {
      cursor: pointer;
    }
    i {
      color: ${colors.textColorSecondary};
    }
  }
  p.error {
    margin: 0.5rem 0;
    opacity: 0.75;
    color: ${colors.danger};
  }
`;

const StatusInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .run-status {
    color: ${colors.textColorSecondary};
    margin: 0;
  }
`;

const AboutPageLink = styled.a`
  color: ${colors.primary};
`;

const SummaryContainer = styled.div`
  margin: 0.5rem 0;
  b {
    margin: 0;
    font-weight: bold;
  }
  p {
    margin: 0;
    opacity: 0.75;
  }
  &.error-info {
    color: ${colors.danger};
  }
  &.success-info {
    color: ${colors.success};
  }
  &.loading-info {
    color: ${colors.info};
  }
  .skipped {
    margin-left: 0.75rem;
    color: ${colors.warning};
  }
  .success {
    margin-left: 0.75rem;
    color: ${colors.success};
  }
`;

const ReShowContainer = styled.div`
  position: relative;
  &.hidden {
    height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  button {
    background: none;
  }
`;

const DismissButton = styled.button`
  width: fit-content;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: ${colors.background};
  color: ${colors.textColorSecondary};
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: PTMono;
  cursor: pointer;
  &:hover {
    color: ${colors.primary};
  }
`;

const FailedJobActionButton = styled.button`
  margin: 0.1rem 0.1rem 0.1rem 0.5rem;
  background: ${colors.background};
  color: ${colors.textColorSecondary};
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: PTMono;
  cursor: pointer;
  border: 1px solid ${colors.textColorSecondary};
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${colors.primary};
    border: 1px solid ${colors.primary};
  }
`;

const ErrorModalContent = styled.div`
  p {
    margin: 0;
  }
  pre {
    color: ${colors.danger};
    &.info {
      color: ${colors.warning};
    }
  }
`;

const sampleFetch = async (domain: string) => {
  const response = await fetch(
    `http://localhost:3000/api/sub-domain?url=${domain}`,
    {
      method: "GET",
    }
  );
  const res = await response.json();
  return res;
};

const Subdomain = ({ domain }: { domain: string }): JSX.Element => {
  const [hideLoader, setHideLoader] = useState<boolean>(false);
  const [subdomains, setSubdomains] = useState<string[]>([]);
  useEffect(() => {
    sampleFetch(domain).then((res) => {
      if (res.subdomains) {
        setSubdomains(res.subdomains);
      }
    });
  }, [domain]);

  return (
    <>
      <ReShowContainer className={!hideLoader ? "hidden" : ""}>
        <DismissButton onClick={() => setHideLoader(false)}>
          Show Load State
        </DismissButton>
      </ReShowContainer>
      <LoadCard className={hideLoader ? "hidden" : ""}>
        <StatusInfoWrapper>
          <h1>Subdomains</h1>
        </StatusInfoWrapper>

        <Details>
          <summary>Show Subdomains <p style={{marginLeft: '10px' , fontWeight:'bold', color: 'lightgreen'}}>{subdomains.length}</p></summary>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxHeight: "400px",
              overflowY:'auto',
              height: '400px',
              gap: "1rem",
            }}
          >
            {subdomains?.map((sub) => (
              <li
                key={sub}
                style={{
                  padding: ".2rem 1rem",
                  boxShadow: "0 0 0 2px black",
                  border: "1px solid green",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <p>{sub}</p>
                <button
                  style={{
                    padding: "2px 5px 2px 5px",
                    color: "lightgreen",
                    border: "1px solid gray",
                    backgroundColor: "transparent",
                    height: "max-content",
                  }}
                >
                  scan
                </button>
              </li>
            ))}
          </ul>
        </Details>
        <DismissButton onClick={() => setHideLoader(true)}>
          Dismiss
        </DismissButton>
      </LoadCard>
    </>
  );
};

export default Subdomain;
