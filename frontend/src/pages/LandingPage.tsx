import { Cloud, Lock, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ElementType } from "react";
import TopBar from "@/components/layout/TopBar";

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  description: string;
}

const Header = () => {
  const navigate = useNavigate();
  return (
    <TopBar
      leftContent={
        <Link
          to="/"
          className="flex items-center text-orange-500 hover:text-orange-600"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500 text-white mr-2">
            <Cloud className="size-5" />
          </div>
          <span className="font-bold">JMK Cloud</span>
        </Link>
      }
      rightContent={
        <>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 hover:text-orange-500"
            to="/"
          >
            Fonctionnalités
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 hover:text-orange-500"
            to="/"
          >
            Tarifs
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 hover:text-orange-500"
            to="/"
          >
            Contact
          </Link>
          <Button
            size="sm"
            onClick={() => navigate("/login")}
            className="bg-orange-500 hover:bg-orange-600 font-semibold ml-4"
          >
            Connexion
          </Button>
        </>
      }
    />
  );
};

const Hero = () => (
  <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Stockez vos données en toute sécurité
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Commencez avec 20 Go de stockage sécurisé pour un paiement unique,
            et étendez votre espace selon vos besoins.
          </p>
        </div>
        <div className="space-x-4">
          <Button
            onClick={() => (window.location.href = "/register")}
            className="font-semibold"
          >
            Obtenez 20 Go à vie pour 20€
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "#features")}
          >
            En savoir plus
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 items-center justify-center">
        <FeatureCard
          icon={Cloud}
          title="Stockage Cloud"
          description="Accédez à vos fichiers partout, à tout moment. Votre contenu toujours à portée de main."
        />
        <FeatureCard
          icon={Lock}
          title="Sécurité Maximale"
          description="Vos données sont chiffrées et protégées. Nous prenons votre sécurité au sérieux."
        />
        <FeatureCard
          icon={Expand}
          title="Évolutif"
          description="Augmentez votre espace selon vos besoins. Grandissez sans limites avec JMK Cloud."
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div
    id="features"
    className="flex flex-col items-center space-y-4 text-center"
  >
    <div className="bg-orange-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
      <Icon className="h-12 w-12 text-orange-500" />
    </div>
    <h2 className="text-2xl font-bold">{title}</h2>
    <p className="max-w-[300px] text-gray-500 dark:text-gray-400">
      {description}
    </p>
  </div>
);

const CTA = () => (
  <section className="w-full py-12 md:py-24 lg:py-32">
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Prêt à obtenir plus de stockage ?
          </h2>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
            Obtenez 20 Go de stockage initial pour un paiement unique, et
            accédez à des options d'extension de stockage selon vos besoins.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => (window.location.href = "/register")}
          className="font-semibold"
        >
          S'inscrire et obtenir 20 Go à vie
        </Button>
      </div>
    </div>
  </section>
);

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <CTA />
      </main>
    </div>
  );
};

export default LandingPage;
