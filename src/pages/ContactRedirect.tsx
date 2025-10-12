import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/', { replace: true });
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [navigate]);
  
  return null;
};

export default ContactRedirect;
