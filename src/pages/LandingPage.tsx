import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/landingPage-components/Hero'
import Stats from '../components/landingPage-components/Stats'
import ChairMessage from '../components/landingPage-components/ChairMessage'
import ConnectingProfessionals from '../components/landingPage-components/ConnectingProfessionals'
import FeaturedEvents from '../components/landingPage-components/FeaturedEvents'
import LatestNews from '../components/landingPage-components/LatestNews'
import Partners from '../components/landingPage-components/Partners'
import * as cms from '../services/cmsApi' 

function LandingPage() {
 
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await cms.getHomepage();
       
        const content = response?.attributes || response;
        setCmsData(content);
      } catch (err) {
        console.error("CMS Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white font-black text-slate-300 animate-pulse">
        LOADING CONTENT...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
     
      <Hero data={cmsData?.hero} />
      <Stats data={cmsData?.stats} />
      <ChairMessage data={cmsData?.chairMessage} />
      <ConnectingProfessionals data={cmsData?.connectingProfessionals} />
      
      <FeaturedEvents />
      <LatestNews />
      
      <Partners data={cmsData?.partnerlogo} />
      <Footer />
    </div>
  )
}

export default LandingPage