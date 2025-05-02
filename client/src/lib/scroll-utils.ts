// Utility for smooth scrolling to sections when clicking on navigation links

export const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    // Check if we're in a new page load, and the URL has a hash
    if (window.location.hash && window.location.hash.substring(1) === id) {
      // We need a small delay for the DOM to be fully loaded
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

// Function to be used with Link components to enable smooth scrolling
export const handleSectionNavigation = (id: string): (() => void) => {
  return () => {
    // Update URL hash to reflect the section (for direct links and browser history)
    window.history.pushState({}, '', `/#${id}`);
    scrollToSection(id);
  };
};