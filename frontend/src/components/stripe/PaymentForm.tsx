import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PaymentFormProps {
  amount: number;
  storageAmount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, storageAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post("/api/create-payment-intent", {
          amount,
          storageAmount,
        });
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(
          "Impossible de créer l'intention de paiement. Veuillez réessayer."
        );
      }
    };
    createPaymentIntent();
  }, [amount, storageAmount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe n'est pas chargé. Veuillez réessayer.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Élément de carte non trouvé. Veuillez réessayer.");
      setProcessing(false);
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (payload.error) {
      setError(`Erreur de paiement: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiement</CardTitle>
        <CardDescription>
          Entrez les détails de votre carte pour procéder au paiement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {succeeded && (
            <Alert className="mt-4">
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>
                Votre paiement a été traité avec succès!
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={processing || !stripe || succeeded}
          className="w-full"
        >
          {processing ? "Traitement..." : "Payer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
