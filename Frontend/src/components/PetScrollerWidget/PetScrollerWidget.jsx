import PropTypes from 'prop-types';
import './PetScrollerWidget.css';
import { useMemo } from "react";

export default function PetScrollerWidget({
  organizationIds,
  title = "Perfect Pet Finder",
  limit = "12",
}) {
  // Read env *safely* (these are strings at build time)
  const envOrg =
    import.meta.env.VITE_PETFINDER_ORG_JSON ||
    import.meta.env.VITE_PETFINDER_ORG_IDS ||
    "";

  // Build the final organization JSON string:
  // - if organizationIds prop is provided, use it
  // - otherwise use env
  const orgJson = useMemo(() => {
    // If caller passes an array, convert it to JSON array string
    if (Array.isArray(organizationIds) && organizationIds.length > 0) {
      return JSON.stringify(organizationIds);
    }

    // If caller passes a string, assume it is already JSON array string
    if (typeof organizationIds === "string" && organizationIds.trim()) {
      return organizationIds.trim();
    }

    // Fall back to env string
    return typeof envOrg === "string" ? envOrg.trim() : "";
  }, [organizationIds, envOrg]);

  // If no org IDs configured, show a friendly message instead of crashing
  if (!orgJson) {
    return (
      <p style={{ margin: "16px 0" }}>
        To enable the live Petfinder widget, set{" "}
        <code>VITE_PETFINDER_ORG_JSON</code> in your build environment to a JSON
        array string, e.g. <code>[\"YOUR-ORG-UUID\"]</code>.
      </p>
    );
  }

  return (
    <pet-scroller
      s3Url="https://dbw3zep4prcju.cloudfront.net/"
      apiBase="https://psl.petfinder.com/graphql"
      organization={orgJson}
      status="adoptable"
      petfinderUrl="https://www.petfinder.com/"
      hideBreed="true"
      limit={String(limit)}
      petListTitle={title}
    />
  );
}


PetScrollerWidget.propTypes = {
  organizationIds: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  title: PropTypes.string,
  limit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
