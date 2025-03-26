// const { exec } = require('child_process');
// const middleware = require('./_common/middleware');

// const handler = async (req, res) => {
//   try {
//     const url = req.query?.url; // Ensure req.query exists
//     if (!url) {
//       return res.status(400).json({ error: "No URL specified" });
//     }

//     let domain = url.replace(/^(?:https?:\/\/)?/i, ""); // Remove protocol if present

//     exec(`assetfinder --subs-only ${domain}`, (error, stdout, stderr) => {
//       if (error) {
//         return res.status(500).json({ error: `Error executing command: ${stderr || error.message}` });
//       }

//       const subdomains = stdout
//         .split('\n') // Split output into lines
//         .map(sub => sub.trim()) // Trim spaces
//         .filter(sub => 
//           sub &&                          // Not empty
//           !sub.includes('*') &&           // No wildcard subdomains
//           !/^(\d{1,3}\.){3}\d{1,3}$/.test(sub) && // No IP-based subdomains
//           !/^(alt\d+|smtp|mx|clients\d+|mail|ns\d+|aspmx|gmr-smtp|accounts|support|chat|calendar|drive|docs|classroom|play|firebase|cloud|chrome|blog|workspace|hangouts)\./.test(sub) // Exclude generic/unnecessary subs
//         )
//         .reduce((unique, sub) => unique.includes(sub) ? unique : [...unique, sub], []); // Remove duplicates

//       res.json({ domain, subdomains });
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = handler; // Remove middleware for debugging


const { exec } = require('child_process');

const handler = async (req, res) => {
  try {
    const url = req.query?.url; // Ensure req.query exists
    if (!url) {
      return res.status(400).json({ error: "No URL specified" });
    }

    let domain = url.replace(/^(?:https?:\/\/)?/i, ""); // Remove protocol if present

    exec(`assetfinder --subs-only ${domain}`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: `Error executing command: ${stderr || error.message}` });
      }

      const subdomains = stdout
        .split('\n') // Split output into lines
        .map(sub => sub.trim()) // Trim spaces
        .filter(sub => 
          sub &&                          // Not empty
          !sub.includes('*') &&           // No wildcard subdomains
          !/^(\d{1,3}\.){3}\d{1,3}$/.test(sub) // && // No IP-based subdomains
        //   !/^(alt\d+|smtp|mx|clients\d+|mail|ns\d+|aspmx|gmr-smtp|accounts|support|chat|calendar|drive|docs|classroom|play|firebase|cloud|chrome|blog|workspace|hangouts)\./.test(sub) // Exclude generic/unnecessary subs
        )
        .sort((a, b) => a.length - b.length) // Sort to keep shorter domain first (e.g., "something.com" before "www.something.com")
        .reduce((unique, sub) => {
          const rootDomain = sub.replace(/^www\./, ''); // Remove 'www.' to get the root domain
          if (!unique.has(rootDomain)) {
            unique.add(rootDomain);
            unique.add(sub); // Add the actual subdomain (if different from root)
          }
          return unique;
        }, new Set());

      res.json({ domain, subdomains: [...subdomains] });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = handler;

