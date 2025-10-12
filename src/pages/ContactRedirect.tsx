import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/', { replace: true });
    
    // Wait for content to load before scrolling
    const scrollToContact = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // Try multiple times with increasing delays to ensure content is loaded
    setTimeout(scrollToContact, 500);
    setTimeout(scrollToContact, 1000);
  }, [navigate]);
  
  return null;
};

export default ContactRedirect;
