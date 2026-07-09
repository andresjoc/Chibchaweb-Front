import './PlanCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PlanCard({ title, description, faIcon }) {
  return (
    <div className="plan-card">
      <div className="plan-icon">
        <FontAwesomeIcon icon={faIcon} className="plan-fa-icon" aria-hidden="true" />
      </div>
      <h2 className="plan-title">{title}</h2>
      <p className="plan-description">{description}</p>
    </div>
  );
}

export default PlanCard;
