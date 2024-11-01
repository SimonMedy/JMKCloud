import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, ArrowLeft, Cloud } from "lucide-react";
import { AuthContextType } from "@/types/auth";
import TopBar from "@/components/layout/TopBar";

const ConfirmEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { confirmEmail } = useAuth() as AuthContextType;
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const url = await confirmEmail(token);
        setPaymentUrl(url);
        setStatus("success");
      } catch (error) {
        console.error("Erreur de confirmation:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, confirmEmail]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold">
              Vérification de votre email
            </h2>
            <p className="text-gray-500">
              Veuillez patienter quelques instants...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Email vérifié !</h2>
              <p className="text-gray-500">
                Vous pouvez maintenant finaliser votre inscription
              </p>
            </div>
            {paymentUrl && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Pour activer votre compte, procédez au paiement de votre
                  espace de stockage.
                </p>
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = paymentUrl)}
                >
                  Procéder au paiement
                </Button>
              </div>
            )}
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Vérification échouée</h2>
              <p className="text-gray-500">
                Le lien de confirmation n'est plus valide ou a expiré.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/register")}
              className="w-full"
            >
              Retourner à l'inscription
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <TopBar
        leftContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Button>
        }
        rightContent={
          <Link
            to="/"
            className="flex items-center text-orange-500 hover:text-orange-600 mr-2"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500 text-white mr-2">
              <Cloud className="size-5" />
            </div>
            <span className="font-bold">JMK Cloud</span>
          </Link>
        }
      />
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-6">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
