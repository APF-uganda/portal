import heroImage from "../../assets/images/Events/Hero.jpg";

const HeroSection = () => {
    return (
        <div
            className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: `url(${heroImage})` }}
        >
            {/* Overlay Text */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <h1 className="text-5xl md:text-8xl font-bold tracking-[0.1em]">
                    EVENTS
                </h1>
            </div>
        </div>
    );
};

export default HeroSection;
