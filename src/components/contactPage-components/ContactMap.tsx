function ContactMap() {
  // Kampala coordinates: 0.328568, 32.590748
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7554283319328!2d32.61472767363893!3d0.3217061640205008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbbf07cc4477f%3A0xc7b9a06ce9e18e20!2sMUTUMBA%20MUKOBE%20AND%20ASSOCIATES!5e0!3m2!1sen!2sug!4v1773045744968!5m2!1sen!2sug`
  return (
    <div className="py-0">
      <div className="w-full h-[300px] md:h-[450px] relative overflow-hidden">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="APF Uganda Office Location - Kampala"
        />
      </div>
    </div>
  )
}

export default ContactMap
