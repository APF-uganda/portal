import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import SEO from '../components/common/SEO'
import ContactHero from '../components/contactPage-components/ContactHero'
import ContactForm from '../components/contactPage-components/ContactForm'
import ContactMap from '../components/contactPage-components/ContactMap'

function ContactPage() {
  return (
    <div>
      <SEO 
        title="Contact Us"
        description="Get in touch with the Accountancy Practitioners Forum. Contact us for inquiries, support, or membership information. We're here to help."
        keywords="contact APF, get in touch, support, inquiries, location, contact form"
      />
      <Navbar />
      <ContactHero />
      <ContactForm />
      <ContactMap />
      <Footer />
    </div>
  )
}

export default ContactPage
