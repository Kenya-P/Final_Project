import PetScrollerWidget from '../PetScrollerWidget/PetScrollerWidget.jsx';
import PropTypes from 'prop-types';

export default function Main() {
  return (
    <main>
      <PetScrollerWidget />
    </main>
  );
}

Main.propTypes = {
  // Petfinder widget
  petfinderOrgIds: PropTypes.arrayOf(PropTypes.string),
};
