import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
    <p className="text-xs text-gray-500 dark:text-gray-400">
      © 2024 JMK Cloud. Tous droits réservés.
    </p>
    <nav className="sm:ml-auto flex gap-4 sm:gap-6">
      <Link className="text-xs hover:underline underline-offset-4" to="#">
        Conditions d'utilisation
      </Link>
      <Link className="text-xs hover:underline underline-offset-4" to="#">
        Politique de confidentialité
      </Link>
    </nav>
  </footer>
);

export default Footer;