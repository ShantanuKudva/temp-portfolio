import { getPayload } from "payload";
import config from "@payload-config";

/**
 * One-off account creation. Usage:
 *   EMAIL=… PASSWORD=… NAME=… npm run create-user
 * Payload has no email adapter configured, so this is also the recovery path
 * if everyone is locked out. See docs/DEPLOYMENT.md.
 */
const run = async () => {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const name = process.env.NAME;

  if (!email || !password) {
    console.error("EMAIL and PASSWORD env vars are required.");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    payload.logger.info(`User ${email} already exists — nothing to do.`);
    process.exit(0);
  }

  await payload.create({
    collection: "users",
    data: { email, password, ...(name ? { name } : {}) },
  });
  payload.logger.info(`Created user ${email}.`);
  process.exit(0);
};

await run();
