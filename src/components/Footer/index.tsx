import { Link } from 'react-router-dom';
import './styles.scss';

function Footer() {
  return (
    <footer className="container__footer">
      <Link to="*" className="footer__content">Qui sommes-nous ?</Link>
      <Link to="*" className="footer__content">Mentions Légales</Link>
    </footer>
  );
}

export default Footer;
