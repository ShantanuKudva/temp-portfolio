import type { CollectionConfig } from "payload";

/**
 * Reshapes the API-key collection that `mcpPlugin` registers.
 *
 * Passed to the plugin as `overrideApiKeyCollection` rather than applied by a
 * later plugin: the collection is pushed onto the config during mcpPlugin's own
 * execution, so a plugin running afterwards does not reliably see it.
 *
 * Three changes: the plugin titles rows by an optional `label`, so a key saved
 * without one renders as "[untitled]" — that field becomes required. The
 * collection moves to Account, since the rest of the sidebar is organised by
 * page. And the setup steps render above the list, next to the button that
 * creates a key.
 */
export const overrideMcpApiKeys = (collection: CollectionConfig): CollectionConfig => {
  const fields = collection.fields.map((field) => {
    if (!("name" in field)) return field;

    if (field.name === "label" && field.type === "text") {
      return {
        ...field,
        required: true,
        admin: {
          ...field.admin,
          description: 'What this key is for, e.g. "Claude on my laptop".',
        },
      };
    }

    if (field.name === "description" && field.type === "text") {
      return {
        ...field,
        admin: {
          ...field.admin,
          description: "Optional note — who is using it, or when it can be revoked.",
        },
      };
    }

    return field;
  });

  return {
    ...collection,
    fields,
    labels: { singular: "AI access key", plural: "AI access keys" },
    admin: {
      ...collection.admin,
      group: "Account",
      useAsTitle: "label",
      defaultColumns: ["label", "description", "user"],
      description:
        "Keys that let an AI assistant read and edit this site's content. Each key acts as the person it belongs to. Treat one like a password, and delete any you no longer use.",
      components: {
        ...collection.admin?.components,
        beforeListTable: ["/components/admin/mcp-setup#McpSetup"],
      },
    },
  };
};
