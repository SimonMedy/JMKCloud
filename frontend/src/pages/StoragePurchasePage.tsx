import { useState } from "react";
import { Cloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/stripe/PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51PtS3gDJ66rdGj7ekLvpx39p8txfAmxrb2HqnaxKlt7vN5B7QxBQQ8QjcTpqbki2CK0FJ2Y6beROHIVGSL2on4Bp00o8l49AgG"
);

interface StorageOption {
  id: number;
  name: string;
  storage: string;
  price: string;
  features: string[];
}

const storageOptions: StorageOption[] = [
  {
    id: 1,
    name: "Basic",
    storage: "20 Go",
    price: "20",
    features: [
      "20 Go supplémentaires à vie",
      "Chiffrement de bout en bout",
      "Support prioritaire 24/7",
    ],
  },
  {
    id: 2,
    name: "Pro",
    storage: "40 Go",
    price: "40",
    features: [
      "40 Go supplémentaires à vie",
      "Chiffrement de bout en bout",
      "Support prioritaire 24/7",
    ],
  },
  {
    id: 3,
    name: "Premium",
    storage: "60 Go",
    price: "60",
    features: [
      "60 Go supplémentaires à vie",
      "Chiffrement de bout en bout",
      "Support prioritaire 24/7",
    ],
  },
];

export default function StoragePurchasePage() {
  const [selectedOption, setSelectedOption] = useState<StorageOption | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchase = (option: StorageOption) => {
    setSelectedOption(option);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Augmentez votre espace de stockage cloud
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Achetez de l'espace supplémentaire permanent pour vos fichiers
        </p>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {storageOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="px-6 py-8">
                <div className="flex items-center justify-center mb-4">
                  <Cloud className="w-12 h-12 text-orange-500" />
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-900 mb-2">
                  {option.name}
                </h3>
                <p className="text-5xl font-bold text-center text-orange-500 mb-4">
                  {option.storage}
                </p>
                <p className="text-2xl font-bold text-center text-gray-700 mb-6">
                  {option.price}€
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {" "}
                    paiement unique
                  </span>
                </p>
                <ul className="mb-8">
                  {option.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-600 mb-2"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handlePurchase(option)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                  Acheter maintenant
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer votre achat</DialogTitle>
            <DialogDescription>
              Veuillez vérifier les détails de votre achat et procéder au
              paiement.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <h4 className="font-semibold text-lg mb-2">Récapitulatif</h4>
            <p>Option : {selectedOption?.name}</p>
            <p>Stockage supplémentaire : {selectedOption?.storage}</p>
            <p>Prix : {selectedOption?.price}€ (paiement unique)</p>
          </div>
          <div className="mt-4">
            {selectedOption && (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={parseInt(selectedOption.price) * 100}
                  storageAmount={parseInt(selectedOption.storage)}
                />
              </Elements>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
