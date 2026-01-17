import PropTypes from 'prop-types';
import './PetScrollerWidget.css';

/**
 * Petfinder "Custom Pet List" widget is a Web Component (<pet-scroller>).
 * In React, treat its attributes as STRINGS (not JSX objects).
 *
 * organization must be a JSON-array string, e.g. '["ORG_UUID"]'.
 */
export default function PetScrollerWidget({
  organizationIds,
  title = 'Perfect Pet Finder',
  limit,
}) {
  // Prefer prop -> fallback to env (support both names)
  const envOrg =
    import.meta.env.VITE_PETFINDER_ORG_JSON ||
    import.meta.env.VITE_PETFINDER_ORG_IDS;

  const orgJson = Array.isArray(organizationIds)
    ? JSON.stringify(organizationIds)
    : typeof organizationIds === 'string'
      ? organizationIds
      : envOrg;

  const limitStr = String(
    limit ?? import.meta.env.VITE_PETFINDER_LIMIT ?? '12'
  );

  // If org ids aren't configured, render a helpful hint instead of a broken widget.
  if (!orgJson || String(orgJson).trim() === '') {
    return (
      <div className="petfinder-widget">
        <p className="petfinder-widget__hint">
          To enable the live Petfinder widget, set{' '}
          <code>VITE_PETFINDER_ORG_JSON</code> (or{' '}
          <code>VITE_PETFINDER_ORG_IDS</code>) in your <code>.env</code> to a JSON
          array string of organization UUIDs, e.g.{' '}
          <code>["YOUR-ORG-UUID"]</code>.
        </p>
      </div>
    );
  }

  return (
    <section className="petfinder-widget" aria-label="Petfinder widget">
      <pet-scroller
        s3Url="https://dbw3zep4prcju.cloudfront.net/"
        apiBase="https://psl.petfinder.com/graphql"
        organization={orgJson}
        status="adoptable"
        petfinderUrl="https://www.petfinder.com/"
        hideBreed="true"
        limit={limitStr}
        petListTitle={title}
      />
    </section>
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
