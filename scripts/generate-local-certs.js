const fs = require("fs");
const path = require("path");

async function main() {
  let selfsigned;
  try {
    selfsigned = require("selfsigned");
  } catch {
    console.error("Install selfsigned first: npm install -D selfsigned");
    process.exit(1);
  }

  const pems = await selfsigned.generate([{ name: "commonName", value: "localhost" }], {
    days: 365,
    keySize: 2048,
    algorithm: "sha256",
    extensions: [
      {
        name: "subjectAltName",
        altNames: [
          { type: 2, value: "localhost" },
          { type: 7, ip: "127.0.0.1" },
        ],
      },
    ],
  });

  const dir = path.join(process.cwd(), "certificates");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "localhost-key.pem"), pems.private);
  fs.writeFileSync(path.join(dir, "localhost.pem"), pems.cert);
  console.log("Wrote certificates/localhost.pem and localhost-key.pem");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
