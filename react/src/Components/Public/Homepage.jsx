import StickyNavbar from "./NavBar/NavBar";
import CommonSection from './CommonSection'

function Homepage() {
  return (
    <>
      <StickyNavbar current='home' />
      <CommonSection />
    </>
  );
}

export default Homepage;
