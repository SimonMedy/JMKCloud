import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Check, X, ArrowLeft, Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/layout/TopBar";

type Status = "loading" | "success" | "error";

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmRegistration } = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>("");
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);

  const session_id = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const confirmUserRegistration = async () => {
      if (hasConfirmed || !session_id) return;

      try {
        await confirmRegistration(session_id);
        setStatus("success");
        setHasConfirmed(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 3500);
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    };

    confirmUserRegistration();
  }, [confirmRegistration, session_id, navigate, hasConfirmed]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold">
              Finalisation de votre inscription
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
              <h2 className="text-2xl font-semibold">Inscription réussie !</h2>
              <p className="text-gray-500">
                Votre compte a été créé avec succès.
                <br />
                Vous allez être redirigé vers votre tableau de bord...
              </p>
            </div>
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
              <h2 className="text-2xl font-semibold">
                Une erreur est survenue
              </h2>
              <p className="text-gray-500">{error}</p>
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

export default RegisterSuccess;
