import type { Plugin } from "payload";

/**
 * The MCP plugin titles its API-key rows by the optional `label` field, so a key
 * saved without one shows up as "[untitled]". This runs after `mcpPlugin` and
 * makes the label required, files the collection under Account (the sidebar is
 * otherwise organised by page), and rewords the copy for a non-technical
 * reader.
 */
export const polishMcpApiKeys: Plugin = (config) => {
  const collection = config.collections?.find(
    (c) => c.slug === "payload-mcp-api-keys",
  );
  if (!collection) return config;

  collection.admin = {
    ...collection.admin,
    group: "Account",
    useAsTitle: "label",
    defaultColumns: ["label", "description", "user"],
    description:
      "Keys that let an AI assistant (like Claude) read and edit this site's content. Each key acts as the person it belongs to. Treat one like a password, and delete any you no longer use.",
  };

  collection.labels = { singular: "AI access key", plural: "AI access keys" };

  for (const field of collection.fields) {
    if (!("name" in field)) continue;

    if (field.name === "label" && field.type === "text") {
      field.required = true;
      field.admin = {
        ...field.admin,
        description: "What this key is for, e.g. \"Claude on my laptop\".",
      };
    }

    if (field.name === "description" && field.type === "text") {
      field.admin = {
        ...field.admin,
        description: "Optional note — who is using it, or when it can be revoked.",
      };
    }
  }

  return config;
};
