import styled from "styled-components";
import colors from "styles/colors";
import Card from "components/Form/Card";
import Heading from "components/Form/Heading";
import { useState, useEffect, ReactNode } from "react";
import { NavigateOptions, useNavigate } from "react-router-dom";
import { determineAddressType } from "utils/address-type-checker";

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
  //   start insert
  const defaultPlaceholder = "e.g. https://cecuri.com/";
  const [errorMsg, setErrMsg] = useState("");
  const [placeholder] = useState(defaultPlaceholder);
  const [inputDisabled] = useState(false);
  const navigate = useNavigate();

  /* Check is valid address, either show err or redirect to results page */
  const subScan = (userInput: string) => {
    let address = userInput.endsWith("/") ? userInput.slice(0, -1) : userInput;
    const addressType = determineAddressType(address);

    if (addressType === "empt") {
      setErrMsg("Field must not be empty");
    } else if (addressType === "err") {
      setErrMsg("Must be a valid URL, IPv4 or IPv6 Address");
    } else {
      // if the addressType is 'url' and address doesn't start with 'http://' or 'https://', prepend 'https://'
      if (addressType === "url" && !/^https?:\/\//i.test(address)) {
        address = "https://" + address;
      }
      const resultRouteParams: NavigateOptions = {
        state: { address, addressType },
      };
      //   navigate(`/results/${encodeURIComponent(address)}`, resultRouteParams);
      //   window.open(`/results/${encodeURIComponent(address)}`, "_blank");
      window.open(
        `${window.location.origin}/results/${encodeURIComponent(address)}`,
        "_blank"
      );
    }
  };
  // end insert
  useEffect(() => {
    sampleFetch(domain).then((res) => {
      if (res.subdomains) {
        setSubdomains(res.subdomains);
      }
    });
  }, [domain]);

  const btnScanAll = () => {
    // navigate("/summary", { state: subdomains });
    navigate("/summary", { state: subdomains });
  };

  return (
    <>
      <ReShowContainer className={!hideLoader ? "hidden" : ""}>
        <DismissButton onClick={() => setHideLoader(false)}>
          Show Load State
        </DismissButton>
      </ReShowContainer>
      <LoadCard className={hideLoader ? "hidden" : ""}>
        <StatusInfoWrapper>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <h1>Subdomains</h1>
            {subdomains.length === 0 ? null : (
              <button
                onClick={btnScanAll}
                style={{
                  padding: "3px 1rem",
                  border: "2px solid darkgreen",
                  height: "max-content",
                  backgroundColor: "transparent",
                  color: "white",
                  cursor: "pointer",
                  boxShadow: "0 0 5px black",
                }}
              >
                Scan all
              </button>
            )}
          </div>
        </StatusInfoWrapper>

        <Details>
          <summary>
            Show Subdomains{" "}
            <p
              style={{
                marginLeft: "10px",
                fontWeight: "bold",
                color: "lightgreen",
              }}
            >
              {subdomains.length === 0 ? "Loading data..." : subdomains.length}
            </p>
          </summary>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxHeight: "400px",
              overflowY: "auto",
              //   height: "400px",
              gap: "1rem",
            }}
          >
            {subdomains?.map((sub) => (
              <li
                key={sub}
                style={{
                  padding: "0 1rem",
                  boxShadow: "0 0 0 2px black",
                  border: "1px solid green",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  height: "max-content",
                }}
              >
                <p>{sub}</p>
                <button
                  onClick={() => {
                    subScan(sub);
                  }}
                  style={{
                    padding: "2px 5px 2px 5px",
                    color: "lightgreen",
                    border: "1px solid gray",
                    backgroundColor: "transparent",
                    height: "max-content",
                    cursor: "pointer",
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
